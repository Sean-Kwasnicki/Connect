from flask.cli import AppGroup
from .users import seed_users, undo_users
from .channel import seed_channels, undo_channels
from .channelmembers import seed_channelmembers, undo_channelmembers
from .direct_messages import seed_direct_messages, undo_direct_messages
from .messages import seed_messages, undo_messages
from .reactions import seed_reactions, undo_reactions
from .servers import seed_servers, undo_servers
from .server_members import seed_server_members, undo_server_members
from .threads import seed_threads, undo_threads




from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_channels()
        undo_channelmembers()
        undo_direct_messages()
        undo_messages()
        undo_reactions()
        undo_servers()
        undo_server_members()
        undo_threads
    seed_users()
    seed_channels()
    seed_channelmembers()
    seed_direct_messages()
    seed_messages()
    seed_reactions()
    seed_servers()
    seed_server_members()
    seed_threads()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    # Add other undo functions here
