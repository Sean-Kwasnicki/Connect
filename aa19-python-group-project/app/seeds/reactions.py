from app.models import db, Reaction, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_reactions():
    reaction1 = Reaction(emoji='😀', user_id=1, message_id=1, created_at=datetime.now(), updated_at=datetime.now())
    reaction2 = Reaction(emoji='😢', user_id=2, message_id=1, created_at=datetime.now(), updated_at=datetime.now())
    reaction3 = Reaction(emoji='👍', user_id=3, message_id=1, created_at=datetime.now(), updated_at=datetime.now())
    reaction4 = Reaction(emoji='😀', user_id=1, message_id=2, created_at=datetime.now(), updated_at=datetime.now())
    reaction5 = Reaction(emoji='😢', user_id=2, message_id=2, created_at=datetime.now(), updated_at=datetime.now())
    reaction6 = Reaction(emoji='👍', user_id=3, message_id=2, created_at=datetime.now(), updated_at=datetime.now())


    db.session.add(reaction1)
    db.session.add(reaction2)
    db.session.add(reaction3)
    db.session.add(reaction4)
    db.session.add(reaction5)
    db.session.add(reaction6)
    db.session.commit()

def undo_reactions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reactions"))

    db.session.commit()
