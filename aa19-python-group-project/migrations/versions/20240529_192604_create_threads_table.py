"""create threads table

Revision ID: 1e0926e6e2a9
Revises: 6f8d12e87f63
Create Date: 2024-05-29 19:26:04.875013

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1e0926e6e2a9'
down_revision = '6f8d12e87f63'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'threads',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('message_id', sa.Integer, sa.ForeignKey('messages.id'), nullable=False),
        sa.Column('created_at', sa.DateTime, default=sa.func.current_timestamp()),
        sa.Column('updated_at', sa.DateTime, default=sa.func.current_timestamp(), onupdate=sa.func.current_timestamp())
    )


def downgrade():
    op.drop_table('threads')
