from .db import db, environment, SCHEMA



class Server(db.Model):
    __tablename__ = 'servers'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    owner_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.Date)
    updated_at = db.Column(db.Date)

    users = db.relationship("ServerMember")