"""create messages table

Revision ID: 6b9d9a8efa44
Revises: c92b0b1108ec
Create Date: 2024-05-29 19:25:39.987176

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6b9d9a8efa44'
down_revision = 'c92b0b1108ec'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'messages',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
        sa.Column('channel_id', sa.Integer, sa.ForeignKey('channels.id'), nullable=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.current_timestamp()),
        sa.Column('updated_at', sa.DateTime, default=sa.func.current_timestamp(), onupdate=sa.func.current_timestamp())
    )


def downgrade():
    op.drop_table('messages')
