"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type PopulerUrun = {
  kategori: string;
  seri: string;
  varyant: string;
  sayi: number;
};

type BayiKullanim = {
  bayi_adi: string;
  sayi: number;
};

type AdminOzet = {
  toplam_bayi: number;
  toplam_kayit: number;
  en_populer_urunler: PopulerUrun[];
  bayi_bazli_kullanim: BayiKullanim[];
};

const kategoriEtiket: Record<string, string> = {
  wall: "Duvar Karosu",
  floor: "Zemin Karosu",
  klozet: "Vitrifiye — Klozet",
  lavabo: "Vitrifiye — Lavabo",
};

export default function AdminSayfasi() {
  const router = useRouter();
  const [ozet, setOzet] = useState<AdminOzet | null>(null);
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/giris");
      return;
    }

    fetch("http://127.0.0.1:8000/admin/ozet", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 403) {
          throw new Error("Bu sayfayı görüntülemek için admin yetkisi gerekiyor.");
        }
        if (!res.ok) {
          throw new Error("Veriler alınamadı.");
        }
        return res.json();
      })
      .then((veri: AdminOzet) => {
        setOzet(veri);
        setYukleniyor(false);
      })
      .catch((err) => {
        setHata(err.message);
        setYukleniyor(false);
      });
  }, [router]);

  if (yukleniyor) {
    return (
      <main className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <p className="text-neutral-400">Yükleniyor...</p>
      </main>
    );
  }

  if (hata) {
    return (
      <main className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{hata}</p>
        <a href="/" className="text-teal-400 hover:underline text-sm">
          Ana sayfaya dön
        </a>
      </main>
    );
  }

  if (!ozet) return null;

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Admin Paneli</h1>
        <a href="/" className="text-sm text-teal-400 hover:underline">
          ← Ana sayfaya dön
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 max-w-xl">
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Toplam Bayi</p>
          <p className="text-3xl font-bold mt-1">{ozet.toplam_bayi}</p>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Toplam İnceleme Kaydı</p>
          <p className="text-3xl font-bold mt-1">{ozet.toplam_kayit}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-4xl">
        <div>
          <h2 className="text-lg mb-3">En Çok İncelenen Ürünler</h2>
          <div className="rounded-lg border border-neutral-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-800 text-neutral-300">
                  <th className="text-left px-4 py-2 font-medium">Ürün</th>
                  <th className="text-right px-4 py-2 font-medium">İnceleme</th>
                </tr>
              </thead>
              <tbody>
                {ozet.en_populer_urunler.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-3 text-neutral-500 text-center">
                      Henüz veri yok
                    </td>
                  </tr>
                )}
                {ozet.en_populer_urunler.map((urun, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-neutral-900" : "bg-neutral-800/50"}>
                    <td className="px-4 py-2">
                      <span className="text-neutral-500">
                        {kategoriEtiket[urun.kategori] ?? urun.kategori} — {urun.seri}
                      </span>
                      <br />
                      {urun.varyant}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">{urun.sayi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-lg mb-3">Bayi Bazlı Kullanım</h2>
          <div className="rounded-lg border border-neutral-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-800 text-neutral-300">
                  <th className="text-left px-4 py-2 font-medium">Bayi</th>
                  <th className="text-right px-4 py-2 font-medium">İnceleme</th>
                </tr>
              </thead>
              <tbody>
                {ozet.bayi_bazli_kullanim.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-3 text-neutral-500 text-center">
                      Henüz veri yok
                    </td>
                  </tr>
                )}
                {ozet.bayi_bazli_kullanim.map((bayi, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-neutral-900" : "bg-neutral-800/50"}>
                    <td className="px-4 py-2">{bayi.bayi_adi}</td>
                    <td className="px-4 py-2 text-right font-medium">{bayi.sayi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}