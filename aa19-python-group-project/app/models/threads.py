from datetime import datetime
from .db import db, environment, SCHEMA
from .messages import Message

class Thread(db.Model):
    __tablename__ = 'threads'
    __table_args__ = {'schema': SCHEMA} if environment == "production" else {}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    message_id = db.Column(db.Integer, db.ForeignKey(f'{SCHEMA}.messages.id') if environment == "production" else db.ForeignKey('messages.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    message = db.relationship('Message', back_populates='threads')

    def __init__(self, message_id):
        self.message_id = message_id
