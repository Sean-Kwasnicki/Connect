from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Thread, Message, db
from app.forms import ThreadForm
from datetime import datetime

threads_routes = Blueprint('threads', __name__)

@threads_routes.route('', methods=['GET'])
@login_required
def all_threads():
    threads = Thread.query.all()
    threads_list = [{
        "id": thread.id,
        "message_id": thread.message_id,
        "created_at": thread.created_at,
        "updated_at": thread.updated_at
    } for thread in threads]
    return {"Threads": threads_list}

@threads_routes.route('/<int:id>', methods=['GET'])
@login_required
def thread_by_id(id):
    thread = Thread.query.get(id)
    if not thread:
        return {
            "message": "Bad request",
            "errors": {
                "thread": "Thread not found"
            }
        }
    return {
        "id": thread.id,
        "message_id": thread.message_id,
        "created_at": thread.created_at,
        "updated_at": thread.updated_at
    }

@threads_routes.route('', methods=['POST'])
@login_required
def create_thread():
    form = ThreadForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        message = Message.query.get(form.data['message_id'])
        if not message:
            return {
                "message": "Bad request",
                "errors": {
                    "message": "Message not found"
                }
            }
        new_thread = Thread(
            message_id=message.id,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(new_thread)
        db.session.commit()
        return jsonify(new_thread.to_dict()), 201
    return form.errors, 401

@threads_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_thread(id):
    thread = Thread.query.get(id)
    if not thread:
        return {
            "message": "Bad request",
            "errors": {
                "thread": "Thread not found"
            }
        }
    db.session.delete(thread)
    db.session.commit()
    return {"message": "Thread deleted"}
