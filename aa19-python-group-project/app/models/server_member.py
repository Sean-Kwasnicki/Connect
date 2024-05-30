from .db import db, environment, SCHEMA



class ServerMember(db.Model):
    __tablename__ = 'server_members'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    server_id = db.Column(db.Integer, db.ForeignKey("servers.id"), nullable=False)
    created_at = db.Column(db.Date)
    updated_at = db.Column(db.Date)

    user = db.relationship("User", back_populates="servers")
    server = db.relationship("Server", back_populates="users")
