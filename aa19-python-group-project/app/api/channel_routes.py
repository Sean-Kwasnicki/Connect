from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Channel, Server, ServerMember, db
from app.forms import ChannelForm

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

@channel_routes.route('/servers/<int:server_id>/channels', methods=['GET'])
@login_required
def get_all_channels_in_server(server_id):
	"""
	Query for all channels in a server and returns them in a list of channel dictionaries.
	Authentication: Required
	Authorization: Required (user must be a member of the server)
	"""
	if current_user.is_authenticated:
		server_member = is_server_member(current_user.id, server_id)
		if not server_member:
			return {'errors': {'message': 'Forbidden'}}, 403

		channels = Channel.query.filter(Channel.server_id == server_id).all()
		return {'channels': [channel_to_dict(channel) for channel in channels]}
	return {'errors': {'message': 'Unauthorized'}}, 401

@channel_routes.route('/servers/<int:server_id>/channels', methods=['POST'])
@login_required
def create_channel(server_id):
	"""
	Creates a new channel in a server.
	Authentication: Required
	Authorization: Required (user must be a member of the server)
	"""
	if current_user.is_authenticated:
		server_member = is_server_member(current_user.id, server_id)
		if not server_member:
			return {'errors': {'message': 'Forbidden'}}, 403

		form = ChannelForm()
		form['csrf_token'].data = request.cookies['csrf_token']
		form.server_id = server_id

		if form.validate_on_submit():
			server = Server.query.get(server_id)
			if not server:
				return {'errors': {'message': 'Server not found'}}, 404

			channel = Channel(
				name=form.name.data,
				server_id=server_id
			)
			db.session.add(channel)
			db.session.commit()
			return channel_to_dict(channel), 201
		return {'errors': form.errors}, 400
	return {'errors': {'message': 'Unauthorized'}}, 401

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

		form = ChannelForm()
		form['csrf_token'].data = request.cookies['csrf_token']

		if form.validate_on_submit():
			server = Server.query.get(channel.server_id)
			if server.owner_id != current_user.id and channel.creator_id != current_user.id:
				return {'errors': {'message': 'Unauthorized'}}, 403

			channel.name = form.name.data if form.name.data else channel.name
			db.session.commit()
			return channel_to_dict(channel)
		return {'errors': form.errors}, 400
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
