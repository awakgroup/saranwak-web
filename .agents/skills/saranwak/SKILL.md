---
name: saranwak
description: >-
  Comprehensive development guide, runbook, and procedures for Saranwak (Next.js static export + Cloudflare Pages Functions + Cloudflare D1 SQLite database). Use this skill when developing new features, running local builds and emulators, managing D1 migrations, modifying Pages Functions API endpoints, testing CMS admin flows, or designing distinctive frontend interfaces with Tailwind CSS v4.
---

# Saranwak Development & Operational Runbook

This skill provides step-by-step procedures for building, maintaining, and deploying the **Saranwak** local coffee shop guide platform.

---

## 1. Local Development & Emulator Workflow

Saranwak uses a hybrid architecture: Next.js compiles to static assets (`output: "export"`), and backend APIs are powered by Cloudflare Pages Functions (`functions/api/`).

### Standard Local Run Procedure

Always build the static frontend before running the Cloudflare Pages emulator:

```bash
# Step 1: Install dependencies
npm install

# Step 2: Build static output (exports to out/)
npm run build

# Step 3: Run Cloudflare Pages Functions & static server emulator
npx wrangler pages dev out
```

The emulator binds local or remote D1 based on `wrangler.toml` and serves:
- **Public Website**: `http://localhost:8788`
- **Places Directory**: `http://localhost:8788/places`
- **CMS Admin**: `http://localhost:8788/admin/login`
- **Public API**: `http://localhost:8788/api/places`

### Verification Steps
```bash
# Test public API response and headers
curl -s -D - -o /dev/null http://localhost:8788/api/places

# Check response payload size (should remain compact, < 100KB)
curl -s http://localhost:8788/api/places | wc -c

# Verify admin endpoints reject unauthenticated access (must return 401)
curl -s -D - -o /dev/null http://localhost:8788/api/admin/places
```

---

## 2. Cloudflare D1 Database Operations

Cloudflare D1 (`saranwak-db`) stores places, categories, tags, and galleries. The binding name in `wrangler.toml` is `DB`.

### Running Queries on D1

Execute SQL statements against the remote database:

```bash
# Count active places
npx wrangler d1 execute saranwak-db --remote --command="SELECT COUNT(*) AS total FROM places WHERE is_active = 1;"

# Check categories list
npx wrangler d1 execute saranwak-db --remote --command="SELECT id, name, slug FROM categories;"

# Check available tags
npx wrangler d1 execute saranwak-db --remote --command="SELECT type, COUNT(*) AS count FROM tags GROUP BY type;"
```

### Running Migrations

Schema migrations are located in `migrations/`:
- `migrations/0003_seed_tags.sql`: Tag seeds
- `migrations/0004_indexes.sql`: Performance indexes

To apply a migration:
```bash
npx wrangler d1 execute saranwak-db --remote --file=./migrations/0004_indexes.sql
```

### Database Backup & Export

Always export a snapshot of D1 before executing major schema modifications:

```bash
mkdir -p backup
npx wrangler d1 export saranwak-db --remote --output=backup/saranwak-db-$(date +%Y%m%d).sql
```

> **Caution**: Never commit files in `backup/` to Git.

---

## 3. Developing Cloudflare Pages Functions (`functions/api/`)

All server-side code lives in `functions/api/`. Do **not** place server API routes in `app/api/` (Next.js is configured for static export).

### Function Structure & D1 Binding

Define Pages Functions using `PagesFunction<{ DB: D1Database }>`:

```ts
type Env = {
  DB: D1Database;
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.DB;
  
  // Always use prepared statements with parameterized inputs
  const result = await db
    .prepare("SELECT * FROM places WHERE is_active = 1 LIMIT ?")
    .bind(50)
    .all();

  return Response.json({
    success: true,
    data: result.results ?? [],
  }, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
    },
  });
};
```

### Caching Rules Checklist

1. **Public Read Endpoints** (`/api/places`, `/api/places/[slug]`):
   - **MUST** include cache headers:
     `"Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400"`
   - Provide an `onRequestHead` handler returning headers only for fast cache probing.
2. **Admin CMS Endpoints** (`/api/admin/*`):
   - **MUST** return `"Cache-Control": "no-store"`.
   - **MUST** authenticate requests via the session cookie:
     `context.request.headers.get("Cookie")?.includes("saranwak_admin_session=active")`.

---

## 4. Frontend & Next.js Static Export Guidelines

### Dynamic Route Pages (`app/places/[slug]/page.tsx`)

Because `next.config.ts` has `output: "export"`, any dynamic route file **must** implement `generateStaticParams()`:

```ts
export async function generateStaticParams() {
  const slugs = await getStaticPlaceSlugs();
  return slugs.map((slug) => ({ slug }));
}

// In Next.js 15+, params is a Promise
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);
  // ...
}
```

### Middleware Restriction in Static Export

Next.js static export does **not** support Next.js middleware (`middleware.ts` or `proxy.ts`). Attempting to use them causes:
`⨯ Middleware cannot be used with "output: export"`.

Instead, route-level protection (e.g. redirecting unauthenticated users away from `/admin`) is handled natively by Cloudflare Pages Edge Workers via [`functions/admin/_middleware.ts`](functions/admin/_middleware.ts) and client-side 401 handling.

### Safe Image URL Handling

Places images often come from Google Drive or Google Photos. Always use the normalization utilities in `lib/image-url.ts`:

```ts
import { getSafePlaceImageUrl, getAbsoluteImageUrl } from "@/lib/image-url";

// Generates an optimized, direct thumbnail URL for Google Drive files
const safeUrl = getSafePlaceImageUrl(place.image_url);
```

---

## 5. Distinctive Frontend Design & Aesthetics (Anti-AI Slop Guidelines)

When designing web components, pages, artifacts, or applications, implement real working code with exceptional attention to aesthetic details and creative choices to avoid generic "AI slop" aesthetics.

### Design Thinking

Before coding, understand the context and commit to a **BOLD** aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an intentional direction: warm editorial, brutally minimal, retro-futuristic, organic/earthy, luxury/refined, playful/toy-like, editorial/magazine, industrial/utilitarian, etc.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this **UNFORGETTABLE**? What's the one thing someone will remember?

> [!IMPORTANT]
> Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

### Aesthetics Guidelines

- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.
- **Color & Theme**: Commit to a cohesive aesthetic. Saranwak's core palette uses warm paper and espresso tones:
  - Canvas / Background: `bg-[#F4F1EA]`
  - Card Surfaces: `bg-[#FFFDF8]` with border `border-[#E7D8C8]`
  - Headings & Body Text: `text-[#201813]` or `text-[#141414]`
  - Muted Labels & Hints: `text-[#756A60]` or `text-[#8C827A]`
  - Accent / Warm tones: Warm caramel/terracotta
- **Motion**: Use animations for effects and micro-interactions. Focus on high-impact moments: one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects, subtle paper textures, and tactile borders that match the overall aesthetic.

### Aesthetic Anti-Patterns to Avoid
- **NEVER** use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts).
- **NEVER** use cliched color schemes (particularly purple gradients on white backgrounds).
- **NEVER** use predictable layouts and repetitive component patterns.

---

## 6. Tailwind CSS v4 Design System & Token Conventions

Saranwak uses Tailwind CSS v4 (`@tailwindcss/postcss`). Follow the CSS-first configuration patterns:

### Key Tailwind v4 Principles

| v3 Pattern                            | v4 Pattern                                                            |
| ------------------------------------- | --------------------------------------------------------------------- |
| `tailwind.config.ts`                  | `@theme` in CSS (`app/globals.css`)                                   |
| `@tailwind base/components/utilities` | `@import "tailwindcss"`                                               |
| `darkMode: "class"`                   | `@custom-variant dark (&:where(.dark, .dark *))`                      |
| `theme.extend.colors`                 | `@theme { --color-*: value }`                                         |
| `require("tailwindcss-animate")`      | CSS `@keyframes` in `@theme` + `@starting-style` for entry animations |

### React 19 Component Pattern (No forwardRef)

In React 19, `ref` is a regular prop. Avoid legacy `React.forwardRef`:

```typescript
export function Card({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-[#E7D8C8] bg-[#FFFDF8] p-6 text-[#201813] shadow-xs",
        className
      )}
      {...props}
    />
  );
}
```

### Utility Helper

Always merge conditional classes using `cn()`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 7. Data Management (ETL Scripts)

Scripts in `scripts/` handle synchronization between CSV datasets and JSON/D1:

```bash
# Convert CSV imports to places JSON
npm run import:places
# Equivalent: node scripts/csv-to-places-json.mjs

# Export places JSON to CSV
npm run export:places
# Equivalent: node scripts/places-json-to-csv.mjs

# Generate SQL seed file for tags and place_tags
node scripts/generate-tags-seed.mjs
```

---

## 8. Pre-Commit & Pre-Deployment Checklist

Before committing changes or pushing to production:

1. **Linting Check**:
   ```bash
   npm run lint
   ```
2. **Build Verification**:
   ```bash
   npm run build
   ```
   Ensure the build completes without errors, and `out/` is generated with `out/places/` static pages.
3. **E2E Testing**:
   ```bash
   npx playwright test
   ```
4. **Git Status Review**:
   Ensure no `.env`, `.env.local`, `.wrangler/`, or `backup/` files are staged.
