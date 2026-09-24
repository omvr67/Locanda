"""Align session guest IDs with the guest table.

Revision ID: 7f4b8c2d1e90
Revises: 6a5a980c4a77
"""

from typing import Sequence, Union

from alembic import op
from sqlalchemy.dialects import postgresql


revision: str = "7f4b8c2d1e90"
down_revision: Union[str, Sequence[str], None] = "6a5a980c4a77"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "session_context",
        "guest_id",
        existing_type=postgresql.VARCHAR(length=255),
        type_=postgresql.UUID(),
        postgresql_using="guest_id::uuid",
        existing_nullable=False,
    )
    op.create_foreign_key(
        "session_context_guest_id_fkey",
        "session_context",
        "guest",
        ["guest_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint(
        "session_context_guest_id_fkey",
        "session_context",
        type_="foreignkey",
    )
    op.alter_column(
        "session_context",
        "guest_id",
        existing_type=postgresql.UUID(),
        type_=postgresql.VARCHAR(length=255),
        postgresql_using="guest_id::text",
        existing_nullable=False,
    )
