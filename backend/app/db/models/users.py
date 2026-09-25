from sqlalchemy import Column, String, Enum
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy import DateTime

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(Enum('officer', 'junior_officer', 'senior_officer', 'bidder', 'admin', name='user_role_enum'))
    full_name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
