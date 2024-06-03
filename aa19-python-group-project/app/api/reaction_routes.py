from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime
from app.models import Reaction, Message, db

reaction_routes = Blueprint('reactions', __name__)

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

# Get All Reactions for a Message
@reaction_routes.route('/messages/<int:message_id>/reactions', methods=['GET'])
@login_required
def get_all_reactions_for_message(message_id):
	"""
	Query for all reactions for a message and returns them in a list of reaction dictionaries.
	Authentication: Required
	Authorization: Not required
	"""
	reactions = Reaction.query.filter(Reaction.message_id == message_id).all()
	return {'reactions': [reaction_to_dict(reaction) for reaction in reactions]}

# Add a Reaction to a Message
@reaction_routes.route('/messages/<int:message_id>/reactions', methods=['POST'])
@login_required
def add_reaction_to_message(message_id):
	"""
	Adds a reaction to a message.
	Authentication: Required
	Authorization: Not required
	"""
	emoji = request.json.get('emoji')
	if not emoji:
		return {'errors': {'message': 'Emoji is required'}}, 400

	message = Message.query.get(message_id)
	if not message:
		return {'errors': {'message': 'Message not found'}}, 404

	reaction = Reaction(
		user_id=current_user.id,
		message_id=message_id,
		emoji=emoji
	)
	db.session.add(reaction)
	db.session.commit()
	return reaction_to_dict(reaction), 201

# Remove a Reaction from a Message
@reaction_routes.route('/messages/<int:message_id>/reactions', methods=['DELETE'])
@login_required
def remove_reaction_from_message(message_id):
	"""
	Removes a reaction from a message.
	Authentication: Required
	Authorization: Required (only the user who added the reaction)
	"""
	emoji = request.json.get('emoji')
	if not emoji:
		return {'errors': {'message': 'Emoji is required'}}, 400

	reaction = Reaction.query.filter_by(
		user_id=current_user.id,
		message_id=message_id,
		emoji=emoji
	).first()
	if not reaction:
		return {'errors': {'message': 'Reaction not found'}}, 404

	db.session.delete(reaction)
	db.session.commit()
	return {'message': 'Reaction removed'}

# Get All Reactions by a User
@reaction_routes.route('/users/<int:user_id>/reactions', methods=['GET'])
@login_required
def get_all_reactions_by_user(user_id):
	"""
	Query for all reactions by a user and returns them in a list of reaction dictionaries.
	Authentication: Required
	Authorization: Not required
	"""
	reactions = Reaction.query.filter(Reaction.user_id == user_id).all()
	return {'reactions': [reaction_to_dict(reaction) for reaction in reactions]}
