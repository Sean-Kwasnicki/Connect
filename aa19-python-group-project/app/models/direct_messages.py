from datetime import datetime
from .db import db, environment, SCHEMA

class DirectMessage(db.Model):
    __tablename__ = 'direct_messages'
    __table_args__ = {'schema': SCHEMA} if environment == "production" else {}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    content = db.Column(db.Text, nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey(f'{SCHEMA}.users.id') if environment == "production" else db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey(f'{SCHEMA}.users.id') if environment == "production" else db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    sender = db.relationship('User', foreign_keys=[sender_id], back_populates='sent_messages')
    receiver = db.relationship('User', foreign_keys=[receiver_id], back_populates='received_messages')
