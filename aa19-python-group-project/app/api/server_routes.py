from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import User, Server, ServerMember, Channel, ChannelMembers, db
from app.forms import CreateServerForm, ChannelForm
from datetime import datetime

server_routes = Blueprint('servers', __name__)

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


@server_routes.route('')
@login_required
def all_servers():
    servers = Server.query.all()
    servers_list = [server.to_dict() for server in servers]

    return servers_list


@server_routes.route('/<id>')
@login_required
def server_by_id(id):
    server = Server.query.get(id)

    if not server:
        return {
            "message": "Bad request",
            "errors": {
                "server": "Server not found"
            }
        }
    return {
            "id": server.id,
            "name": server.name,
            "owner_id": server.owner_id,
            "created_at": server.created_at,
            "updated_at": server.updated_at
        }


@server_routes.route("", methods=["POST"])
@login_required
def create_server():

    data = request.get_json()
    form = CreateServerForm(data=data)
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        server = Server(
            name=form.data["name"],
            owner_id=current_user.id,
            updated_at=datetime.now(),
            created_at=datetime.now()
        )

        db.session.add(server)

        new_server = Server.query.filter(Server.name == form.data["name"]).first()

        server_member = ServerMember(
            user_id=current_user.id,
            server_id=new_server.id,
            updated_at=datetime.now(),
            created_at=datetime.now()
            )

        db.session.add(server_member)
        db.session.commit()

        return {
            "id": new_server.id,
            "name": new_server.name,
            "owner_id": new_server.owner_id,
            "created_at": new_server.created_at,
            "updated_at": new_server.updated_at,
        }

    return form.errors, 401

@server_routes.route("/<id>", methods=["DELETE"])
@login_required
def delete_server(id):


    server = Server.query.get(id)


    if not server:
        return {
            "message": "Bad request",
            "errors": {
                "server": "Server not found"
            }
        }
    elif current_user.id == server.owner_id:
        print("\n\n")
        print(server.id)
        db.session.delete(server)
        db.session.commit()
        return { "message": "Successfully deleted server"}
    else:
        return "You don't own the server"

@server_routes.route("/<id>", methods=["PATCH"])
@login_required
def update_server(id):

    form = CreateServerForm()

    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():

        server = Server.query.get(id)

        if not server:
            return {
                "message": "Bad request",
                "errors": {
                    "server": "Server not found"
                }
            }
        elif current_user.id == server.owner_id:
            db.session.update({"name": form.data.name})
            db.session.commit()

            updated_server = Server.query.get(id)

            return {
                "id": updated_server.id,
                "name": updated_server.name,
                "owner_id": updated_server.owner_id,
                "created_at": updated_server.create_at,
                "updated_at": updated_server.updated_at,
            }
        else:
            return "You don't own the server"

    return form.errors, 401


@server_routes.route('/<id>/members', methods=['POST'])
@login_required
def add_member(id):
    data = request.json
    username = data.get('username')

    server = Server.query.get(id)
    if not server:
        return {
            "message": "Bad request",
            "errors": {
                "server": "Server not found"
            }
        }

    elif current_user.id != server.owner_id:
        return {"message": "You don't own the server"}, 403

    user = User.query.filter_by(username=username).first()
    if not user:
        return {
            "message": "Bad request",
            "errors": {
                "username": "User not found"
            }
        }, 404

    existing_member = ServerMember.query.filter_by(user_id=user.id, server_id=server.id).first()
    if existing_member:
        return {"message": "User already a member"}, 400

    new_member = ServerMember(
        user_id=user.id,
        server_id=id
    )

    db.session.add(new_member)
    db.session.commit()

    return {"message": "Member added", "user": user.to_dict()}

@server_routes.route('/<id>/members', methods=['GET'])
@login_required
def get_members(id):
    server = Server.query.get(id)
    if not server:
        return {"message": "Server not found"}, 404

    members = User.query.join(ServerMember).filter(ServerMember.server_id == id).all()
    return jsonify([member.to_dict() for member in members])

@server_routes.route("/<id>/members/<member_id>", methods=["DELETE"])
@login_required
def delete_member(id, member_id):
    print(f"Attempting to delete member: {member_id} from server: {id}")

    server = Server.query.get(id)
    if not server:
        print("Server not found")
        return {"message": "Server not found"}, 404

    member = ServerMember.query.filter_by(user_id=member_id, server_id=id).first()
    if not member:
        print("Member not found")
        return {"message": "Member not found"}, 404

    print(f"Deleting member: {member_id}")
    db.session.delete(member)
    db.session.commit()

    print("Member deleted")
    return {"message": "Member deleted"}


@server_routes.route('/<int:server_id>/channels', methods=['GET'])
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

@server_routes.route('/<int:server_id>/channels', methods=['POST'])
@login_required
def create_channel(server_id):
	"""
	Creates a new channel in a server.
	Authentication: Required
	Authorization: Required (user must be a member of the server)
	"""
	if current_user.is_authenticated:
		# server_member = is_server_member(current_user.id, server_id)
		# if not server_member:
		# 	return {'errors': {'message': 'Forbidden'}}, 403

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
