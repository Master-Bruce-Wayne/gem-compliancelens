"""authenticity

Revision ID: 7a8b9c0d1e2f
Revises: 6d7679cd0cf1
Create Date: 2026-09-16 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '7a8b9c0d1e2f'
down_revision: Union[str, None] = '6d7679cd0cf1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # We need to create the custom enums manually before using them in the tables
    op.execute("CREATE TYPE authenticity_check_type_enum AS ENUM ('checksum', 'metadata', 'ela', 'llm_consistency', 'hash_reuse')")
    op.execute("CREATE TYPE authenticity_status_enum AS ENUM ('pass', 'fail', 'needs_review')")

    op.create_table('document_authenticity_checks',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('document_id', sa.UUID(), nullable=False),
        sa.Column('check_type', postgresql.ENUM('checksum', 'metadata', 'ela', 'llm_consistency', 'hash_reuse', name='authenticity_check_type_enum', create_type=False), nullable=False),
        sa.Column('status', postgresql.ENUM('pass', 'fail', 'needs_review', name='authenticity_status_enum', create_type=False), nullable=False),
        sa.Column('detail', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('evidence_path', sa.String(), nullable=True),
        sa.Column('checked_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['document_id'], ['bidder_documents.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('document_hashes',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('file_hash', sa.String(), nullable=False),
        sa.Column('bidder_id', sa.UUID(), nullable=False),
        sa.Column('uploader_id', sa.UUID(), nullable=True),
        sa.Column('doc_type', sa.String(), nullable=False),
        sa.Column('uploaded_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['bidder_id'], ['bidders.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_document_hashes_file_hash'), 'document_hashes', ['file_hash'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_document_hashes_file_hash'), table_name='document_hashes')
    op.drop_table('document_hashes')
    op.drop_table('document_authenticity_checks')
    op.execute('DROP TYPE authenticity_status_enum')
    op.execute('DROP TYPE authenticity_check_type_enum')
