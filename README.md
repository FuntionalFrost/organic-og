# ⚡ OG Engine — High-Performance OpenGraph & Social Banner Generator

A modern, edge-ready dynamic OpenGraph generator rebuilt from the ground up with **SvelteKit 2**, **Svelte 5 Runes**, and **`yaxa-svelte`**.

Generates pixel-perfect social banners (1200×630) using **Satori** (HTML/CSS to SVG) and **Resvg** (Rust-based SVG to PNG rasterizer) with sub-10ms response times.

---

## 🚀 Features

- **5 Responsive Templates**:
  - `saas` — Modern gradient banner with eyebrow badge, dynamic title, and clean typography.
  - `blog` — Editorial hero with avatar, author name, reading time, and publish date.
  - `minimal` — Clean dual-accent border layout with high-contrast text.
  - `ecommerce` — High-impact product card with price badge, rating stars, and promo tags.
  - `github` — Developer repository stats card with language badges, forks, stars, and owner breadcrumbs.
- **HMAC URL Signing**: Cryptographic HMAC-SHA256 signature validation (`s=`) prevents query parameter tampering and unauthorized quota depletion.
- **Developer API Key Engine**: Bearer token authentication (`og_live_...`) with per-request credit metering and in-memory LRU caching.
- **Polar.sh Monetization**: One-click checkout with Starter (500 credits), Growth (2,500 credits), and Scale (10,000 credits) tiers, verified via StandardWebhooks.
- **GitHub Social Authentication**: Powered by Better-Auth and LibSQL/Turso Drizzle ORM.
- **Built-in SEO & Discovery via `yaxa-svelte`**:
  - Dynamic `/robots.txt` with crawler directives and automated sitemap linking.
  - Standards-compliant `/sitemap.xml` with human-friendly `/sitemap.xsl` stylesheet.
  - PWA `/site.webmanifest` manifest.
  - Schema.org JSON-LD structured data (`WebSite`, `Organization`) and OpenGraph/Twitter card automation.
- **Real-Time Analytics Deck**: Audit log inspector, cache hit metrics, and template breakdown charts.

---

## 🛠️ Tech Stack

| Layer                   | Technology                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| **Framework**           | SvelteKit 2 + Svelte 5 (Runes) + Vite 8                                                    |
| **UI Components & SEO** | [`yaxa-svelte`](https://github.com) (Button, FormField, Select, Seo, Favicons, SiteConfig) |
| **Styling**             | Tailwind CSS v4                                                                            |
| **Image Generation**    | Satori 0.33 + @resvg/resvg-js 2.6                                                          |
| **Database & ORM**      | Turso (LibSQL SQLite) + Drizzle ORM                                                        |
| **Authentication**      | Better-Auth + GitHub OAuth Provider                                                        |
| **Monetization**        | Polar.sh SDK + StandardWebhooks                                                            |

---

## 🚦 Getting Started

### 1. Prerequisites

- Node.js `>= 20.x`
- `pnpm` (v9 or v10)

### 2. Installation

```bash
pnpm install
```

### 3. Environment Variables

Copy `.env.example` to `.env` and configure your keys:

```bash
cp .env.example .env
```

### 4. Database Setup

Push the Drizzle schema to your Turso or local SQLite database:

```bash
pnpm run db:push
```

### 5. Start Development Server

```bash
pnpm run dev
```

Visit [http://localhost:5173](http://localhost:5173).

---

## 🧪 Testing & Verification

Run the full end-to-end test suite (tests 5 templates, HMAC signing/verification, health check, robots, sitemaps, manifest, and SEO metadata):

```bash
# 1. Start dev server in one terminal
pnpm run dev

# 2. Run test verification suite
pnpm run test:engine
```

Run type checking:

```bash
pnpm run check
```

---

## 📡 API Endpoints

### 1. Generate OG Image (`GET /api/og`)

```http
GET /api/og?template=saas&title=Hello+World&theme=brand&s=3f8a9c...
```

**Query Parameters:**

- `template`: `saas` | `blog` | `minimal` | `ecommerce` | `github`
- `theme`: `brand` | `dark` | `light`
- `title`: Main banner title
- `description`: Subtitle or excerpt
- `badge`: Category or status badge
- `siteName`: Brand or domain name
- `s`: HMAC-SHA256 signature (first 16 hex characters)

### 2. Sign OG URL (`POST /api/sign`)

```json
POST /api/sign
Content-Type: application/json

{
  "params": {
    "template": "saas",
    "title": "My Awesome Post",
    "siteName": "example.com"
  }
}
```

### 3. Create API Key (`POST /api/keys`)

```json
POST /api/keys
Content-Type: application/json

{
  "name": "Production Server"
}
```

---

## 🚀 Deployment

The project includes `@sveltejs/adapter-netlify` and `netlify.toml` for instant Netlify edge deployments:

```bash
pnpm run build
```
