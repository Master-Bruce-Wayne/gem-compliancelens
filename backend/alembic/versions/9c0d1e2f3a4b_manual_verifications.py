"""Add manual verifications

Revision ID: 9c0d1e2f3a4b
Revises: 8b9c0d1e2f3a
Create Date: 2026-09-17 14:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '9c0d1e2f3a4b'
down_revision: Union[str, None] = '8b9c0d1e2f3a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    sa.Enum('verified', 'not_verified', 'could_not_determine', name='manual_verification_outcome_enum').create(op.get_bind())

    op.create_table(
        'manual_verifications',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('evaluation_check_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('officer_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('outcome', postgresql.ENUM('verified', 'not_verified', 'could_not_determine', name='manual_verification_outcome_enum', create_type=False), nullable=False),
        sa.Column('notes', sa.String(), nullable=True),
        sa.Column('checked_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['evaluation_check_id'], ['evaluation_checks.id']),
        sa.ForeignKeyConstraint(['officer_id'], ['users.id'])
    )

def downgrade() -> None:
    op.drop_table('manual_verifications')
    sa.Enum(name='manual_verification_outcome_enum').drop(op.get_bind())
