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
