import eventlet
eventlet.monkey_patch()

import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User, Message, DirectMessage, Thread, Reaction, Server, ServerMember, Channel, ChannelMembers
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.server_routes import server_routes
from .api.channel_routes import channel_routes
from .api.channel_members_routes import channel_members_routes
from .api.messages import messages_routes
from .api.direct_messages import direct_messages_routes
from .api.threads import threads_routes
from .seeds import seed_commands
from .config import Config
# from .sockets import socketio

app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(channel_routes, url_prefix='/api/channels')
app.register_blueprint(server_routes, url_prefix='/api/servers')
app.register_blueprint(channel_members_routes, url_prefix='/api/channels')
app.register_blueprint(messages_routes, url_prefix='/api/messages')
app.register_blueprint(direct_messages_routes, url_prefix='/api/direct_messages')
app.register_blueprint(threads_routes, url_prefix='/api/threads')
db.init_app(app)
Migrate(app, db)

# Application Security
CORS(app)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response

@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    app.view_functions[rule.endpoint].__doc__ ]
                    for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

# ###################################################################
# socket stuff
from flask_socketio import SocketIO, emit, join_room, leave_room,send


# Initialize SocketIO
socketio = SocketIO()

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "https://connect-0hg1.onrender.com/",
        "http://connect-0hg1.onrender.com/"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)
socketio.init_app(app)

@socketio.on('join')
def handle_join(data):
    room = data['room']
    join_room(room)
    # emit('user_joined', {'msg': f"{data['user']} has joined the room {room}."}, to=room)

@socketio.on('leave')
def handle_leave(data):
    room = data['room']
    leave_room(room)
    # emit('user_left', {'msg': f"{data['user']} has left the room {room}."}, to=room)

@socketio.on('message')
def handle_message(data):
    room = data['room']
    emit("message", data['message'], to=room)

@socketio.on('delete_message')
def handle_delete_message(data):
    room = data['room']
    message_id = data['message_id']
    emit('delete_message', {'message_id': message_id}, to=room)

# if __name__ == '__main__':
#     socketio.run(app, host='0.0.0.0', port=5000)
