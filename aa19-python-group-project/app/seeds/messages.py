from app.models import db, Message, environment, SCHEMA
from sqlalchemy import text
from datetime import datetime

def seed_messages():
    message1 = Message(content='Hello, world!', user_id=1, channel_id=1, created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    message2 = Message(content='Another message', user_id=2, channel_id=1, created_at=datetime.utcnow(), updated_at=datetime.utcnow())

    db.session.add(message1)
    db.session.add(message2)
    db.session.commit()

def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM messages"))

    db.session.commit()
