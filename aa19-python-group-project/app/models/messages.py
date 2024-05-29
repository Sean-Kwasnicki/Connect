from datetime import datetime
from .db import db, environment, SCHEMA

class Message(db.Model):
    __tablename__ = 'messages'
    __table_args__ = {'schema': SCHEMA} if environment == "production" else {}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(f'{SCHEMA}.users.id') if environment == "production" else db.ForeignKey('users.id'), nullable=False)
    channel_id = db.Column(db.Integer, db.ForeignKey(f'{SCHEMA}.channels.id') if environment == "production" else db.ForeignKey('channels.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship('User', back_populates='messages')
    channel = db.relationship('Channel', back_populates='messages')
