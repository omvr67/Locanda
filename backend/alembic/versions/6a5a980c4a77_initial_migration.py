"""Create the initial application schema.

Revision ID: 6a5a980c4a77
Revises:
Create Date: 2026-08-20 18:37:21.333253
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from database import Base
import models


revision: str = "6a5a980c4a77"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    bind.execute(sa.text("CREATE EXTENSION IF NOT EXISTS vector"))
    Base.metadata.create_all(bind=bind)


def downgrade() -> None:
    bind = op.get_bind()
    Base.metadata.drop_all(bind=bind)
