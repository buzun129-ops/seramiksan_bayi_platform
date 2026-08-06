"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

type PopulerUrun = {
  kategori: string;
  seri: string;
  varyant: string;
  sayi: number;
};

type BayiKullanim = {
  bayi_adi: string;
  sayi: number;
  yuzde: number;
};

type HaftalikKullanim = {
  tarih: string;
  sayi: number;
};

type AdminOzet = {
  toplam_bayi: number;
  toplam_kayit: number;
  aktif_bayi_orani: number;
  ortalama_urun_goruntuleme: number;
  haftalik_kullanim: HaftalikKullanim[];
  en_populer_urunler: PopulerUrun[];
  bayi_bazli_kullanim: BayiKullanim[];
};

const kategoriEtiket: Record<string, string> = {
  wall: "Duvar Karosu",
  floor: "Zemin Karosu",
  klozet: "Vitrifiye — Klozet",
  lavabo: "Vitrifiye — Lavabo",
};

const DILIM_RENKLERI = [
  "#14b8a6", "#6366f1", "#f59e0b", "#ef4444",
  "#3b82f6", "#a855f7", "#22c55e", "#ec4899",
  "#eab308", "#06b6d4",
];

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

  const pastaVerisi = ozet.bayi_bazli_kullanim.map((bayi) => ({
    name: bayi.bayi_adi,
    value: bayi.sayi,
    yuzde: bayi.yuzde,
  }));

  const ozelEtiket = (props: { name?: string; yuzde?: number }) =>
    `${props.name} %${props.yuzde}`;

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Admin Paneli</h1>
        <a href="/" className="text-sm text-teal-400 hover:underline">
          ← Ana sayfaya dön
        </a>
      </div>

      {/* KPI kartları — 4 gösterge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-5xl">
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Toplam Bayi</p>
          <p className="text-3xl font-bold mt-1">{ozet.toplam_bayi}</p>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Toplam İnceleme Kaydı</p>
          <p className="text-3xl font-bold mt-1">{ozet.toplam_kayit}</p>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Aktif Bayi Oranı</p>
          <p className="text-3xl font-bold mt-1">%{ozet.aktif_bayi_orani}</p>
        </div>
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
          <p className="text-sm text-neutral-400">Ortalama Ürün Görüntüleme</p>
          <p className="text-3xl font-bold mt-1">{ozet.ortalama_urun_goruntuleme}</p>
        </div>
      </div>

      {/* Haftalık Kullanım Grafiği */}
      <div className="mb-8 max-w-7xl">
        <h2 className="text-lg mb-3">Haftalık Kullanım (Son 7 Gün)</h2>
        <div className="rounded-lg border border-neutral-700 p-4 h-64">
          {ozet.haftalik_kullanim.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ozet.haftalik_kullanim}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="tarih" stroke="#a3a3a3" fontSize={12} />
                <YAxis stroke="#a3a3a3" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#262626", border: "1px solid #404040", borderRadius: 8 }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="sayi" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-neutral-500 text-sm">
              Son 7 günde kayıt yok
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl">
        <div>
          <h2 className="text-lg mb-3">En Çok İncelenen Ürünler</h2>
          <div className="rounded-lg border border-neutral-700 overflow-hidden overflow-x-auto">
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
          <div className="rounded-lg border border-neutral-700 overflow-hidden overflow-x-auto">
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
                    <td className="px-4 py-2 flex items-center gap-2">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: DILIM_RENKLERI[i % DILIM_RENKLERI.length] }}
                      />
                      {bayi.bayi_adi}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {bayi.sayi} <span className="text-neutral-500">(%{bayi.yuzde})</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-lg mb-3">Bayi Kullanım Oranı</h2>
          <div className="rounded-lg border border-neutral-700 p-2 h-72">
            {pastaVerisi.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
                  <Pie
                    data={pastaVerisi}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    label={ozelEtiket}
                    labelLine
                  >
                    {pastaVerisi.map((_, i) => (
                      <Cell key={i} fill={DILIM_RENKLERI[i % DILIM_RENKLERI.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#262626", border: "1px solid #404040", borderRadius: 8 }}
                    labelStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-500 text-sm">
                Henüz veri yok
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
