from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    servers = db.relationship("ServerMember")

    messages = db.relationship('Message', back_populates='user', lazy='dynamic')
    sent_messages = db.relationship('DirectMessage', foreign_keys='DirectMessage.sender_id', back_populates='sender', lazy='dynamic')
    received_messages = db.relationship('DirectMessage', foreign_keys='DirectMessage.receiver_id', back_populates='receiver', lazy='dynamic')
    channel_members = db.relationship('ChannelMembers', back_populates='user')
    threads = db.relationship('Thread', secondary='messages', back_populates='user', lazy='dynamic')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
