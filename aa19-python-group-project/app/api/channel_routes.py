from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Channel, Server, ServerMember, db, Message, ChannelMembers, Reaction
from app.forms import ChannelForm
from datetime import datetime
import logging

channel_routes = Blueprint('channels', __name__)

# Helper function to check if the user is a member of the server
def is_server_member(user_id, server_id):
	return ServerMember.query.filter(
		ServerMember.user_id == user_id,
		ServerMember.server_id == server_id
	).first()

# Helper function to convert a channel to a dictionary
def channel_to_dict(channel):
	return {
		'id': channel.id,
		'name': channel.name,
		'server_id': channel.server_id,
		'created_at': channel.created_at.isoformat(),
		'updated_at': channel.updated_at.isoformat()
	}


# Channel Routes

# Eli added this route
# get all message in channel based on channel id, return dict with message id, user username
# , and content of the message
# pretty sure I missing check to see if user is part of the server
# Wei added check for user/server, tested and working.
@channel_routes.route('/<int:channel_id>/messages')
@login_required
def get_all_messages_in_channel(channel_id):
    channel = Channel.query.get(channel_id)
    if not channel:
        return jsonify({"message": "Bad request", "errors": {"channel": "Channel not found"}}), 404

    if not is_server_member(current_user.id, channel.server_id):
        return jsonify({'message': 'Forbidden', 'errors': {'server': 'Not a member of the server'}}), 403

    messages = Message.query.filter(Message.channel_id == channel_id).all()
    return jsonify([{
        "id": message.id,
        "user": message.user.username, 
        "content": message.content
    } for message in messages]), 200


@channel_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_channel_by_id(id):
	"""
	Query for a channel by id and returns that channel in a dictionary.
	Authentication: Required
	Authorization: Required (user must be a member of the server)
	"""
	if current_user.is_authenticated:
		channel = Channel.query.get(id)
		if channel:
			server_member = is_server_member(current_user.id, channel.server_id)
			if not server_member:
				return {'errors': {'message': 'Forbidden'}}, 403

			return channel_to_dict(channel)
		return {'errors': {'message': 'Channel not found'}}, 404
	return {'errors': {'message': 'Unauthorized'}}, 401

@channel_routes.route('/<int:id>', methods=['PATCH'])
@login_required
def update_channel(id):
    """
    Updates a channel by id.
    Authentication: Required
    Authorization: Required (user must be the server owner or channel creator)
    """
    if current_user.is_authenticated:
        channel = Channel.query.get(id)
        if not channel:
            return {'errors': {'message': 'Channel not found'}}, 404

        server_member = is_server_member(current_user.id, channel.server_id)
        if not server_member:
            return {'errors': {'message': 'Forbidden'}}, 403

        data = request.get_json()
        new_name = data.get('name', None)

        if new_name is None:
            return {'errors': {'message': 'New channel name is required'}}, 400

        server = Server.query.get(channel.server_id)
        if server.owner_id != current_user.id and channel.creator_id != current_user.id:
            return {'errors': {'message': 'Unauthorized'}}, 403

        channel.name = new_name
        db.session.commit()
        return channel_to_dict(channel)
    return {'errors': {'message': 'Unauthorized'}}, 401


@channel_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_channel(id):
	"""
	Deletes a channel by id.
	Authentication: Required
	Authorization: Required (user must be the server owner)
	"""
	if current_user.is_authenticated:
		channel = Channel.query.get(id)
		if not channel:
			return {'errors': {'message': 'Channel not found'}}, 404

		server_member = is_server_member(current_user.id, channel.server_id)
		if not server_member:
			return {'errors': {'message': 'Forbidden'}}, 403

		server = Server.query.get(channel.server_id)
		if server.owner_id != current_user.id:
			return {'errors': {'message': 'Unauthorized'}}, 403

		db.session.delete(channel)
		db.session.commit()
		return {'message': 'Channel deleted'}
	return {'errors': {'message': 'Unauthorized'}}, 401


@channel_routes.route('<int:channel_id>/messages', methods=['POST'])
@login_required
def create_message(channel_id):
    data = request.get_json()
    new_message = Message(
        content=data['content'],
        user_id=current_user.id,
        channel_id=channel_id,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    db.session.add(new_message)
    db.session.commit()

    return jsonify({
        "id": new_message.id,
        "content": new_message.content,
        "user": current_user.username,
        "user_id": current_user.id,
    }), 201



# Helper function to convert a reaction to a dictionary
def reaction_to_dict(reaction):
    return {
        'id': reaction.id,
        'user_id': reaction.user_id,
        'message_id': reaction.message_id,
        'emoji': reaction.emoji,
        'created_at': reaction.created_at.isoformat(),
        'updated_at': reaction.updated_at.isoformat()
    }

# Helper function to check if the user is a member of the channel
def is_channel_member(user_id, channel_id):
    return ChannelMembers.query.filter(
        ChannelMembers.user_id == user_id,
        ChannelMembers.channel_id == channel_id
    ).first()

# Helper function to check if the user is a member of the server
def is_server_member(user_id, server_id):
    return ServerMember.query.filter(
        ServerMember.user_id == user_id,
        ServerMember.server_id == server_id
    ).first()

# Get All Reactions for a Message
@channel_routes.route('/<int:channel_id>/messages/<int:message_id>/reactions', methods=['GET'])
@login_required
def get_all_reactions_for_message(channel_id, message_id):
    message = Message.query.get(message_id)
    if not message:
        return {'errors': {'message': 'Message not found'}}, 404

    # server_member = is_server_member(current_user.id, message.channel.server_id)
    # if not server_member:
    #     return {'errors': {'message': 'Forbidden'}}, 403

    # channel_member = is_channel_member(current_user.id, message.channel_id)
    # if not channel_member:
    #     return {'errors': {'message': 'Forbidden'}}, 403

    reactions = Reaction.query.filter(Reaction.message_id == message_id).all()
    return {'reactions': [reaction_to_dict(reaction) for reaction in reactions]}

# Add a Reaction to a Message
@channel_routes.route('/<int:channel_id>/messages/<int:message_id>/reactions', methods=['POST'])
@login_required
def add_reaction_to_message(channel_id, message_id):
    emoji = request.json.get('emoji')
    if not emoji:
        return {'errors': {'message': 'Emoji is required'}}, 400

    message = Message.query.get(message_id)
    if not message:
        return {'errors': {'message': 'Message not found'}}, 404

    # server_member = is_server_member(current_user.id, message.channel.server_id)
    # if not server_member:
    #     return {'errors': {'message': 'Forbidden'}}, 403

    # channel_member = is_channel_member(current_user.id, message.channel_id)
    # if not channel_member:
    #     return {'errors': {'message': 'Forbidden'}}, 403

    reaction = Reaction(
        user_id=current_user.id,
        message_id=message_id,
        emoji=emoji
    )
    db.session.add(reaction)
    db.session.commit()
    return reaction_to_dict(reaction), 201

# Update a Reaction to a Message
@channel_routes.route('/<int:channel_id>/messages/<int:message_id>/reactions/<int:id>', methods=['PATCH'])
@login_required
def update_reaction_to_message(message_id):
    emoji = request.json.get('emoji')
    if not emoji:
        return {'errors': {'message': 'Emoji is required'}}, 400

    message = Message.query.get(message_id)
    if not message:
        return {'errors': {'message': 'Message not found'}}, 404

    server_member = is_server_member(current_user.id, message.channel.server_id)
    if not server_member:
        return {'errors': {'message': 'Forbidden'}}, 403

    channel_member = is_channel_member(current_user.id, message.channel_id)
    if not channel_member:
        return {'errors': {'message': 'Forbidden'}}, 403

    reaction = Reaction.query.filter_by(
        user_id=current_user.id,
        message_id=message_id
    ).first()
    if not reaction:
        return {'errors': {'message': 'Reaction not found'}}, 404

    if reaction.user_id != current_user.id:
        return {'errors': {'message': 'Unauthorized'}}, 403

    reaction.emoji = emoji
    reaction.updated_at = datetime.now()
    db.session.commit()
    return reaction_to_dict(reaction)

@channel_routes.route('/<int:channel_id>/messages/<int:message_id>/reactions/<int:reaction_id>', methods=['DELETE'])
@login_required
def remove_reaction_from_message(channel_id, message_id, reaction_id):
    reaction = Reaction.query.get(reaction_id)
    if not reaction:
        return {'errors': {'message': 'Reaction not found'}}, 404

    message = Message.query.get(message_id)
    if not message:
        return {'errors': {'message': 'Message not found'}}, 404

    # server_member = is_server_member(current_user.id, message.channel.server_id)
    # if not server_member:
    #     return {'errors': {'message': 'Forbidden'}}, 403

    # channel_member = is_channel_member(current_user.id, message.channel_id)
    # if not channel_member:
    #     return {'errors': {'message': 'Forbidden'}}, 403

    # if reaction.user_id != current_user.id:
    #     return {'errors': {'message': 'Unauthorized'}}, 403

    db.session.delete(reaction)
    db.session.commit()
    return {'message': 'Reaction removed'}
