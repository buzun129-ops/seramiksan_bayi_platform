from pydantic import BaseModel, EmailStr
from typing import Optional

class BayiCreate(BaseModel):
    email: EmailStr
    sifre: str
    bayi_adi: str
    sehir: Optional[str] = None

class BayiLogin(BaseModel):
    email: EmailStr
    sifre: str

class BayiOut(BaseModel):
    email: EmailStr
    bayi_adi: str
    sehir: Optional[str] = None
    rol: str = "bayi"

class KullanimKaydiCreate(BaseModel):
    kategori: str
    seri: str
    varyant: str