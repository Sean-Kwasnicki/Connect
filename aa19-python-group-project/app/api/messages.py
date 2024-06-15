from flask import Blueprint, request, jsonify, current_app
from flask_login import login_required, current_user
from app.models import db, Message
from datetime import datetime

messages_routes = Blueprint('messages', __name__)

@messages_routes.route('/new', methods=['POST'])
@login_required
def post_message():
    user_id = current_user.id
    data = request.get_json()
    new_message = Message(
        channel_id=data['channel_id'],
        user_id=user_id,
        content=data['content']
    )
    db.session.add(new_message)
    db.session.commit()
    return jsonify(new_message.to_dict()), 201

@messages_routes.route('/<int:channel_id>/all', methods=['GET'])
@login_required
def get_messages(channel_id):
    messages = Message.query.filter_by(channel_id=channel_id).all()
    return jsonify({"messages": [message.to_dict() for message in messages]}), 200

@messages_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_message(id):
    message = Message.query.get(id)
    if not message or message.user_id != current_user.id:
        current_app.logger.error(f'Message not found or unauthorized access attempt by user {current_user.id}')
        return jsonify({"message": "Bad request", "errors": {"message": "Message not found or unauthorized"}}), 403
    
    data = request.get_json()
    content = data.get('content')
    if not content:
        current_app.logger.error('No content provided for update')
        return jsonify({"error": "Content required"}), 400

    message.content = content
    message.updated_at = datetime.utcnow()
    try:
        db.session.commit()
        current_app.logger.info(f'Message {message.id} updated successfully by user {current_user.id}')
        return jsonify(message.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating message {message.id}: {str(e)}')
        return jsonify({"error": "Database update failed"}), 500

@messages_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_no_message(id):
    message = Message.query.get(id)
    if not message or message.user_id != current_user.id:
        return {"message": "Bad request", "errors": {"message": "Message not form found or unauthorized"}}, 403
    db.session.delete(message)
    db.session.commit()
    return {'message': 'Message deleted'}, 200
