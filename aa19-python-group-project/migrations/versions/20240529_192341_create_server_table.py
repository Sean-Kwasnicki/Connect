"""create server table

Revision ID: cd533e375d84
Revises: ffdc0a98111c
Create Date: 2024-05-29 19:23:41.553277

"""
from alembic import op
import sqlalchemy as sa
    # id = db.Column(db.Integer, primary_key=True)
    # name = db.Column(db.String(50), nullable=False, unique=True)
    # owner_id = db.Column(db.Integer, nullable=False)
    # created_at = db.Column(db.Date)
    # updated_at = db.Column(db.Date)

# revision identifiers, used by Alembic.
revision = 'cd533e375d84'
down_revision = 'ffdc0a98111c'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'servers',
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(50), nullable=False),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.Column("public", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.Date()),
        sa.Column("updated_at", sa.Date()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
    )


def downgrade():
    op.drop_table('servers')
