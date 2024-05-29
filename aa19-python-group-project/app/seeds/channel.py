from app.models import db, Channel, environment, SCHEMA
from sqlalchemy.sql import text

def seed_channels():
    general = Channel(name='general', server_id=1)
    admin = Channel(name='admin', server_id=1)

    db.session.add(general)
    db.session.add(admin)
    db.session.commit()

def undo_channels():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM channels"))

    db.session.commit()
