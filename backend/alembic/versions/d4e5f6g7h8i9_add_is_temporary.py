"""add is_temporary to bidder_documents

Revision ID: d4e5f6g7h8i9
Revises: c3d4e5f6g7h8
Create Date: 2026-09-25 22:36:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'd4e5f6g7h8i9'
down_revision = 'c3d4e5f6g7h8'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column('bidder_documents', sa.Column('is_temporary', sa.Boolean(), server_default='false', nullable=True))

def downgrade() -> None:
    op.drop_column('bidder_documents', 'is_temporary')
