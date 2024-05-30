from datetime import datetime
from .db import db, environment, SCHEMA
# from flask_sqlalchemy import SQLAlchemy

# db = SQLAlchemy()

class Thread(db.Model):
    __tablename__ = 'threads'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    message_id = db.Column(db.Integer, db.ForeignKey('messages.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    messages = db.relationship('Message', back_populates='threads')
