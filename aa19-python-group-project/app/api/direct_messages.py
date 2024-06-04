from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import DirectMessage, db
from datetime import datetime

direct_messages_routes = Blueprint('direct_messages', __name__)

@direct_messages_routes.route('', methods=['GET'])
@login_required
def all_direct_messages():
    direct_messages = DirectMessage.query.filter(
        (DirectMessage.sender_id == current_user.id) |
        (DirectMessage.receiver_id == current_user.id)
    ).all()
    direct_messages_list = [{
        "id": dm.id,
        "content": dm.content,
        "sender_id": dm.sender_id,
        "receiver_id": dm.receiver_id,
        "created_at": dm.created_at,
        "updated_at": dm.updated_at
    } for dm in direct_messages]
    return {"DirectMessages": direct_messages_list}

@direct_messages_routes.route('/<int:id>', methods=['GET'])
@login_required
def direct_message_by_id(id):
    dm = DirectMessage.query.get(id)
    if not dm or (dm.sender_id != current_user.id and dm.receiver_id != current_user.id):
        return {
            "message": "Bad request",
            "errors": {
                "direct_message": "Direct Message not found or unauthorized"
            }
        }
    return {
        "id": dm.id,
        "content": dm.content,
        "sender_id": dm.sender_id,
        "receiver_id": dm.receiver_id,
        "created_at": dm.created_at,
        "updated_at": dm.updated_at
    }

@direct_messages_routes.route('', methods=['POST'])
@login_required
def create_direct_message():
    data = request.get_json()
    new_dm = DirectMessage(
        content=data['content'],
        sender_id=current_user.id,
        receiver_id=data['receiver_id'],
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    db.session.add(new_dm)
    db.session.commit()
    return jsonify(new_dm.to_dict()), 201

@direct_messages_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_direct_message(id):
    data = request.get_json()
    dm = DirectMessage.query.get(id)
    if not dm or dm.sender_id != current_user.id:
        return {
            "message": "Bad request",
            "errors": {
                "direct_message": "Direct Message not found or unauthorized"
            }
        }
    dm.content = data['content']
    dm.updated_at = datetime.now()
    db.session.commit()
    return jsonify(dm.to_dict())

@direct_messages_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_direct_message(id):
    dm = DirectMessage.query.get(id)
    if not dm or dm.sender_id != current_user.id:
        return {
            "message": "Bad request",
            "errors": {
                "direct_message": "Direct Message not found or unauthorized"
            }
        }
    db.session.delete(dm)
    db.session.commit()
    return {"message": "Direct Message deleted"}
