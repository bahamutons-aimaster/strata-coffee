# Strata Coffee — Website

Cafe website dengan estetika **brutalist asphalt** untuk Strata Coffee (Bandungan, Semarang — 720m altitude).

Teknologi: Next.js 15 · React 19 · React Three Fiber · TypeScript.

## Fitur utama

- **Multi-page**: Home, Menu, About, Contact, Gift Card
- **3D coffee cup** (R3F) yang bisa di-rotate user, dengan lapisan minuman dari custom shader
- **Scroll storytelling** — background bertransisi dari pagi (kabut) → siang → senja → malam saat scroll
- **Custom cursor** + **ripple effect** kuning di setiap klik
- **Asphalt texture** sebagai signature visual (tekstur jalan beraspal di hero, footer, kartu)
- 4 minuman asli (Cookies & Cream, Matcha Latte, Es Kopi Susu, Thai Tea) + 8 placeholder
- Marquee ticker, road-marking divider, scroll progress indicator
- Smooth scroll (Lenis), respects `prefers-reduced-motion`
- Fully responsive

## Cara menjalankan

Pastikan **Node.js 18.18+** atau **20+** sudah terpasang. Cek dengan `node -v`.

```bash
# 1. Install dependencies
npm install

# 2. Jalankan dev server
npm run dev
```

Lalu buka `http://localhost:3000` di browser.

> **Catatan**: file `.npmrc` di repo ini sudah berisi `legacy-peer-deps=true` untuk menghindari peer-dependency warnings antara React 19 dan beberapa package R3F. Itu normal dan aman.

## Struktur project

```
strata-coffee/
├── public/
│   └── assets/
│       ├── photos/          # 5 foto cafe asli
│       └── products/        # 4 foto produk Strata
├── src/
│   ├── app/                 # App Router pages
│   │   ├── page.tsx         # Home
│   │   ├── menu/
│   │   ├── about/
│   │   ├── contact/
│   │   └── gift-card/
│   ├── components/          # UI components
│   │   ├── Hero.tsx
│   │   ├── Cup3D.tsx        # ← Komponen 3D utama
│   │   ├── ScrollStory.tsx  # ← Scroll storytelling
│   │   ├── FeaturedDrinks.tsx
│   │   ├── Marquee.tsx
│   │   ├── Nav.tsx / Footer.tsx
│   │   ├── Cursor.tsx       # Custom cursor
│   │   ├── RippleHost.tsx   # Ripple effect on click
│   │   └── ScrollProgress.tsx
│   ├── lib/
│   │   └── drinks.ts        # Data 12 menu (4 asli + 8 placeholder)
│   └── styles/
│       └── globals.css      # Design tokens + asphalt texture
└── package.json
```

## Mengedit konten

- **Menu**: edit array `drinks` di `src/lib/drinks.ts` (id, nama, deskripsi, harga IDR, colors untuk preview 3D, image)
- **Cerita scroll (4 chapter)**: edit array `chapters` di `src/components/ScrollStory.tsx`
- **Hero (judul, deskripsi, CTA)**: edit `src/components/Hero.tsx`
- **Footer (alamat, jam, sosmed)**: edit `src/components/Footer.tsx`
- **Form Contact & Gift Card**: keduanya submit ke WhatsApp dengan pesan ter-prefill. Ganti nomor WA di `src/app/contact/page.tsx` dan `src/app/gift-card/page.tsx` (cari `6281234567890`)

## Customisasi visual

Semua **design tokens** ada di `src/styles/globals.css` (palette asphalt, warna marking kuning, font, dst). Ganti satu variable di sini akan terlihat di seluruh situs.

```css
:root {
  --asphalt-0: #0a0a0b;
  --asphalt-1: #18181b;
  --asphalt-2: #2a2a2d;
  --marking:   #f5b915;  /* aksen kuning road-marking */
  /* ... */
}
```

## Build untuk production

```bash
npm run build
npm start
```

## Troubleshooting

- **"Cannot find module 'next'"** saat `npm run dev` — belum jalankan `npm install`.
- **3D cup tidak muncul / page jadi blank** — buka DevTools, cek apakah ada WebGL error. R3F butuh browser yang support WebGL (semua browser modern). Jika di mobile lama gagal, render placeholder image.
- **Warning peer dependency saat install** — sudah di-handle via `.npmrc`. Kalau masih muncul, jalankan `npm install --legacy-peer-deps` secara eksplisit.
- **Font tidak load** — project pakai `next/font/google` (Bebas Neue, Inter, JetBrains Mono). Pertama kali jalan, Next akan download font dan cache. Pastikan ada koneksi internet saat pertama `npm run dev`.

## Lisensi & kredit

Aset foto dan produk milik Strata Coffee. Kode boleh di-modify untuk kebutuhan internal Strata.

## Halaman Admin

Akses panel admin di `http://localhost:3000/admin`.

Password default: **strata2026**

Untuk ganti password, buat file `.env.local` di root project:
```
ADMIN_TOKEN=password_baru_kamu
```

Panel admin bisa mengedit:
- **Hero Slides** — gambar, judul, subjudul, harga produk, link CTA per slide
- **Scroll Story** — 4 chapter cerita (teks, foto, warna tint overlay)
- **Menu & Drinks** — nama, harga, deskripsi, foto, kategori, warna swatch
- **Info Cafe** — alamat, jam buka, WhatsApp, Instagram, TikTok, koordinat

Semua perubahan disimpan di `src/data/site-content.json` dan langsung terlihat setelah refresh halaman.
