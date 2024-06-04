# from flask import Blueprint, request
# from flask_login import login_required, current_user
# from datetime import datetime
# from app.models import Reaction, Message, ChannelMembers, ServerMember, db

# reaction_routes = Blueprint('reactions', __name__)

# # Helper function to convert a reaction to a dictionary
# def reaction_to_dict(reaction):
# 	return {
# 		'id': reaction.id,
# 		'user_id': reaction.user_id,
# 		'message_id': reaction.message_id,
# 		'emoji': reaction.emoji,
# 		'created_at': reaction.created_at.isoformat(),
# 		'updated_at': reaction.updated_at.isoformat()
# 	}

# # Helper function to check if the user is a member of the channel
# def is_channel_member(user_id, channel_id):
# 	return ChannelMembers.query.filter(
# 		ChannelMembers.user_id == user_id,
# 		ChannelMembers.channel_id == channel_id
# 	).first()

# # Helper function to check if the user is a member of the server
# def is_server_member(user_id, server_id):
# 	return ServerMember.query.filter(
# 		ServerMember.user_id == user_id,
# 		ServerMember.server_id == server_id
# 	).first()

# # Get All Reactions for a Message
# @reaction_routes.route('/messages/<int:message_id>/reactions', methods=['GET'])
# @login_required
# def get_all_reactions_for_message(message_id):
# 	"""
# 	Query for all reactions for a message and returns them in a list of reaction dictionaries.
# 	Authentication: Required
# 	Authorization: Not required
# 	"""
# 	message = Message.query.get(message_id)
# 	if not message:
# 		return {'errors': {'message': 'Message not found'}}, 404

# 	server_member = is_server_member(current_user.id, message.channel.server_id)
# 	if not server_member:
# 		return {'errors': {'message': 'Forbidden'}}, 403

# 	channel_member = is_channel_member(current_user.id, message.channel_id)
# 	if not channel_member:
# 		return {'errors': {'message': 'Forbidden'}}, 403

# 	reactions = Reaction.query.filter(Reaction.message_id == message_id).all()
# 	return {'reactions': [reaction_to_dict(reaction) for reaction in reactions]}

# # Add a Reaction to a Message
# @reaction_routes.route('/messages/<int:message_id>/reactions', methods=['POST'])
# @login_required
# def add_reaction_to_message(message_id):
# 	"""
# 	Adds a reaction to a message.
# 	Authentication: Required
# 	Authorization: Not required
# 	"""
# 	emoji = request.json.get('emoji')
# 	if not emoji:
# 		return {'errors': {'message': 'Emoji is required'}}, 400

# 	message = Message.query.get(message_id)
# 	if not message:
# 		return {'errors': {'message': 'Message not found'}}, 404

# 	server_member = is_server_member(current_user.id, message.channel.server_id)
# 	if not server_member:
# 		return {'errors': {'message': 'Forbidden'}}, 403

# 	channel_member = is_channel_member(current_user.id, message.channel_id)
# 	if not channel_member:
# 		return {'errors': {'message': 'Forbidden'}}, 403

# 	reaction = Reaction(
# 		user_id=current_user.id,
# 		message_id=message_id,
# 		emoji=emoji
# 	)
# 	db.session.add(reaction)
# 	db.session.commit()
# 	return reaction_to_dict(reaction), 201

# # Update a Reaction to a Message
# @reaction_routes.route('/messages/<int:message_id>/reactions', methods=['PATCH'])
# @login_required
# def update_reaction_to_message(message_id):
# 	"""
# 	Updates a reaction to a message.
# 	Authentication: Required
# 	Authorization: Required (only the user who added the reaction)
# 	"""
# 	emoji = request.json.get('emoji')
# 	if not emoji:
# 		return {'errors': {'message': 'Emoji is required'}}, 400

# 	message = Message.query.get(message_id)
# 	if not message:
# 		return {'errors': {'message': 'Message not found'}}, 404

# 	server_member = is_server_member(current_user.id, message.channel.server_id)
# 	if not server_member:
# 		return {'errors': {'message': 'Forbidden'}}, 403

# 	channel_member = is_channel_member(current_user.id, message.channel_id)
# 	if not channel_member:
# 		return {'errors': {'message': 'Forbidden'}}, 403

# 	reaction = Reaction.query.filter_by(
# 		user_id=current_user.id,
# 		message_id=message_id
# 	).first()
# 	if not reaction:
# 		return {'errors': {'message': 'Reaction not found'}}, 404

# 	if reaction.user_id != current_user.id:
# 		return {'errors': {'message': 'Unauthorized'}}, 403

# 	reaction.emoji = emoji
# 	reaction.updated_at = datetime.now()
# 	db.session.commit()
# 	return reaction_to_dict(reaction)

# # Remove a Reaction from a Message
# @reaction_routes.route('/messages/<int:message_id>/reactions', methods=['DELETE'])
# @login_required
# def remove_reaction_from_message(message_id):
# 	"""
# 	Removes a reaction from a message.
# 	Authentication: Required
# 	Authorization: Required (only the user who added the reaction)
# 	"""
# 	emoji = request.json.get('emoji')
# 	if not emoji:
# 		return {'errors': {'message': 'Emoji is required'}}, 400

# 	message = Message.query.get(message_id)
# 	if not message:
# 		return {'errors': {'message': 'Message not found'}}, 404

# 	server_member = is_server_member(current_user.id, message.channel.server_id)
# 	if not server_member:
# 		return {'errors': {'message': 'Forbidden'}}, 403

# 	channel_member = is_channel_member(current_user.id, message.channel_id)
# 	if not channel_member:
# 		return {'errors': {'message': 'Forbidden'}}, 403

# 	reaction = Reaction.query.filter_by(
# 		user_id=current_user.id,
# 		message_id=message_id,
# 		emoji=emoji
# 	).first()
# 	if not reaction:
# 		return {'errors': {'message': 'Reaction not found'}}, 404

# 	if reaction.user_id != current_user.id:
# 		return {'errors': {'message': 'Unauthorized'}}, 403

# 	db.session.delete(reaction)
# 	db.session.commit()
# 	return {'message': 'Reaction removed'}

# # Get All Reactions by a User
# @reaction_routes.route('/users/<int:user_id>/reactions', methods=['GET'])
# @login_required
# def get_all_reactions_by_user(user_id):
# 	"""
# 	Query for all reactions by a user and returns them in a list of reaction dictionaries.
# 	Authentication: Required
# 	Authorization: Not required
# 	"""
# 	if current_user.id != user_id:
# 		return {'errors': {'message': 'Forbidden'}}, 403

# 	reactions = Reaction.query.filter(Reaction.user_id == user_id).all()
# 	return {'reactions': [reaction_to_dict(reaction) for reaction in reactions]}
