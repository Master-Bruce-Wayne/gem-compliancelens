"""Add bid applications lifecycle tables

Revision ID: 8b9c0d1e2f3a
Revises: 7a8b9c0d1e2f
Create Date: 2026-09-17 14:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '8b9c0d1e2f3a'
down_revision: Union[str, None] = '7a8b9c0d1e2f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Enums
    sa.Enum('draft', 'submitted', 'under_evaluation', 'clarification_requested', 'qualified', 'disqualified', 'withdrawn', name='bid_status_enum').create(op.get_bind())
    sa.Enum('open', 'responded', 'closed', name='clarification_status_enum').create(op.get_bind())

    # Create tables
    op.create_table(
        'bid_applications',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tender_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('bidder_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('status', postgresql.ENUM('draft', 'submitted', 'under_evaluation', 'clarification_requested', 'qualified', 'disqualified', 'withdrawn', name='bid_status_enum', create_type=False), nullable=False),
        sa.Column('submitted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('current_evaluation_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['tender_id'], ['tenders.id']),
        sa.ForeignKeyConstraint(['bidder_id'], ['bidders.id']),
        sa.ForeignKeyConstraint(['current_evaluation_id'], ['evaluations.id']),
        sa.UniqueConstraint('tender_id', 'bidder_id', name='uq_tender_bidder')
    )

    op.create_table(
        'bid_application_documents',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('bid_application_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('document_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('attached_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['bid_application_id'], ['bid_applications.id']),
        sa.ForeignKeyConstraint(['document_id'], ['bidder_documents.id'])
    )

    op.create_table(
        'clarification_requests',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('bid_application_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('officer_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('message', sa.String(), nullable=False),
        sa.Column('related_check_ids', postgresql.JSONB(), nullable=True),
        sa.Column('status', postgresql.ENUM('open', 'responded', 'closed', name='clarification_status_enum', create_type=False), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('responded_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['bid_application_id'], ['bid_applications.id']),
        sa.ForeignKeyConstraint(['officer_id'], ['users.id'])
    )

    op.create_table(
        'clarification_responses',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('clarification_request_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('bidder_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('message', sa.String(), nullable=False),
        sa.Column('new_document_ids', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['clarification_request_id'], ['clarification_requests.id']),
        sa.ForeignKeyConstraint(['bidder_id'], ['users.id'])
    )

def downgrade() -> None:
    op.drop_table('clarification_responses')
    op.drop_table('clarification_requests')
    op.drop_table('bid_application_documents')
    op.drop_table('bid_applications')
    sa.Enum(name='clarification_status_enum').drop(op.get_bind())
    sa.Enum(name='bid_status_enum').drop(op.get_bind())
