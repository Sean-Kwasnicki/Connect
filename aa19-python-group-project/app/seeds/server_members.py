from app.models import db, Server, ServerMember, environment, SCHEMA
from datetime import datetime
from sqlalchemy.sql import text

def seed_server_members():
    demo = ServerMember(
        user_id="1",
        server_id="1",
        updated_at=datetime.now(),
        created_at=datetime.now()
    )

    demo2 = ServerMember(
        user_id="2",
        server_id="1",
        updated_at=datetime.now(),
        created_at=datetime.now()
    )

    db.session.add(demo)
    db.session.add(demo2)
    db.session.commit()

def undo_server_members():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM server_members"))

    db.session.commit()
