from flask import Blueprint, request, jsonify
from app.models import db, Message
from flask_login import login_required, current_user

bp = Blueprint('messages', __name__, url_prefix='/messages')

@bp.route('/', methods=['POST'])
@login_required
def create_message():
    data = request.get_json()
    new_message = Message(
        content=data['content'],
        user_id=current_user.id,
        channel_id=data['channel_id']
    )
    db.session.add(new_message)
    db.session.commit()
    return jsonify(new_message.to_dict()), 201

@bp.route('/<int:id>', methods=['GET'])
@login_required
def get_message(id):
    message = Message.query.get(id)
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    return jsonify(message.to_dict())

@bp.route('/<int:id>', methods=['PUT'])
@login_required
def update_message(id):
    data = request.get_json()
    message = Message.query.get(id)
    if not message or message.user_id != current_user.id:
        return jsonify({'error': 'Message not found or unauthorized'}), 404
    message.content = data['content']
    db.session.commit()
    return jsonify(message.to_dict())

@bp.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_message(id):
    message = Message.query.get(id)
    if not message or message.user_id != current_user.id:
        return jsonify({'error': 'Message not found or unauthorized'}), 404
    db.session.delete(message)
    db.session.commit()
    return jsonify({'message': 'Message deleted'}), 200
