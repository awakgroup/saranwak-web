<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Saranwak — Project Guidelines & Architecture

Saranwak is a local coffee shop guide platform for Padang, West Sumatra. It enables users to discover coffee shops and spots tailored to their specific needs (work/WFC, meeting, hangout, date, vibe, facilities, and budget). The platform includes a dedicated CMS admin panel to manage places, categories, tags, galleries, and publishing state directly backed by Cloudflare D1.

---

## 1. Core Architecture & Hybrid Model

Saranwak uses a **hybrid architecture** combining Next.js static export with Cloudflare Pages Functions and Cloudflare D1:

1. **Frontend (Next.js Static Export)**:
   - Configured with `output: "export"` in `next.config.ts`.
   - Emits pure static HTML/CSS/JS artifacts to `out/`.
   - **CRITICAL**: Do NOT create dynamic server runtime routes in `app/api/`. Next.js API routes are not executed in static export mode.
   - **CRITICAL**: Do NOT create Next.js server middleware (`middleware.ts` or `proxy.ts`). Middleware is unsupported in `output: "export"`. Any edge route protection must live in Cloudflare Pages Functions (`functions/admin/_middleware.ts`).
   - Dynamic pages (e.g. `app/places/[slug]/page.tsx`) **must** export `generateStaticParams()` to pre-render static HTML.

2. **Backend & APIs (Cloudflare Pages Functions)**:
   - All backend logic lives in the `functions/api/` directory.
   - Executes on Cloudflare Edge Workers runtime with direct binding to Cloudflare D1.
   - Handles both public cached APIs (`/api/places`, `/api/places/[slug]`) and private CMS admin APIs (`/api/admin/*`).

3. **Database (Cloudflare D1)**:
   - Serverless SQLite database: `saranwak-db`.
   - Bound in Cloudflare Pages as `DB` (`context.env.DB`).
   - Tables: `places`, `categories`, `tags`, `place_tags`, `galleries`.

---

## 2. Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Icons & Motion**: Lucide React (`lucide-react`), Framer Motion (`framer-motion`)
- **Hosting & Edge Runtime**: Cloudflare Pages + Cloudflare Pages Functions
- **Database**: Cloudflare D1 (SQLite at the edge)
- **Local Dev & Deployment**: Wrangler CLI (`wrangler`)
- **Testing**: Playwright (`@playwright/test`)

---

## 3. Directory Layout & File Organization

```text
saranwak/
├── app/                      # Next.js App Router (Static Export)
│   ├── page.tsx              # Homepage (Hero, Featured, Promo, Why Saranwak)
│   ├── places/               # Places discovery and listing
│   │   ├── page.tsx          # Places client search & filter wrapper
│   │   └── [slug]/page.tsx   # Place detail page (with generateStaticParams)
│   ├── rekomendasi/page.tsx  # Curated recommendation page
│   ├── about/page.tsx        # About page
│   ├── admin/                # CMS Admin frontend
│   │   ├── page.tsx          # Admin dashboard & management panel
│   │   └── login/page.tsx    # Admin login screen
│   └── globals.css           # Global Tailwind CSS styling & variables
├── components/               # React UI Components
│   ├── home/                 # Homepage sections (Hero, Featured, Business)
│   ├── admin/                # CMS Admin panels (PlaceForm, PlaceList, Analytics)
│   ├── PlacesClientPage.tsx  # Interactive search, filter & pagination UI
│   ├── PlaceCard.tsx         # Standard place card component
│   └── GallerySlider.tsx     # Photo slider component
├── functions/api/            # Cloudflare Pages Functions (Backend)
│   ├── places.ts             # GET /api/places (Public cached list with filters)
│   ├── places/[slug].ts      # GET /api/places/:slug (Public cached detail)
│   └── admin/                # Admin CMS endpoints (Requires session cookie)
│       ├── login.ts          # POST /api/admin/login
│       ├── logout.ts         # POST /api/admin/logout
│       └── places.ts         # GET/POST/PUT/DELETE /api/admin/places
├── lib/                      # Core utility functions & shared logic
│   ├── api/places.ts         # Frontend fetch client & legacy adapters
│   ├── image-url.ts          # Google Drive / CDN image URL normalizer
│   ├── place-filters.ts      # Multi-criteria filtering helpers
│   ├── admin-utils.ts        # Admin validation & slug generation
│   └── track-event.ts        # Client-side analytics tracking helper
├── migrations/               # Cloudflare D1 SQL schema migrations
├── scripts/                  # Data import/export ETL scripts (CSV <-> JSON)
├── types/                    # TypeScript interfaces
│   ├── database.ts           # Schema models (Place, Category, Tag)
│   ├── admin.ts              # CMS payload types
│   └── cloudflare.d.ts       # Cloudflare Workers/Pages environment types
├── public/                   # Static assets & placeholders
└── wrangler.toml             # Cloudflare Pages & D1 binding configuration
```

---

## 4. Development & Operation Workflows

### Setup & Local Development

Because the site uses Cloudflare Pages Functions and D1 bindings, test dynamic features with Wrangler:

```bash
# 1. Install dependencies
npm install

# 2. Build the Next.js static output
npm run build

# 3. Run Cloudflare Pages local development (serves static files + functions)
npx wrangler pages dev out
# Access site at: http://localhost:8788
# Access admin at: http://localhost:8788/admin/login
```

For fast UI/style development on pure pages without functions:
```bash
npm run dev
# Note: Functions in functions/api are not served by "next dev" alone.
```

### Cloudflare D1 Database Commands

Always manage the production/remote D1 database using Wrangler:

```bash
# Check places table count
npx wrangler d1 execute saranwak-db --remote --command="SELECT COUNT(*) AS total FROM places;"

# Run a migration file
npx wrangler d1 execute saranwak-db --remote --file=./migrations/0004_indexes.sql

# Export / Backup database to SQL file
npx wrangler d1 export saranwak-db --remote --output=backup/saranwak-db.sql
```

---

## 5. Coding Standards & Conventions

### Next.js & App Router Guidelines

1. **Async Page Params**:
   In Next.js 15+, `params` and `searchParams` in server components and `generateMetadata` are `Promise` types. Always await them:
   ```ts
   export default async function PlaceDetailPage({
     params,
   }: {
     params: Promise<{ slug: string }>;
   }) {
     const { slug } = await params;
     // ...
   }
   ```

2. **Static Export Compatibility**:
   - Any dynamic route (`[slug]`) **must** declare `generateStaticParams()`.
   - Never use Node.js server runtimes in `app/`.
   - Images are rendered with `unoptimized: true` (configured globally in `next.config.ts`).
   - Image URLs from Google Drive or Google User Content must be processed through `getSafePlaceImageUrl()` or `getAbsoluteImageUrl()` from `lib/image-url.ts`.

3. **Styling and Palette**:
   - Primary warm neutral aesthetic:
     - Background: `#F4F1EA` (warm paper/cream)
     - Surfaces/Cards: `#FFFDF8` or `#FFFFFF`
     - Borders: `#E7D8C8` or `#E4DDD3`
     - Dark text: `#201813` or `#141414`
     - Muted text: `#756A60` or `#8C827A`
     - Accent: Warm caramel/terracotta tones

### Cloudflare Pages Functions Guidelines

1. **D1 Binding**:
   - Access the database through `context.env.DB`.
   - Always use prepared statements with parameterized queries:
     ```ts
     const result = await context.env.DB.prepare(
       "SELECT * FROM places WHERE is_active = 1 LIMIT ?"
     ).bind(limit).all();
     ```
   - Never concatenate user strings directly into SQL statements.

2. **Caching Strategy**:
   - **Public Endpoints** (`/api/places`, `/api/places/[slug]`):
     Must return public cache headers to protect D1 read limits:
     ```ts
     "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400"
     ```
     Always provide an `onRequestHead` handler for CDN cache pinging.
   - **Admin Endpoints** (`/api/admin/*`):
     Must return `Cache-Control: no-store` to prevent caching sensitive data.
     Must validate the session cookie `saranwak_admin_session=active`.

3. **Data Compactness**:
   - Do not return excessive payloads in `/api/places` list queries. Short descriptions should be truncated (`compactText(place.short_description, 180)`), and large photo arrays should only be loaded on the individual detail endpoint (`/api/places/[slug]`).

---

## 6. Security & Hygiene Rules

- **Do NOT commit credentials**: Never check in `.env`, `.env.local`, or any file containing passwords or session tokens.
- **Do NOT commit Wrangler temporary data**: `.wrangler/` and `backup/` directories are gitignored.
- **Do NOT store analytics directly in D1**: Avoid writing every page view / click event into D1 row-by-row to prevent exhausting free-tier write quotas. Use aggregated events or Cloudflare Web Analytics.
- **Preserve Documentation & Comments**: Retain all existing code comments, adapters (e.g. `mapApiPlaceToLegacyPlace`), and type compatibility structures.
