from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Message, db
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
    data = request.get_json()
    new_message = Message(
        content=data['content'],
        user_id=current_user.id,
        channel_id=data['channel_id'],
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    db.session.add(new_message)
    db.session.commit()
    return jsonify(new_message.to_dict()), 201

@messages_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_message(id):
    data = request.get_json()
    message = Message.query.get(id)
    if not message or message.user_id != current_user.id:
        return {
            "message": "Bad request",
            "errors": {
                "message": "Message not found or unauthorized"
            }
        }
    message.content = data['content']
    message.updated_at = datetime.now()
    db.session.commit()
    return jsonify(message.to_dict())

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
