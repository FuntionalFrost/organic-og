# ⚡ Organic-OG — Zero-WASM OpenGraph & Social Card Engine

> **100% Free & Open Source Software (MIT License)**. Sub-10ms dynamic OpenGraph cards, Twitter cards, and social preview banners generated natively at the edge.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Svelte 5](https://img.shields.io/badge/Svelte-5%20Runes-orange.svg)](https://svelte.dev)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-red.svg)](https://kit.svelte.dev)
[![Rust Resvg](https://img.shields.io/badge/Rasterizer-Resvg%20Zero--WASM-blue.svg)](https://github.com/RazrFalcon/resvg)

---

## 🌟 Highlights

- **⚡ Sub-10ms Generation**: Built with native SVG generation and Rust-powered Resvg rasterization (`@resvg/resvg-js`) — completely free of Chromium, Puppeteer, or slow WASM emulators.
- **🎨 9 Designer Templates**:
  - `saas` — Launch cards with badge, title, subtitle, and branding.
  - `blog` — Editorial article heroes with author avatars and reading times.
  - `minimal` — High-contrast, minimalist border layouts.
  - `ecommerce` — Dynamic product cards with price tags, star ratings, and promo badges.
  - `github` — Developer repository preview with star/fork counts and language tags.
  - `podcast` — Audio show cards with host, guest, episode number, and duration.
  - `event` — Summit and conference announcements with dates, venues, and keynote speakers.
  - `quote` — Verified customer testimonials and social pull-quotes.
  - `changelog` — Release cards with version badges and bulleted feature highlights.
- **🖼️ Dual-Format Output**:
  - `PNG` — High-DPI rasterized social cards (1200×630) for Twitter, Discord, WhatsApp, and LinkedIn.
  - `SVG` — Direct sub-millisecond vector streaming (`format=svg`) for interactive README embeds and web icons.
- **🪄 Visual Customization**:
  - **Typography**: Inter Sans, JetBrains Mono, Outfit Modern, and Playfair Serif.
  - **Patterns**: None, Tech Grid, Dot Matrix, and Glow Accent overlays.
  - **Custom Colors**: Full hex override support for background, accent, and text colors.
- **🔒 HMAC-SHA256 Signing**: Cryptographic URL tampering protection prevents unauthorized query alterations.
- **🚀 Self-Hostable Anywhere**:
  - Zero-dependency local SQLite file database out of the box.
  - Built-in In-Memory LRU Cache with optional Upstash Redis tiering.
  - 1-click Docker container deployment.

---

## 🛠️ Tech Stack

| Component           | Technology                                       |
| :------------------ | :----------------------------------------------- |
| **Framework**       | SvelteKit 2 + Svelte 5 (Runes) + Vite 8          |
| **UI Components**   | [`yaxa-svelte`](https://yaxa.vercel.app)         |
| **Rasterization**   | Rust Resvg (`@resvg/resvg-js`) Zero-WASM         |
| **Styling**         | Tailwind CSS v4                                  |
| **Database**        | SQLite / Turso LibSQL + Drizzle ORM              |
| **Auth & Security** | Token-based API Keys + HMAC-SHA256 Signing       |
| **Caching**         | Hybrid Dual-Tier (LRU in-memory + Upstash Redis) |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/FuntionalFrost/organic-og.git
cd organic-og
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set a random secret for HMAC URL signing (generate with `openssl rand -base64 32`):

```env
OG_SIGNING_SECRET=generate-a-secure-random-32-character-secret
```

### 3. Run Locally

```bash
pnpm run dev
```

Visit `http://localhost:5173` to explore the interactive Studio canvas.

---

## 🐳 Self-Hosting with Docker

Deploy with Docker Compose in a single command:

```bash
docker compose up -d
```

The service will start on port `3000` with automated volume persistence for the local SQLite database.

---

## 📡 API Reference

### 1. Render an Image

```http
GET /api/og?template=saas&title=Hello+World&badge=v1.0&theme=brand&format=png
```

#### Query Parameters

| Parameter     | Type     | Default      | Description                                                                                |
| :------------ | :------- | :----------- | :----------------------------------------------------------------------------------------- |
| `template`    | `string` | `saas`       | `saas`, `blog`, `minimal`, `ecommerce`, `github`, `podcast`, `event`, `quote`, `changelog` |
| `title`       | `string` | `Organic-OG` | Main headline text (up to 200 chars)                                                       |
| `description` | `string` | `''`         | Body excerpt or subtitle                                                                   |
| `siteName`    | `string` | `''`         | Site domain, podcast show, or repository name                                              |
| `badge`       | `string` | `''`         | Eyebrow pill tag or category                                                               |
| `theme`       | `string` | `dark`       | `brand`, `dark`, `light`                                                                   |
| `format`      | `string` | `png`        | `png` (1200×630) or `svg` (vector)                                                         |
| `font`        | `string` | `inter`      | `inter`, `mono`, `outfit`, `serif`                                                         |
| `pattern`     | `string` | `none`       | `none`, `grid`, `dots`, `glow`                                                             |
| `bg`          | `hex`    | `''`         | Custom background override (e.g. `%230f172a`)                                              |
| `accent`      | `hex`    | `''`         | Custom accent color override (e.g. `%233b82f6`)                                            |
| `textColor`   | `hex`    | `''`         | Custom text color override (e.g. `%23ffffff`)                                              |
| `logoUrl`     | `string` | `''`         | Remote URL for logo or avatar (auto-converted to data URI)                                 |
| `s`           | `string` | `''`         | HMAC-SHA256 signature for URL validation                                                   |

### 2. URL Signing (HMAC-SHA256)

For server-side generation without exposing private secrets in the browser:

```typescript
import { createHmac } from 'crypto';

function signOgUrl(params: Record<string, string>, secret: string): string {
	const query = new URLSearchParams(params).toString();
	const signature = createHmac('sha256', secret).update(query).digest('hex').slice(0, 16);
	return `https://your-domain.com/api/og?${query}&s=${signature}`;
}
```

---

## 🧪 Development & Validation

Validate the entire project with strict type checks and linting:

```bash
# Type Check
pnpm run check

# Prettier Code Formatting
pnpm run format

# ESLint Verification
pnpm run lint

# Production Build
pnpm run build
```

---

## 📄 License

This project is licensed under the permissive **MIT License** — see the [LICENSE](LICENSE) file for details. Built with ❤️ by FunctionalFrost and the Organic-OG community.
