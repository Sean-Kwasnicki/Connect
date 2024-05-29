from app.models import db, Reaction, environment, SCHEMA
from sqlalchemy.sql import text

def seed_reactions():
    reaction1 = Reaction(emoji='😀', user_id=1, message_id=1)
    reaction2 = Reaction(emoji='😢', user_id=2, message_id=1)
    reaction3 = Reaction(emoji='👍', user_id=3, message_id=1)
    reaction4 = Reaction(emoji='😀', user_id=1, message_id=2)
    reaction5 = Reaction(emoji='😢', user_id=2, message_id=2)
    reaction6 = Reaction(emoji='👍', user_id=3, message_id=2)


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
