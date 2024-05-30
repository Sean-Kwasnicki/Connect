"""create direct_messages table

Revision ID: c92b0b1108ec
Revises: 9b622ac1b1cb
Create Date: 2024-05-29 19:25:36.237940

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c92b0b1108ec'
down_revision = '9b622ac1b1cb'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'direct_messages',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('sender_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('receiver_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.current_timestamp()),
        sa.Column('updated_at', sa.DateTime, default=sa.func.current_timestamp(), onupdate=sa.func.current_timestamp())
    )


def downgrade():
    op.drop_table('direct_messages')
