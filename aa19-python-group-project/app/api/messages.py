from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Message, Reaction, ChannelMembers, ServerMember, db
from app.forms import MessageForm
from datetime import datetime

messages_routes = Blueprint('messages', __name__)

@messages_routes.route('', methods=['GET'])
@login_required
def all_messages():
    messages = Message.query.all()
    messages_list = [{
        "id": message.id,
        "content": message.content,
        "user_id": message.user_id,
        "channel_id": message.channel_id,
        "created_at": message.created_at,
        "updated_at": message.updated_at
    } for message in messages]
    return {"Messages": messages_list}

@messages_routes.route('/<int:id>', methods=['GET'])
@login_required
def message_by_id(id):
    message = Message.query.get(id)
    if not message:
        return {
            "message": "Bad request",
            "errors": {
                "message": "Message not found"
            }
        }
    return {
        "id": message.id,
        "content": message.content,
        "user_id": message.user_id,
        "channel_id": message.channel_id,
        "created_at": message.created_at,
        "updated_at": message.updated_at
    }

@messages_routes.route('', methods=['POST'])
@login_required
def create_message():
    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_message = Message(
            content=form.data['content'],
            user_id=current_user.id,
            channel_id=form.data['channel_id'],
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify(new_message.to_dict()), 201
    return form.errors, 401

@messages_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_message(id):
    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        message = Message.query.get(id)
        if not message or message.user_id != current_user.id:
            return {
                "message": "Bad request",
                "errors": {
                    "message": "Message not found or unauthorized"
                }
            }, 403
        message.content = form.data['content']
        message.updated_at = datetime.now()
        db.session.commit()
        return jsonify(message.to_dict()), 200
    return form.errors, 400

@messages_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_message(id):
    message = Message.query.get(id)
    if not message or message.user_id != current_user.id:
        return {
            "message": "Bad request",
            "errors": {
                "message": "Message not found or unauthorized"
            }
        }
    db.session.delete(message)
    db.session.commit()
    return {"message": "Message deleted"}


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
@messages_routes.route('/<int:message_id>/reactions', methods=['GET'])
@login_required
def get_all_reactions_for_message(message_id):
    message = Message.query.get(message_id)
    if not message:
        return {'errors': {'message': 'Message not found'}}, 404

    server_member = is_server_member(current_user.id, message.channel.server_id)
    if not server_member:
        return {'errors': {'message': 'Forbidden'}}, 403

    channel_member = is_channel_member(current_user.id, message.channel_id)
    if not channel_member:
        return {'errors': {'message': 'Forbidden'}}, 403

    reactions = Reaction.query.filter(Reaction.message_id == message_id).all()
    return {'reactions': [reaction_to_dict(reaction) for reaction in reactions]}

# Add a Reaction to a Message
@messages_routes.route('/<int:message_id>/reactions', methods=['POST'])
@login_required
def add_reaction_to_message(message_id):
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

    reaction = Reaction(
        user_id=current_user.id,
        message_id=message_id,
        emoji=emoji
    )
    db.session.add(reaction)
    db.session.commit()
    return reaction_to_dict(reaction), 201

# Update a Reaction to a Message
@messages_routes.route('/<int:message_id>/reactions', methods=['PATCH'])
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

# Remove a Reaction from a Message
@messages_routes.route('/<int:message_id>/reactions', methods=['DELETE'])
@login_required
def remove_reaction_from_message(message_id):
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
        message_id=message_id,
        emoji=emoji
    ).first()
    if not reaction:
        return {'errors': {'message': 'Reaction not found'}}, 404

    if reaction.user_id != current_user.id:
        return {'errors': {'message': 'Unauthorized'}}, 403

    db.session.delete(reaction)
    db.session.commit()
    return {'message': 'Reaction removed'}
