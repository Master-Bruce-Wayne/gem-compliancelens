"""maker checker workflow

Revision ID: d4e5f6g7h8i9
Revises: c3d4e5f6g7h8
Create Date: 2026-09-25 23:26:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

# revision identifiers, used by Alembic.
revision = 'd4e5f6g7h8i9'
down_revision = 'c3d4e5f6g7h8'
branch_labels = None
depends_on = None

def upgrade():
    # It's generally required to commit the transaction before altering an enum type in Postgres
    # if it's in a transaction block.
    op.execute("COMMIT")
    
    op.execute("ALTER TYPE user_role_enum ADD VALUE IF NOT EXISTS 'junior_officer'")
    op.execute("ALTER TYPE user_role_enum ADD VALUE IF NOT EXISTS 'senior_officer'")
    op.execute("ALTER TYPE bid_status_enum ADD VALUE IF NOT EXISTS 'pending_approval'")

    op.execute("BEGIN") # Restart transaction

    # Add columns to decisions
    op.add_column('decisions', sa.Column('checker_id', UUID(as_uuid=True), nullable=True))
    op.create_foreign_key('fk_decisions_checker_id_users', 'decisions', 'users', ['checker_id'], ['id'])
    op.add_column('decisions', sa.Column('checker_decision', sa.String(), nullable=True))
    op.add_column('decisions', sa.Column('checker_note', sa.String(), nullable=True))
    op.add_column('decisions', sa.Column('checked_at', sa.DateTime(timezone=True), nullable=True))

def downgrade():
    op.drop_constraint('fk_decisions_checker_id_users', 'decisions', type_='foreignkey')
    op.drop_column('decisions', 'checked_at')
    op.drop_column('decisions', 'checker_note')
    op.drop_column('decisions', 'checker_decision')
    op.drop_column('decisions', 'checker_id')
