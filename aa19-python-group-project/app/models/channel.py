from datetime import datetime
from .db import db, environment, SCHEMA
# from flask_sqlalchemy import SQLAlchemy

# db = SQLAlchemy()

class Channel(db.Model):
    __tablename__ = 'channels'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    server_id = db.Column(db.Integer, db.ForeignKey('servers.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)

    server = db.relationship('Server', back_populates='channels')
    messages = db.relationship('Message', back_populates='channel')
    channelmembers = db.relationship('ChannelMembers', back_populates='channel')
