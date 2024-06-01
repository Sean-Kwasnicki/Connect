from flask import Blueprint, request
from flask_login import login_required, current_user
from datetime import datetime
from app.models import Channel, Server, ServerMember, ChannelMembers, db

channel_members_routes = Blueprint('channel_members', __name__, url_prefix='/channels')

# Helper function to check if the user is a member of the server
def is_server_member(user_id, server_id):
	return ServerMember.query.filter(
		ServerMember.user_id == user_id,
		ServerMember.server_id == server_id
	).first()

# Helper function to convert a channel member to a dictionary
def channel_member_to_dict(channel_member):
	return {
		'id': channel_member.id,
		'user_id': channel_member.user_id,
		'channel_id': channel_member.channel_id,
		'created_at': channel_member.created_at.isoformat(),
		'updated_at': channel_member.updated_at.isoformat()
	}

# Channel Member Routes

@channel_members_routes.route('/<int:channel_id>/members', methods=['POST'])
@login_required
def add_user_to_channel(channel_id):
	"""
	Adds a user to a channel.
	Authentication: Required
	Authorization: Required (user must be the server owner)
	"""
	if current_user.is_authenticated:
		user_id = request.form.get('user_id')
		channel = Channel.query.get(channel_id)
		if not channel:
			return {'errors': {'message': 'Channel not found'}}, 404

		server_member = is_server_member(current_user.id, channel.server_id)
		if not server_member:
			return {'errors': {'message': 'Forbidden'}}, 403

		server = Server.query.get(channel.server_id)
		if server.owner_id != current_user.id:
			return {'errors': {'message': 'Unauthorized'}}, 403

		channel_member = ChannelMembers(
			user_id=user_id,
			channel_id=channel_id
		)
		db.session.add(channel_member)
		db.session.commit()
		return channel_member_to_dict(channel_member), 201
	return {'errors': {'message': 'Unauthorized'}}, 401

@channel_members_routes.route('/<int:channel_id>/members/<int:id>', methods=['DELETE'])
@login_required
def remove_user_from_channel(channel_id, id):
	"""
	Removes a user from a channel.
	Authentication: Required
	Authorization: Required (user must be the server owner)
	"""
	if current_user.is_authenticated:
		channel_member = ChannelMembers.query.filter(
			ChannelMembers.id == id,
			ChannelMembers.channel_id == channel_id
		).first()
		if not channel_member:
			return {'errors': {'message': 'Member not found'}}, 404

		server = Server.query.get(channel_member.channel_id)
		if server.owner_id != current_user.id:
			return {'errors': {'message': 'Unauthorized'}}, 403

		db.session.delete(channel_member)
		db.session.commit()
		return {'message': 'User removed from channel'}
	return {'errors': {'message': 'Unauthorized'}}, 401

@channel_members_routes.route('/<int:channel_id>/members', methods=['GET'])
@login_required
def get_all_members_in_channel(channel_id):
	"""
	Query for all members in a channel.
	Authentication: Required
	Authorization: Required (user must be a member of the server)
	"""
	if current_user.is_authenticated:
		channel = Channel.query.get(channel_id)
		if not channel:
			return {'errors': {'message': 'Channel not found'}}, 404

		server_member = is_server_member(current_user.id, channel.server_id)
		if not server_member:
			return {'errors': {'message': 'Forbidden'}}, 403

		channel_members = ChannelMembers.query.filter(ChannelMembers.channel_id == channel_id).all()
		return {'members': [channel_member_to_dict(channel_member) for channel_member in channel_members]}
	return {'errors': {'message': 'Unauthorized'}}, 401

@channel_members_routes.route('/<int:channel_id>/members/<int:id>', methods=['GET'])
@login_required
def get_member_in_channel_by_id(channel_id, id):
	"""
	Query for a member in a channel by member ID.
	Authentication: Required
	Authorization: Required (user must be a member of the server)
	"""
	if current_user.is_authenticated:
		channel = Channel.query.get(channel_id)
		if not channel:
			return {'errors': {'message': 'Channel not found'}}, 404

		server_member = is_server_member(current_user.id, channel.server_id)
		if not server_member:
			return {'errors': {'message': 'Forbidden'}}, 403

		channel_member = ChannelMembers.query.filter(
			ChannelMembers.channel_id == channel_id,
			ChannelMembers.id == id
		).first()
		if not channel_member:
			return {'errors': {'message': 'Member not found'}}, 404

		return channel_member_to_dict(channel_member)
	return {'errors': {'message': 'Unauthorized'}}, 401
