"""Add verification results table

Revision ID: a1b2c3d4e5f6
Revises: 9c0d1e2f3a4b
Create Date: 2026-09-17 14:20:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '9c0d1e2f3a4b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'verification_results',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('check_type', sa.String(), nullable=False),
        sa.Column('identifier', sa.String(), nullable=False),
        sa.Column('response_payload', postgresql.JSONB(), nullable=False),
        sa.Column('provider', sa.String(), nullable=False),
        sa.Column('fetched_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
    )

def downgrade() -> None:
    op.drop_table('verification_results')
