"""create server_member table

Revision ID: 6f8d12e87f63
Revises: 095b17a4af11
Create Date: 2024-05-29 19:25:56.694437

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6f8d12e87f63'
down_revision = '095b17a4af11'
branch_labels = None
depends_on = None


def upgrade():
    sa.create_table(
        "server_members",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("user.id"), nullable=False),
        sa.Column("server_id", sa.Integer, sa.ForeignKey("server.id"), nullable=False),
        sa.Column("created_at", sa.Date()),
        sa.Column("updated_at", sa.Date()),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade():
    op.drop_table("server_members")
