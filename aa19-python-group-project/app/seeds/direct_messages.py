from app.models import db, DirectMessage, environment, SCHEMA
from sqlalchemy import text
from datetime import datetime

def seed_direct_messages():
    direct_message1 = DirectMessage(content='Hey, how are you?', sender_id=1, receiver_id=2, created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    direct_message2 = DirectMessage(content='I am good, thanks!', sender_id=2, receiver_id=1, created_at=datetime.utcnow(), updated_at=datetime.utcnow())

    db.session.add(direct_message1)
    db.session.add(direct_message2)
    db.session.commit()

def undo_direct_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.direct_messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM direct_messages"))

    db.session.commit()
