from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User, Reaction

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()

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


# Get All Reactions by a User
@user_routes.route('/<int:user_id>/reactions', methods=['GET'])
@login_required
def get_all_reactions_by_user(user_id):
	"""
	Query for all reactions by a user and returns them in a list of reaction dictionaries.
	Authentication: Required
	Authorization: Not required
	"""
	if current_user.id != user_id:
		return {'errors': {'message': 'Forbidden'}}, 403

	reactions = Reaction.query.filter(Reaction.user_id == user_id).all()
	return {'reactions': [reaction_to_dict(reaction) for reaction in reactions]}
