from .db import db, environment, SCHEMA
from datetime import datetime



class Server(db.Model):
    __tablename__ = 'servers'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    owner_id = db.Column(db.Integer, nullable=False)
    public = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)

    users = db.relationship("ServerMember", cascade = "all,delete")
    channels = db.relationship("Channel", cascade = "all,delete")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'owner_id': self.owner_id,
            'public': self.public,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
