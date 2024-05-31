from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Server, ServerMember, db
from app.forms import CreateServerForm
from datetime import datetime

server_routes = Blueprint('servers', __name__)

@server_routes.route('')
@login_required
def all_servers():

    servers = Server.query.all()
    servers_list = [{
            "id": server.id,
            "name": server.name,
            "owner_id": server.owner_id,
            "created_at": server.created_at,
            "updated_at": server.updated_at
        } for server in servers]

    return {"Servers": servers_list}


@server_routes.route('/<id>')
@login_required
def server_by_id(id):

    print("\n\n" + str(current_user.id) + "\n\n")

    server = Server.query.get(id)

    print("\n\n" + str(server.owner_id) + "\n\n")

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
    form = CreateServerForm()

    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        server = Server(
            name=form.data.name,
            owner_id=current_user.id,
            updated_at=datetime.now(),
            created_at=datetime.now()
        )
        db.session.add(server)
        db.session.commit()

        new_server = Server.query.filter(Server.name == form.data.name).first()

        return {
            "id": new_server.id,
            "name": new_server.name,
            "owner_id": new_server.owner_id,
            "created_at": new_server.create_at,
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
    elif id == server.owner_id:
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


@server_routes.route("/<id>/members", methods=["POST"])
@login_required
def add_member(id):

    server = Server.query.get(id)
    if not server:
        return {
            "message": "Bad request",
            "errors": {
                "server": "Server not found"
            }
        }

    elif current_user.id != server.owner_id:
        return "You don't own the server"

    else:
        current_member = ServerMember.query.filter(
            ServerMember.user_id == current_user and
            ServerMember.server_id == server.id
        ).first()

        if not current_member:

            new_member = ServerMember(
                user_id=current_user.id,
                server_id=id
            )

            db.session.add(new_member)
            db.session.commit()

            return "Member added"
        
        else:
            return "All ready a member"
