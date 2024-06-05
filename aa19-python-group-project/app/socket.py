from flask_socketio import SocketIO, emit, join_room, leave_room
import os
from flask_login import current_user

if os.environ.get("FLASK_ENV") == "production":
  origins = [
    "https://discord-project-ptgh.onrender.com"
  ]
else:
  origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)

# WebSocket Event Handlers

@socketio.on('connect')
def handle_connect():
  if current_user.is_authenticated:
    emit('connect', {'message': f'{current_user.username} has connected.'}, broadcast=True)
  else:
    emit('connect', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('disconnect')
def handle_disconnect():
  if current_user.is_authenticated:
    emit('disconnect', {'message': f'{current_user.username} has disconnected.'}, broadcast=True)
  else:
    emit('disconnect', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('create_server')
def handle_create_server(data):
  if current_user.is_authenticated:
    new_server = {
      'server_name': data['server_name'],
      'owner': current_user.username
    }
    emit('server_created', new_server, broadcast=True)
  else:
    emit('create_server', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('edit_server')
def handle_edit_server(data):
    if current_user.is_authenticated:
        emit('server_edited', {'server_id': data['server_id'], 'new_name': data['new_name'], 'user': current_user.username}, broadcast=True)
    else:
        emit('server_edited', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('delete_server')
def handle_delete_server(data):
  if current_user.is_authenticated:
    emit('server_deleted', {'server_id': data['server_id'], 'user': current_user.username}, broadcast=True)
  else:
    emit('server_deleted', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('join_server')
def handle_join_server(data):
  if current_user.is_authenticated:
    join_room(data['server_id'])
    emit('join_server', {'message': f'{current_user.username} has joined the server.'}, room=data['server_id'])
  else:
    emit('join_server', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('leave_server')
def handle_leave_server(data):
  if current_user.is_authenticated:
    leave_room(data['server_id'])
    emit('leave_server', {'message': f'{current_user.username} has left the server.'}, room=data['server_id'])
  else:
    emit('leave_server', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('create_channel')
def handle_create_channel(data):
  if current_user.is_authenticated:
    new_channel = {
      'channel_name': data['channel_name'],
      'server_id': data['server_id']
    }
    emit('channel_created', new_channel, room=data['server_id'], broadcast=True)
  else:
    emit('create_channel', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('join_channel')
def handle_join_channel(data):
  if current_user.is_authenticated:
    join_room(data['channel_id'])
    emit('join_channel', {'message': f'{current_user.username} has joined the channel.'}, room=data['channel_id'])
  else:
    emit('join_channel', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('leave_channel')
def handle_leave_channel(data):
  if current_user.is_authenticated:
    leave_room(data['channel_id'])
    emit('leave_channel', {'message': f'{current_user.username} has left the channel.'}, room=data['channel_id'])
  else:
    emit('leave_channel', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('edit_channel')
def handle_edit_channel(data):
  if current_user.is_authenticated:
    emit('channel_edited', {'channel_id': data['channel_id'], 'new_name': data['new_name'], 'user': current_user.username}, room=data['server_id'], broadcast=True)
  else:
    emit('channel_edited', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('delete_channel')
def handle_delete_channel(data):
  if current_user.is_authenticated:
    emit('channel_deleted', {'channel_id': data['channel_id'], 'user': current_user.username}, room=data['server_id'], broadcast=True)
  else:
    emit('channel_deleted', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('create_message')
def handle_create_message(data):
  if current_user.is_authenticated:
    new_message = {
      'message': data['message'],
      'user': current_user.username,
      'channel_id': data['channel_id']
    }
    emit('message_created', new_message, room=data['channel_id'])
  else:
    emit('create_message', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('send_message')
def handle_send_message(data):
  if current_user.is_authenticated:
    emit('message', {'message': data['message'], 'user': current_user.username}, room=data['channel_id'], broadcast=True)
    emit('notification', {'message': f'New message in channel from {current_user.username}'}, room=data['channel_id'], include_self=False)
  else:
    emit('message', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('edit_message')
def handle_edit_message(data):
  if current_user.is_authenticated:
    emit('message_edited', {'message_id': data['message_id'], 'new_content': data['new_content'], 'user': current_user.username}, room=data['channel_id'], broadcast=True)
  else:
    emit('message_edited', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('delete_message')
def handle_delete_message(data):
  if current_user.is_authenticated:
    emit('message_deleted', {'message_id': data['message_id'], 'user': current_user.username}, room=data['channel_id'], broadcast=True)
  else:
    emit('message_deleted', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('create_direct_message')
def handle_create_direct_message(data):
  if current_user.is_authenticated:
    new_direct_message = {
      'message': data['message'],
      'sender': current_user.username,
      'receiver_id': data['receiver_id']
    }
    emit('direct_message_created', new_direct_message, room=f'user_{data["receiver_id"]}')
  else:
    emit('create_direct_message', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('send_direct_message')
def handle_send_direct_message(data):
  if current_user.is_authenticated:
    emit('direct_message', {'message': data['message'], 'user': current_user.username}, room=f'user_{data["recipient_id"]}', broadcast=True)
    emit('notification', {'message': f'New direct message from {current_user.username}'}, room=f'user_{data["recipient_id"]}', include_self=False)
  else:
    emit('direct_message', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('edit_direct_message')
def handle_edit_direct_message(data):
  if current_user.is_authenticated:
    emit('direct_message_edited', {'message_id': data['message_id'], 'new_content': data['new_content'], 'user': current_user.username}, room=f'user_{data["recipient_id"]}', broadcast=True)
  else:
    emit('direct_message_edited', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('delete_direct_message')
def handle_delete_direct_message(data):
  if current_user.is_authenticated:
    emit('direct_message_deleted', {'message_id': data['message_id'], 'user': current_user.username}, room=f'user_{data["recipient_id"]}', broadcast=True)
  else:
    emit('direct_message_deleted', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('create_thread')
def handle_create_thread(data):
  if current_user.is_authenticated:
    thread_id = f'thread_{data["message_id"]}'
    join_room(thread_id)
    emit('thread_created', {'thread_id': thread_id, 'message': f'Thread created from message {data["message_id"]}'}, room=data['channel_id'], broadcast=True)
  else:
    emit('thread_created', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('edit_thread')
def handle_edit_thread(data):
  if current_user.is_authenticated:
    emit('thread_edited', {'thread_id': data['thread_id'], 'new_content': data['new_content'], 'user': current_user.username}, room=data['channel_id'], broadcast=True)
  else:
    emit('thread_edited', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('send_thread_message')
def handle_send_thread_message(data):
  if current_user.is_authenticated:
    emit('thread_message', {'message': data['message'], 'user': current_user.username}, room=data['thread_id'], broadcast=True)
  else:
    emit('thread_message', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('delete_thread')
def handle_delete_thread(data):
  if current_user.is_authenticated:
    emit('thread_deleted', {'thread_id': data['thread_id'], 'user': current_user.username}, room=data['channel_id'], broadcast=True)
  else:
    emit('thread_deleted', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('add_reaction')
def handle_add_reaction(data):
  if current_user.is_authenticated:
    reaction = {
      'message_id': data['message_id'],
      'emoji': data['emoji'],
      'user': current_user.username
    }
    emit('reaction_added', reaction, room=data['channel_id'], broadcast=True)
  else:
    emit('reaction_added', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('edit_reaction')
def handle_edit_reaction(data):
  if current_user.is_authenticated:
    emit('reaction_edited', {'message_id': data['message_id'], 'old_emoji': data['old_emoji'], 'new_emoji': data['new_emoji'], 'user': current_user.username}, room=data['channel_id'], broadcast=True)
  else:
    emit('reaction_edited', {'message': 'Forbidden'}, broadcast=False)

@socketio.on('remove_reaction')
def handle_remove_reaction(data):
  if current_user.is_authenticated:
    emit('reaction_removed', {'message_id': data['message_id'], 'emoji': data['emoji'], 'user': current_user.username}, room=data['channel_id'], broadcast=True)
  else:
    emit('reaction_removed', {'message': 'Forbidden'}, broadcast=False)
