from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.db.models.users import User
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.config import settings
import uuid

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

@router.post("/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    if user.role not in ['officer', 'bidder']:
        raise HTTPException(status_code=400, detail="Invalid role")
        
    result = await db.execute(select(User).filter(User.email == user.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    new_user = User(
        email=user.email,
        password_hash=hashed_password,
        role=user.role,
        full_name=user.full_name
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # If bidder, also create a Bidder profile
    if user.role == 'bidder':
        from app.db.models.bidders import Bidder
        new_bidder = Bidder(id=new_user.id, company_name=user.full_name)
        db.add(new_bidder)
        await db.commit()

    return {"message": "User created successfully"}

@router.post("/login")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == user.email))
    db_user = result.scalars().first()
    
    if not db_user or not pwd_context.verify(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": str(db_user.id), "role": db_user.role})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "id": str(db_user.id),
            "email": db_user.email,
            "role": db_user.role,
            "name": db_user.full_name
        }
    }
