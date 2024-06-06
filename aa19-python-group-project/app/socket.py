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

# WebSocket Event Handlers need to be added from app init file
