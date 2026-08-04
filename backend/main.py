import os
from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt, JWTError
from database import database, bayiler_collection, kullanim_kayitlari_collection
from models import BayiCreate, BayiLogin, BayiOut, KullanimKaydiCreate
from auth import sifre_hashle, sifre_dogrula, token_olustur, SECRET_KEY, ALGORITHM

app = FastAPI(title="Seramiksan Bayi Platformu API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bearer_scheme = HTTPBearer()

async def su_anki_bayiyi_getir(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentials.credentials
    hata = HTTPException(status_code=401, detail="Geçersiz veya süresi dolmuş token.")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise hata
    except JWTError:
        raise hata

    bayi = await bayiler_collection.find_one({"email": email})
    if bayi is None:
        raise hata
    return bayi

@app.get("/")
def read_root():
    return {"mesaj": "Seramiksan Bayi Platformu API çalışıyor"}

@app.get("/veritabani-testi")
async def veritabani_testi():
    try:
        await database.command("ping")
        return {"durum": "başarılı", "mesaj": "MongoDB bağlantısı çalışıyor"}
    except Exception as e:
        return {"durum": "hata", "mesaj": str(e)}

@app.post("/register", response_model=BayiOut)
async def register(bayi: BayiCreate):
    mevcut = await bayiler_collection.find_one({"email": bayi.email})
    if mevcut:
        raise HTTPException(status_code=400, detail="Bu e-posta ile kayıtlı bir bayi zaten var.")

    yeni_bayi = {
        "email": bayi.email,
        "sifre_hash": sifre_hashle(bayi.sifre),
        "bayi_adi": bayi.bayi_adi,
        "sehir": bayi.sehir,
        "rol": "bayi",
    }
    await bayiler_collection.insert_one(yeni_bayi)
    return BayiOut(email=bayi.email, bayi_adi=bayi.bayi_adi, sehir=bayi.sehir, rol="bayi")

@app.post("/login")
async def login(bilgiler: BayiLogin):
    bayi = await bayiler_collection.find_one({"email": bilgiler.email})
    if not bayi or not sifre_dogrula(bilgiler.sifre, bayi["sifre_hash"]):
        raise HTTPException(status_code=401, detail="E-posta veya şifre hatalı.")

    token = token_olustur({"sub": bayi["email"], "rol": bayi["rol"]})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/me", response_model=BayiOut)
async def me(su_anki_bayi: dict = Depends(su_anki_bayiyi_getir)):
    return BayiOut(
        email=su_anki_bayi["email"],
        bayi_adi=su_anki_bayi["bayi_adi"],
        sehir=su_anki_bayi.get("sehir"),
        rol=su_anki_bayi["rol"],
    )

@app.post("/kullanim-kaydi")
async def kullanim_kaydi_ekle(
    kayit: KullanimKaydiCreate,
    su_anki_bayi: dict = Depends(su_anki_bayiyi_getir),
):
    yeni_kayit = {
        "bayi_email": su_anki_bayi["email"],
        "bayi_adi": su_anki_bayi["bayi_adi"],
        "kategori": kayit.kategori,
        "seri": kayit.seri,
        "varyant": kayit.varyant,
        "tarih": datetime.utcnow(),
    }
    await kullanim_kayitlari_collection.insert_one(yeni_kayit)
    return {"durum": "kaydedildi"}