from flask_socketio import SocketIO, join_room, leave_room, emit
import os

socketio = SocketIO()

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "https://connect-imdc.onrender.com/",
        "http://connect-imdc.onrender.com/",
        "https://connect-0hg1.onrender.com/",
        "http://connect-0hg1.onrender.com/"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins="*")

# Server dictionary to keep track of users in each server
# Single source of truth for the current state of each room.
servers = {}

@socketio.on('join_server')
def on_join(data):
    print(f"Received join_server event with data: {data}")
    server = data.get('server')
    user = data.get('user')
    if server and user:
        if server not in servers:
            servers[server] = []
        if user not in servers[server]:
            servers[server].append(user)
        join_room(server)
        print(f"User {user} joined server {server}. Current users: {servers[server]}")
        emit('update_users', {'server': server, 'users': servers[server]}, to=server)
    else:
        print("Invalid data received for join_server event")

@socketio.on('leave_server')
def on_leave(data):
    print(f"Received leave_server event with data: {data}")
    server = data.get('server')
    user = data.get('user')
    if server and user:
        leave_room(server)
        if server in servers and user in servers[server]:
            servers[server].remove(user)
            print(f"User {user} left server {server}. Current users: {servers[server]}")
            emit('update_users', {'server': server, 'users': servers[server]}, to=server)
        else:
            print(f"User {user} not found in server {server}")
    else:
        print("Invalid data received for leave_server event")

@socketio.on('join')
def handle_join(data):
    room = data['room']
    join_room(room)
    emit('user_joined', {'msg': f"{data['user']} has joined the room {room}."}, to=room)

@socketio.on('leave')
def handle_leave(data):
    room = data['room']
    leave_room(room)
    emit('user_left', {'msg': f"{data['user']} has left the room {room}."}, to=room)

@socketio.on('message')
def handle_message(data):
    room = data['room']
    emit('message', data['message'], to=room)

@socketio.on('delete_message')
def handle_delete_message(data):
    room = data['room']
    message_id = data['message_id']
    emit('delete_message', {'message_id': message_id}, to=room)

@socketio.on('create_server')
def create_server(data):
    emit('create_server', data['server'], to=-1)

@socketio.on('update_server')
def update_server(data):
    emit('update_server', data['payload'], to=-1)

@socketio.on('delete_server')
def delete_server(data):
    emit('delete_server', data['serverId'], to=-1)

@socketio.on('reaction')
def handle_reaction(data):
    room = data['room']
    reaction = data['reaction']
    if 'remove' in reaction and reaction['remove']:
        emit('remove_reaction', {'reactionId': reaction['reactionId'], 'messageId': reaction['messageId']}, to=room)
    else:
        emit('new_reaction', reaction, to=room)

@socketio.on('create_channel')
def handle_create_channel(data):
    server = data['server']
    channel = data['channel']
    emit('new_channel', {'server': server, 'channel': channel}, to=server)

@socketio.on('delete_channel')
def handle_delete_channel(data):
    print(data)
    server = data['server']
    channel_id = data['channel_id']
    emit('delete_channel', {'server': server, 'channel_id': channel_id}, to=server)
