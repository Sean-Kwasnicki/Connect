from app.models import db, Thread, environment, SCHEMA
from sqlalchemy import text
from datetime import datetime

def seed_threads():
    thread1 = Thread(message_id=1, created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    thread2 = Thread(message_id=2, created_at=datetime.utcnow(), updated_at=datetime.utcnow())

    db.session.add(thread1)
    db.session.add(thread2)
    db.session.commit()

def undo_threads():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.threads RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM threads"))

    db.session.commit()
