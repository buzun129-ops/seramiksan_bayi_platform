"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GirisSayfasi() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  const girisYap = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata("");
    setYukleniyor(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sifre }),
      });

      if (!res.ok) {
        const veri = await res.json();
        throw new Error(veri.detail || "Giriş başarısız oldu.");
      }

      const veri = await res.json();
      // Token'ı tarayıcıda saklıyoruz (bir sonraki istekte kullanmak için)
      localStorage.setItem("access_token", veri.access_token);

      // Giriş başarılı, ana sayfaya yönlendir
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setHata(err.message);
      } else {
        setHata("Beklenmeyen bir hata oluştu.");
      }
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2 text-center">Bayi Girişi</h1>
        <p className="text-neutral-400 text-sm mb-6 text-center">
          Seramiksan Bayi Ürün Deneme Platformu
        </p>

        <form
          onSubmit={girisYap}
          className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm text-neutral-400 mb-1">E-posta</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="ornek@bayi.com"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1">Şifre</label>
            <input
              type="password"
              required
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="••••••••"
            />
          </div>

          {hata && (
            <p className="text-red-400 text-sm bg-red-950/40 border border-red-800 rounded-lg px-3 py-2">
              {hata}
            </p>
          )}

          <button
            type="submit"
            disabled={yukleniyor}
            className="mt-2 bg-teal-600 hover:bg-teal-500 disabled:bg-neutral-700 disabled:cursor-not-allowed transition text-white font-medium py-2 rounded-lg"
          >
            {yukleniyor ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </main>
  );
}