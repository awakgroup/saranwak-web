# Saranwak

Saranwak adalah website local spot guide untuk membantu pengguna menemukan coffee shop di Padang berdasarkan kebutuhan, aktivitas, fasilitas, vibe, dan budget.

Website ini juga dilengkapi CMS admin sederhana untuk mengelola data tempat langsung ke Cloudflare D1 Database.

## Main Features

* Explore coffee shop di Padang
* Search dan filter berdasarkan aktivitas, fasilitas, vibe, dan budget
* Detail page setiap tempat
* Featured places
* Recommendation page
* Admin CMS untuk tambah, edit, publish/unpublish, dan update data tempat
* Data public dibaca dari Cloudflare D1 melalui Cloudflare Pages Functions
* Public API menggunakan cache header agar lebih hemat request database
* Admin API menggunakan `no-store` agar data CMS selalu fresh

## Tech Stack

* Next.js
* TypeScript
* Tailwind CSS
* Cloudflare Pages
* Cloudflare Pages Functions
* Cloudflare D1 Database
* Wrangler

## Project Structure

```bash
app/
  admin/
  places/
  rekomendasi/
  about/
components/
  admin/
  home/
functions/
  api/
    places.ts
    places/[slug].ts
    admin/
      places.ts
      login.ts
      logout.ts
lib/
  api/
  admin-utils.ts
migrations/
imports/
public/
```

## Environment Variables

Untuk production di Cloudflare Pages, tambahkan variables berikut:

```env
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-strong-admin-password
NEXT_PUBLIC_SITE_URL=https://saranwak.com
```

Untuk local development, buat file:

```bash
.env.local
```

Lalu isi:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-local-password
NEXT_PUBLIC_SITE_URL=http://localhost:8788
```

## Cloudflare D1 Binding

Di Cloudflare Pages, pastikan D1 binding sudah dibuat:

```txt
Variable name: DB
D1 database: saranwak-db
```

Kode API menggunakan:

```ts
context.env.DB
```

Jadi nama binding wajib `DB`.

## Local Development

Install dependencies:

```bash
npm install
```

Build project:

```bash
npm run build
```

Jalankan local Cloudflare Pages environment:

```bash
npx wrangler pages dev out
```

Akses website:

```txt
http://localhost:8788
```

Akses admin:

```txt
http://localhost:8788/admin/login
```

## Useful Commands

Cek public places API:

```bash
curl -s -D - -o /dev/null http://localhost:8788/api/places
```

Cek ukuran response API:

```bash
curl -s http://localhost:8788/api/places | wc -c
```

Cek admin API tanpa login:

```bash
curl -s -D - -o /dev/null http://localhost:8788/api/admin/places
```

Harus mengembalikan unauthorized jika belum login.

## D1 Database Commands

Cek isi tabel places:

```bash
npx wrangler d1 execute saranwak-db --remote --command="SELECT COUNT(*) AS total FROM places;"
```

Cek tags:

```bash
npx wrangler d1 execute saranwak-db --remote --command="SELECT COUNT(*) AS total FROM tags;"
```

Cek place_tags:

```bash
npx wrangler d1 execute saranwak-db --remote --command="SELECT COUNT(*) AS total FROM place_tags;"
```

Jalankan migration:

```bash
npx wrangler d1 execute saranwak-db --remote --file=./migrations/0004_indexes.sql
```

## Public API Behavior

Public API:

```txt
/api/places
/api/places/[slug]
```

Public API boleh di-cache untuk mengurangi beban D1.

Expected public cache header:

```txt
Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=86400
```

## Admin API Behavior

Admin API:

```txt
/api/admin/places
/api/admin/login
/api/admin/logout
```

Admin API tidak boleh di-cache.

Expected admin cache header:

```txt
Cache-Control: no-store
```

Admin endpoint wajib memakai cookie session:

```txt
saranwak_admin_session=active
```

## Deployment

Deploy dilakukan melalui Cloudflare Pages dari branch utama.

Flow umum:

```bash
npm run build
git add .
git commit -m "your commit message"
git push
```

Setelah deploy selesai, test:

```txt
https://saranwak.com
https://saranwak.com/places
https://saranwak.com/api/places
https://saranwak.com/admin/login
```

## Backup D1 Database

Lakukan backup berkala:

```bash
npx wrangler d1 export saranwak-db --remote --output=backup/saranwak-db.sql
```

Folder backup sebaiknya tidak masuk Git.

Pastikan `.gitignore` memiliki:

```gitignore
.wrangler/
backup/
.env
.env.local
node_modules/
.next/
out/
*.log
.DS_Store
```

## Notes

* Jangan commit folder `.wrangler/` karena itu file temporary dari Wrangler.
* Jangan commit `.env` atau `.env.local`.
* Public data sebaiknya tetap ringan agar tidak membebani database.
* Admin API harus tetap `no-store`.
* Custom analytics jangan langsung menulis semua event ke D1. Gunakan aggregated analytics atau Cloudflare Web Analytics.
