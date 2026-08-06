# Seramiksan Bayi Ürün Deneme Platformu

Seramiksan'ın bayilerinin, duvar karosu, zemin karosu, klozet ve lavabo ürünlerini hazır banyo sahneleri (Modern, Klasik, Minimal) üzerinde karşılaştırmalı olarak inceleyebildiği; Seramiksan yönetiminin de bu incelemeleri bir admin panelinden takip edebildiği bir bayi platformu.

**Staj Projesi** — Marka Yönetimi ve Pazarlama Stajı, Seramiksan (Temmuz–Ağustos 2026)
Kırşehir Ahi Evran Üniversitesi — Web Tasarımı ve Kodlama

---

## Özellikler

- 🛁 **Banyo Sahnesi Galerisi** — Modern, Klasik ve Minimal kategorilerde gerçek banyo fotoğrafları
- 🧱 **Ürün Kataloğu** — Duvar Karosu, Zemin Karosu, Vitrifiye (Klozet/Lavabo) kategorilerinde 94 gerçek Seramiksan ürün fotoğrafı, üç seviyeli (Kategori → Seri → Varyant) gezinme
- 🔐 **Bayi Girişi** — JWT tabanlı, güvenli (bcrypt ile hash'lenmiş şifreler) kimlik doğrulama
- 📊 **Kullanım Kayıtları** — Hangi bayinin hangi ürünü ne zaman incelediğinin arka planda kaydedilmesi
- 📈 **Admin Paneli** — Toplam bayi/inceleme sayıları, en çok incelenen ürünler ve bayi bazlı kullanım özeti

## Kullanılan Teknolojiler

| Katman | Teknoloji |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | FastAPI (Python) |
| Veritabanı | MongoDB (Motor ile asenkron bağlantı) |
| Kimlik Doğrulama | JWT (python-jose) + bcrypt |

## Proje Yapısı

```
seramiksan_bayi_platform/
├── frontend/          # Next.js uygulaması
│   ├── app/
│   │   ├── page.tsx       # Ana sayfa (ürün kataloğu)
│   │   ├── giris/          # Bayi giriş ekranı
│   │   └── admin/          # Admin paneli
│   └── public/
│       ├── rooms/          # Banyo sahnesi fotoğrafları
│       └── tiles/           # Ürün fotoğrafları
└── backend/            # FastAPI uygulaması
    ├── main.py            # API uç noktaları
    ├── models.py           # Pydantic veri modelleri
    ├── auth.py              # Şifre hash'leme ve JWT işlemleri
    └── database.py         # MongoDB bağlantısı
```

## Kurulum

### Ön Gereksinimler

- Node.js (v18+)
- Python 3.11+
- MongoDB (yerel kurulum veya MongoDB Atlas)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install fastapi uvicorn motor "python-jose[cryptography]" bcrypt python-multipart python-dotenv "pydantic[email]"
```

`backend/.env` dosyası oluştur:

```
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=seramiksan_db
JWT_SECRET_KEY=<rastgele-üretilmiş-gizli-anahtar>
JWT_ALGORITHM=HS256
```

Sunucuyu başlat:

```bash
uvicorn main:app --reload
```

API dokümantasyonu: `http://127.0.0.1:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Uygulama: `http://localhost:3000`

## API Uç Noktaları

| Metod | Yol | Açıklama |
|---|---|---|
| `POST` | `/register` | Yeni bayi kaydı |
| `POST` | `/login` | Giriş, JWT token döner |
| `GET` | `/me` | Giriş yapmış bayinin bilgisi (korumalı) |
| `POST` | `/kullanim-kaydi` | Ürün incelemesi kaydı (korumalı) |
| `GET` | `/admin/ozet` | Admin özet istatistikleri (yalnızca admin rolü) |

## Notlar

- Ürün seri/renk isimleri seramiksan.com.tr adresindeki gerçek kataloğa dayanmaktadır.
- Bu proje bir **prototip (MVP)** olarak geliştirilmiştir; üretim ortamına geçiş için ölçeklenebilirlik ve ileri güvenlik önlemleri (örn. HTTPS, ortam bazlı gizli anahtar yönetimi) ek olarak ele alınmalıdır.
