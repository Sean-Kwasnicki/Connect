from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import DirectMessage, db, User
from app.forms import DirectMessageForm
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

# @direct_messages_routes.route('/<int:receiver_id>', methods=['POST'])
# @login_required
# def create_direct_message(receiver_id):
#     print("Endpoint reached")
#     form = DirectMessageForm()
#     # Temporarily skip CSRF token handling
#     # form['csrf_token'].data = request.cookies['csrf_token']

#     if form.validate_on_submit():
#         print("Form is valid")
#         new_dm = DirectMessage(
#             content=form.data['content'],
#             sender_id=current_user.id,
#             receiver_id=receiver_id,
#             created_at=datetime.now(),
#             updated_at=datetime.now()
#         )
#         db.session.add(new_dm)
#         db.session.commit()
#         return jsonify(new_dm.to_dict()), 201

#     print("Form errors:", form.errors)  # Add a print statement to see form errors
#     return form.errors, 401

@direct_messages_routes.route('/<int:receiver_id>', methods=['POST'])
@login_required
def create_direct_message(receiver_id):
    print("Backend route hit")
    data = request.json
    print("Request data:", data)

    # Temporarily skip form validation
    new_dm = DirectMessage(
        content=data.get('content'),
        sender_id=current_user.id,
        receiver_id=receiver_id,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    db.session.add(new_dm)
    db.session.commit()
    return jsonify(new_dm.to_dict()), 201


@direct_messages_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_direct_message(id):
    form = DirectMessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        dm = DirectMessage.query.get(id)
        if not dm or dm.sender_id != current_user.id:
            return {
                "message": "Bad request",
                "errors": {
                    "direct_message": "Direct Message not found or unauthorized"
                }
            }
        dm.content = form.data['content']
        dm.receiver_id = form.data['receiver_id']
        dm.updated_at = datetime.now()
        db.session.commit()
        return jsonify(dm.to_dict())
    return form.errors, 401

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


@direct_messages_routes.route('/users', methods=['GET'])
def get_all_users_except_current():
    user_id = current_user.id
    users = User.query.filter(User.id != user_id).all()
    return jsonify([user.to_dict() for user in users])


@direct_messages_routes.route('/<int:user_id>', methods=['GET'])
def get_direct_messages_with_user(user_id):
    current_user_id = current_user.id

    messages = DirectMessage.query.filter(
        ((DirectMessage.sender_id == current_user_id) & (DirectMessage.receiver_id == user_id)) |
        ((DirectMessage.sender_id == user_id) & (DirectMessage.receiver_id == current_user_id))
    ).order_by(DirectMessage.created_at).all()

    return jsonify([dm.to_dict() for dm in messages])
