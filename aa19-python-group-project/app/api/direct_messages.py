from flask import Blueprint, request, jsonify
from app.models import db, DirectMessage
from flask_login import login_required, current_user

bp = Blueprint('direct_messages', __name__, url_prefix='/direct_messages')

@bp.route('/', methods=['POST'])
@login_required
def create_direct_message():
    data = request.get_json()
    new_direct_message = DirectMessage(
        content=data['content'],
        sender_id=current_user.id,
        receiver_id=data['receiver_id']
    )
    db.session.add(new_direct_message)
    db.session.commit()
    return jsonify(new_direct_message.to_dict()), 201

@bp.route('/<int:id>', methods=['GET'])
@login_required
def get_direct_message(id):
    direct_message = DirectMessage.query.get(id)
    if not direct_message or (direct_message.sender_id != current_user.id and direct_message.receiver_id != current_user.id):
        return jsonify({'error': 'Direct Message not found or unauthorized'}), 404
    return jsonify(direct_message.to_dict())

@bp.route('/<int:id>', methods=['PUT'])
@login_required
def update_direct_message(id):
    data = request.get_json()
    direct_message = DirectMessage.query.get(id)
    if not direct_message or direct_message.sender_id != current_user.id:
        return jsonify({'error': 'Direct Message not found or unauthorized'}), 404
    direct_message.content = data['content']
    db.session.commit()
    return jsonify(direct_message.to_dict())

@bp.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_direct_message(id):
    direct_message = DirectMessage.query.get(id)
    if not direct_message or direct_message.sender_id != current_user.id:
        return jsonify({'error': 'Direct Message not found or unauthorized'}), 404
    db.session.delete(direct_message)
    db.session.commit()
    return jsonify({'message': 'Direct Message deleted'}), 200
