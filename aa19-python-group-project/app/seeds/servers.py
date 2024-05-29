from app.models import db, Server, environment, SCHEMA
from datetime import datetime

def seed_servers():
    demo = Server(
        name="Demo Server!!!",
        owner_id="1",
        updated_at = datetime.now,
        created_at = datetime.now
    )

    db.session.add(demo)
    db.session.commit()
