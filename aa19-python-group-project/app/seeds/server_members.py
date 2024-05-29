from app.models import db, Server, ServerMember, environment, SCHEMA
from datetime import datetime

def seed_servers():
    demo = ServerMember(
        user_id="1",
        server_id="1",
        updated_at = datetime.now,
        created_at = datetime.now
    )

    demo2 = ServerMember(
        user_id="2",
        server_id="1",
        updated_at = datetime.now,
        created_at = datetime.now
    )

    db.session.add(demo)
    db.session.add(demo2)
    db.session.commit()
