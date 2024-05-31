from flask import Blueprint, request, jsonify
from app.models import db, Thread, Message
from flask_login import login_required, current_user

bp = Blueprint('threads', __name__, url_prefix='/threads')

@bp.route('/', methods=['POST'])
@login_required
def create_thread():
    data = request.get_json()
    message = Message.query.get(data['message_id'])
    if not message:
        return jsonify({'error': 'Message not found'}), 404
    new_thread = Thread(
        message_id=message.id
    )
    db.session.add(new_thread)
    db.session.commit()
    return jsonify(new_thread.to_dict()), 201

@bp.route('/<int:id>', methods=['GET'])
@login_required
def get_thread(id):
    thread = Thread.query.get(id)
    if not thread:
        return jsonify({'error': 'Thread not found'}), 404
    return jsonify(thread.to_dict())

@bp.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_thread(id):
    thread = Thread.query.get(id)
    if not thread:
        return jsonify({'error': 'Thread not found'}), 404
    db.session.delete(thread)
    db.session.commit()
    return jsonify({'message': 'Thread deleted'}), 200
