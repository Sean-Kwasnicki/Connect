from datetime import datetime
from .db import db, environment, SCHEMA
# from flask_sqlalchemy import SQLAlchemy

# db = SQLAlchemy()

class ChannelMembers(db.Model):
    __tablename__ = 'channelmembers'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    channel_id = db.Column(db.Integer, db.ForeignKey('channels.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    user = db.relationship('User', back_populates='channelmembers')
    channel = db.relationship('Channel', back_populates='channelmembers')
