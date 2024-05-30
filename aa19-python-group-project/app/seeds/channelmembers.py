from app.models import db, ChannelMembers, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_channelmembers():
    membership1 = ChannelMembers(user_id=1, channel_id=1, created_at=datetime.now(), updated_at=datetime.now())
    membership2 = ChannelMembers(user_id=2, channel_id=1, created_at=datetime.now(), updated_at=datetime.now())
    membership3 = ChannelMembers(user_id=3, channel_id=2, created_at=datetime.now(), updated_at=datetime.now())

    db.session.add(membership1)
    db.session.add(membership2)
    db.session.add(membership3)
    db.session.commit()

def undo_channelmembers():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.channelmembers RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM channelmembers"))

    db.session.commit()
