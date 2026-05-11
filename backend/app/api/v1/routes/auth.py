from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.auth import UserCreate, LoginRequest, UserResponse, Token
from app.services import auth as svc

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    email = svc.decode_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    user = svc.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return user


@router.post("/auth/register", response_model=UserResponse, status_code=201)
def register(data: UserCreate, db: Session = Depends(get_db)):
    if svc.get_user_by_email(db, data.email):
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    return svc.create_user(db, data)


@router.post("/auth/login", response_model=Token)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = svc.authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
    return Token(access_token=svc.create_access_token(user.email))


@router.get("/auth/me", response_model=UserResponse)
def get_me(current_user=Depends(get_current_user)):
    return current_user
