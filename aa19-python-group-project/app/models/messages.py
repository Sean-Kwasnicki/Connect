from datetime import datetime
from .db import db
# from flask_sqlalchemy import SQLAlchemy

# db = SQLAlchemy()

class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    channel_id = db.Column(db.Integer, db.ForeignKey('channels.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship('User', back_populates='messages')
    channel = db.relationship('Channel', back_populates='messages')
    threads = db.relationship('Thread', back_populates='messages', cascade = "all,delete")
    reactions = db.relationship('Reaction', cascade = "all,delete")

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'user_id': self.user_id,
            'channel_id': self.channel_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
