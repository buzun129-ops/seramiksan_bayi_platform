"use client";

import { useState } from "react";

function buildRoomImages(prefix: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `/rooms/${prefix}-${i + 1}.jpg`);
}

const modernImages = [
  "/rooms/modern-banyo-clean-1.jpg",
  ...buildRoomImages("modern-banyo", 12).filter((src) => src !== "/rooms/modern-banyo-6.jpg"),
];

const roomCategories = [
  { key: "modern", title: "Modern Banyo", images: modernImages },
  { key: "klasik", title: "Klasik Banyo", images: buildRoomImages("klasik-banyo", 7) },
  { key: "minimal", title: "Minimal Banyo", images: buildRoomImages("minimal-banyo", 7) },
];

// Gerçek duvar karosu doku fotoğrafları (Angel, Crystal, Artemis)
const tileImages: Record<string, string> = {
  "Gri": "/tiles/angel-gri.jpg",
  "Açık Gri": "/tiles/angel-acik-gri.jpg",
  "Kemik": "/tiles/angel-kemik.jpg",
  "Vizon": "/tiles/angel-vizon.jpg",
  "Rölyef Açık Gri": "/tiles/angel-rolyef-acik-gri.jpg",
  "Rölyef Kemik": "/tiles/angel-rolyef-kemik.jpg",
  "Gri Sugar": "/tiles/angel-gri-sugar.jpg",
  "Açık Gri Sugar": "/tiles/angel-acik-gri-sugar.jpg",
  "Kemik Sugar": "/tiles/angel-kemik-sugar.jpg",
  "Vizon Sugar": "/tiles/angel-vizon-sugar.jpg",
  "Crystal Beyaz": "/tiles/crystal-beyaz.jpg",
  "Crystal Kemik": "/tiles/crystal-kemik.jpg",
  "Crystal Rölyef Beyaz": "/tiles/crystal-rolyef-beyaz.jpg",
  "Crystal Rölyef Kemik": "/tiles/crystal-rolyef-kemik.jpg",
  "Crystal Beyaz Sugar": "/tiles/crystal-beyaz-sugar.jpg",
  "Crystal Kemik Sugar": "/tiles/crystal-kemik-sugar.jpg",
  "Artemis Beyaz": "/tiles/artemis-beyaz.jpg",
  "Artemis Rölyef Beyaz": "/tiles/artemis-rolyef-beyaz.jpg",
  "Artemis Beyaz Sugar": "/tiles/artemis-beyaz-sugar.jpg",
  // Zemin karosu — Bali, Etna, Zeus
  "Bali Gri": "/tiles/bali-gri.jpg",
  "Bali Kemik": "/tiles/bali-kemik.jpg",
  "Bali Beyaz": "/tiles/bali-beyaz.jpg",
  "Bali Leaf Motif": "/tiles/bali-leaf-motif.jpg",
  "Bali Rölyef": "/tiles/bali-rolyef.jpg",
  "Etna Kemik Sugar": "/tiles/etna-kemik-sugar.jpg",
  "Etna Gri Sugar": "/tiles/etna-gri-sugar.jpg",
  "Etna Antrasit Sugar": "/tiles/etna-antrasit-sugar.jpg",
  "Zeus Silver": "/tiles/zeus-silver.jpg",
  "Zeus Koyu Gri": "/tiles/zeus-koyu-gri.jpg",
  "Zeus Hexagonel Koyu Gri Motif": "/tiles/zeus-hexagonel-koyu-gri-motif.jpg",
  "Zeus Hexagonel Silver Motif": "/tiles/zeus-hexagonel-silver-motif.jpg",
  "Zeus Bordür Koyu Gri Motif": "/tiles/zeus-bordur-koyu-gri-motif.jpg",
  "Zeus Bordür Silver Motif": "/tiles/zeus-bordur-silver-motif.jpg",
};

function imageFor(variant: string): string | null {
  return tileImages[variant] ?? null;
}
// Gerçek doku fotoğrafları gelene kadar renk/varyant isimlerini geçici bir renge eşliyoruz
const placeholderColors: Record<string, string> = {
  "Bali Gri": "#9CA3AF",
  "Bali Kemik": "#D8CBB4",
  "Bali Beyaz": "#F1F0EE",
  "Bali Leaf Motif": "#A9B79A",
  "Bali Rölyef": "#B7BAC0",
  "Etna Kemik Sugar": "#D8CBB4",
  "Etna Gri Sugar": "#9CA3AF",
  "Etna Antrasit Sugar": "#3F3F46",
  "Zeus Silver": "#C6C9CC",
  "Zeus Koyu Gri": "#52525B",
  "Zeus Hexagonel Koyu Gri Motif": "#52525B",
  "Zeus Hexagonel Silver Motif": "#C6C9CC",
  "Zeus Bordür Koyu Gri Motif": "#52525B",
  "Zeus Bordür Silver Motif": "#C6C9CC",
  "Gri": "#A0A0A0",
  "Açık Gri": "#BDBDBD",
  "Kemik": "#D9CFC0",
  "Vizon": "#B9A98F",
  "Rölyef Açık Gri": "#BDBDBD",
  "Rölyef Kemik": "#D9CFC0",
  "Gri Sugar": "#A0A0A0",
  "Açık Gri Sugar": "#BDBDBD",
  "Kemik Sugar": "#D9CFC0",
  "Vizon Sugar": "#B9A98F",
  "Crystal Beyaz": "#F1F0EE",
  "Crystal Kemik": "#D9CFC0",
  "Crystal Rölyef Beyaz": "#F1F0EE",
  "Crystal Rölyef Kemik": "#D9CFC0",
  "Crystal Beyaz Sugar": "#F1F0EE",
  "Crystal Kemik Sugar": "#D9CFC0",
  "Artemis Beyaz": "#F1F0EE",
  "Artemis Rölyef Beyaz": "#F1F0EE",
  "Artemis Beyaz Sugar": "#F1F0EE",
  "Terra": "#B08B6A",
  "Volcano": "#4B4B4E",
  "Saturn": "#C7C7C9",
  "Form": "#D9D9D9",
};

function colorFor(variant: string): string {
  return placeholderColors[variant] ?? "#9CA3AF";
}

type Series = { name: string; variants: string[] };
type Category = { key: string; title: string; seriesList: Series[] };

const wallTileSeries: Series[] = [
  {
    name: "Angel",
    variants: [
      "Gri", "Açık Gri", "Kemik", "Vizon",
      "Rölyef Açık Gri", "Rölyef Kemik",
      "Gri Sugar", "Açık Gri Sugar", "Kemik Sugar", "Vizon Sugar",
    ],
  },
  {
    name: "Crystal",
    variants: [
      "Crystal Beyaz", "Crystal Kemik",
      "Crystal Rölyef Beyaz", "Crystal Rölyef Kemik",
      "Crystal Beyaz Sugar", "Crystal Kemik Sugar",
    ],
  },
  { name: "Artemis", variants: ["Artemis Beyaz", "Artemis Rölyef Beyaz", "Artemis Beyaz Sugar"] },
];

const floorTileSeries: Series[] = [
  { name: "Bali", variants: ["Bali Gri", "Bali Kemik", "Bali Beyaz", "Bali Leaf Motif", "Bali Rölyef"] },
  { name: "Etna", variants: ["Etna Kemik Sugar", "Etna Gri Sugar", "Etna Antrasit Sugar"] },
  {
    name: "Zeus",
    variants: [
      "Zeus Silver", "Zeus Koyu Gri",
      "Zeus Hexagonel Koyu Gri Motif", "Zeus Hexagonel Silver Motif",
      "Zeus Bordür Koyu Gri Motif", "Zeus Bordür Silver Motif",
    ],
  },
];

const klozetSeries: Series[] = [
  {
    name: "Natura",
    variants: [
      "BTW Klozet S Trap",
      "BTW Klozet S Trap Bidet Fonksiyonlu",
      "BTW Klozet P Trap Bidet Fonksiyonlu",
      "Asma Klozet (Natura Plus)",
      "Engelli BTW Klozet Bidet Fonksiyonlu",
    ],
  },
  { name: "Terra", variants: ["Terra"] },
  { name: "Volcano", variants: ["Volcano"] },
];

const lavaboSeries: Series[] = [
  { name: "Natura", variants: ["Lavabo 50 cm", "Ayaklı Lavabo (Pedestal)", "Yarım Ayaklı Lavabo"] },
  { name: "Saturn", variants: ["Saturn"] },
  { name: "Form", variants: ["Form"] },
];

const productCategories: Category[] = [
  { key: "wall", title: "Duvar Karosu", seriesList: wallTileSeries },
  { key: "floor", title: "Zemin Karosu", seriesList: floorTileSeries },
  { key: "klozet", title: "Vitrifiye — Klozet", seriesList: klozetSeries },
  { key: "lavabo", title: "Vitrifiye — Lavabo", seriesList: lavaboSeries },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

export default function Home() {
  const [openRoomCategories, setOpenRoomCategories] = useState<Record<string, boolean>>({});
  const [selectedRoomImage, setSelectedRoomImage] = useState<string>(roomCategories[0].images[0]);
  const [selectedRoomTitle, setSelectedRoomTitle] = useState<string>(roomCategories[0].title);

  const toggleRoomCategory = (key: string) => {
    setOpenRoomCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [openSeriesByCategory, setOpenSeriesByCategory] = useState<Record<string, string | null>>({});

  const [selections, setSelections] = useState<Record<string, { series: string; variant: string }>>({
    wall: { series: wallTileSeries[0].name, variant: wallTileSeries[0].variants[0] },
    floor: { series: floorTileSeries[0].name, variant: floorTileSeries[0].variants[0] },
    klozet: { series: klozetSeries[0].name, variant: klozetSeries[0].variants[0] },
    lavabo: { series: lavaboSeries[0].name, variant: lavaboSeries[0].variants[0] },
  });

  const toggleCategory = (key: string) => {
    setOpenCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSeries = (categoryKey: string, seriesName: string) => {
    setOpenSeriesByCategory((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey] === seriesName ? null : seriesName,
    }));
  };

  const ExpandableRow = ({ label, open, onClick }: { label: string; open: boolean; onClick: () => void }) => (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition text-sm
        ${open ? "bg-teal-700/40 text-white ring-1 ring-teal-500" : "bg-neutral-700 hover:bg-neutral-600"}`}
    >
      <Chevron open={open} />
      <span>{label}</span>
    </div>
  );

  const Pill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => {
    const thumb = imageFor(label);
    return (
      <div
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition text-sm
          ${active ? "bg-teal-600 ring-2 ring-teal-300" : "bg-neutral-800 hover:bg-neutral-700"}`}
      >
        {thumb && (
          <img src={thumb} alt={label} className="w-6 h-6 object-cover rounded" />
        )}
        <span>{label}</span>
      </div>
    );
  };

  // Fotoğrafın yanında gösterilecek ürün kartı
  const ProductSwatchCard = ({
    label,
    series,
    variant,
  }: {
    label: string;
    series: string;
    variant: string;
  }) => {
    const img = imageFor(variant);
    return (
      <div className="rounded-lg border border-neutral-700 overflow-hidden bg-neutral-800">
        {img ? (
          <img src={img} alt={variant} className="w-full h-32 object-cover" />
        ) : (
          <div className="w-full h-32" style={{ backgroundColor: colorFor(variant) }} />
        )}
        <div className="p-2">
          <p className="text-[11px] text-neutral-400">{label}</p>
          <p className="text-sm font-medium leading-tight">{series}</p>
          <p className="text-xs text-neutral-400 leading-tight">{variant}</p>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Seramiksan Bayi Ürün Deneme Platformu</h1>

      <div className="flex gap-6">
        {/* SOL: Banyo sahnesi seçimi + fotoğraf + yanında ürün kartları */}
        <div className="flex-1">
          <h2 className="text-lg mb-4">Banyo Sahnesi Seç</h2>

          <div className="flex flex-col gap-2 mb-6">
            {roomCategories.map((room) => {
              const isOpen = !!openRoomCategories[room.key];
              return (
                <div key={room.key}>
                  <ExpandableRow
                    label={room.title}
                    open={isOpen}
                    onClick={() => toggleRoomCategory(room.key)}
                  />

                  {isOpen && (
                    <div className="pl-4 mt-2 mb-2 border-l-2 border-teal-700/50">
                      <div className="grid grid-cols-6 gap-2">
                        {room.images.map((src, idx) => {
                          const active = selectedRoomImage === src;
                          return (
                            <img
                              key={src}
                              src={src}
                              alt={`${room.title} ${idx + 1}`}
                              onClick={() => {
                                setSelectedRoomImage(src);
                                setSelectedRoomTitle(room.title);
                              }}
                              className={`w-full h-16 object-cover rounded cursor-pointer transition
                                ${active ? "ring-2 ring-teal-400" : "opacity-80 hover:opacity-100"}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Fotoğraf + yanında ürün kartları (yan yana) */}
          <div className="flex gap-4">
            {/* Banyo fotoğrafı */}
            <div
              className="relative flex-1 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800"
              style={{ aspectRatio: "3 / 2" }}
            >
              <img
                src={selectedRoomImage}
                alt="Seçili banyo önizlemesi"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Sağında dikey ürün kartları sütunu */}
            <div className="w-64 shrink-0 flex flex-col gap-3">
              <ProductSwatchCard
                label="Duvar Karosu"
                series={selections.wall.series}
                variant={selections.wall.variant}
              />
              <ProductSwatchCard
                label="Zemin Karosu"
                series={selections.floor.series}
                variant={selections.floor.variant}
              />
              <ProductSwatchCard
                label="Vitrifiye — Klozet"
                series={selections.klozet.series}
                variant={selections.klozet.variant}
              />
              <ProductSwatchCard
                label="Vitrifiye — Lavabo"
                series={selections.lavabo.series}
                variant={selections.lavabo.variant}
              />
            </div>
          </div>

          {/* Seçim özeti — ayrı bir tablo olarak altında */}
          <div className="w-full mt-4 rounded-lg border border-neutral-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-800 text-neutral-300">
                  <th className="text-left px-4 py-2 font-medium">Kategori</th>
                  <th className="text-left px-4 py-2 font-medium">Seri</th>
                  <th className="text-left px-4 py-2 font-medium">Seçim</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-neutral-700 bg-neutral-900">
                  <td className="px-4 py-2 text-neutral-400">Banyo Sahnesi</td>
                  <td className="px-4 py-2 text-neutral-500">—</td>
                  <td className="px-4 py-2">{selectedRoomTitle}</td>
                </tr>
                <tr className="border-t border-neutral-700 bg-neutral-800/50">
                  <td className="px-4 py-2 text-neutral-400">Duvar Karosu</td>
                  <td className="px-4 py-2 text-neutral-500">{selections.wall.series}</td>
                  <td className="px-4 py-2">{selections.wall.variant}</td>
                </tr>
                <tr className="border-t border-neutral-700 bg-neutral-900">
                  <td className="px-4 py-2 text-neutral-400">Zemin Karosu</td>
                  <td className="px-4 py-2 text-neutral-500">{selections.floor.series}</td>
                  <td className="px-4 py-2">{selections.floor.variant}</td>
                </tr>
                <tr className="border-t border-neutral-700 bg-neutral-800/50">
                  <td className="px-4 py-2 text-neutral-400">Klozet</td>
                  <td className="px-4 py-2 text-neutral-500">{selections.klozet.series}</td>
                  <td className="px-4 py-2">{selections.klozet.variant}</td>
                </tr>
                <tr className="border-t border-neutral-700 bg-neutral-900">
                  <td className="px-4 py-2 text-neutral-400">Lavabo</td>
                  <td className="px-4 py-2 text-neutral-500">{selections.lavabo.series}</td>
                  <td className="px-4 py-2">{selections.lavabo.variant}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SAĞ: Ürün kaydırıcısı */}
        <div className="w-64 shrink-0">
          <h2 className="text-lg mb-4">Ürün Kaydırıcı</h2>

          <div className="flex flex-col gap-2">
            {productCategories.map((cat) => {
              const isCatOpen = !!openCategories[cat.key];
              const openSeriesName = openSeriesByCategory[cat.key] ?? null;

              return (
                <div key={cat.key}>
                  <ExpandableRow
                    label={cat.title}
                    open={isCatOpen}
                    onClick={() => toggleCategory(cat.key)}
                  />

                  {isCatOpen && (
                    <div className="pl-4 mt-2 border-l-2 border-teal-700/50 flex flex-col gap-2">
                      {cat.seriesList.map((s) => (
                        <div key={s.name}>
                          <ExpandableRow
                            label={s.name}
                            open={openSeriesName === s.name}
                            onClick={() => toggleSeries(cat.key, s.name)}
                          />

                          {openSeriesName === s.name && (
                            <div className="pl-4 mt-2 border-l-2 border-neutral-700 flex flex-col gap-2">
                              {s.variants.map((v) => {
                                const isActive =
                                  selections[cat.key].series === s.name &&
                                  selections[cat.key].variant === v;
                                return (
                                  <Pill
                                    key={v}
                                    label={v}
                                    active={isActive}
                                    onClick={() =>
                                      setSelections((prev) => ({
                                        ...prev,
                                        [cat.key]: { series: s.name, variant: v },
                                      }))
                                    }
                                  />
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}