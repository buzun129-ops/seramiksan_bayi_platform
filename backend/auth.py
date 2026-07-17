import os
import bcrypt
from datetime import datetime, timedelta
from jose import jwt
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # Token 1 gün geçerli

def sifre_hashle(sifre: str) -> str:
    sifre_bytes = sifre.encode("utf-8")
    hashli = bcrypt.hashpw(sifre_bytes, bcrypt.gensalt())
    return hashli.decode("utf-8")

def sifre_dogrula(duz_sifre: str, hashli_sifre: str) -> bool:
    return bcrypt.checkpw(duz_sifre.encode("utf-8"), hashli_sifre.encode("utf-8"))

def token_olustur(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)