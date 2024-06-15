from app.models import db, Server, environment, SCHEMA
from datetime import datetime
from sqlalchemy.sql import text

def seed_servers():
    demo = Server(
        name="Demo Server!!!",
        owner_id="1",
        public=True,
        updated_at=datetime.now(),
        created_at=datetime.now()
    )

    db.session.add(demo)
    db.session.commit()


def undo_servers():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM servers"))

    db.session.commit()
