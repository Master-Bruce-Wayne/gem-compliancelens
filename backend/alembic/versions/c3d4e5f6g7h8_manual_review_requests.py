"""manual review requests

Revision ID: c3d4e5f6g7h8
Revises: b2c3d4e5f6g7
Create Date: 2026-09-25 21:52:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'c3d4e5f6g7h8'
down_revision = 'b2c3d4e5f6g7'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('bidder_documents', sa.Column('manual_review_requested', sa.Boolean(), server_default='false', nullable=True))
    op.add_column('bidder_documents', sa.Column('manual_review_message', sa.String(), nullable=True))

def downgrade():
    op.drop_column('bidder_documents', 'manual_review_message')
    op.drop_column('bidder_documents', 'manual_review_requested')
