from app.models import db, ChannelMembers, environment, SCHEMA
from sqlalchemy.sql import text

def seed_channel_memberships():
    membership1 = ChannelMembers(user_id=1, channel_id=1)
    membership2 = ChannelMembers(user_id=2, channel_id=1)
    membership3 = ChannelMembers(user_id=3, channel_id=2)

    db.session.add(membership1)
    db.session.add(membership2)
    db.session.add(membership3)
    db.session.commit()

def undo_channel_memberships():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.channel_memberships RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM channel_memberships"))

    db.session.commit()
