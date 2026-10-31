# Contributing to Organic-OG

Thank you for your interest in contributing to **Organic-OG**! We welcome contributions to our dynamic OpenGraph generation engine, template catalog, developer SDKs, and UI components.

---

## 🛠️ Prerequisites

Before you start, make sure you have installed:

- **Node.js**: `v24.x` or later (`node -v`)
- **pnpm**: `v12.x` or later (`pnpm -v`)
- **Git**: (`git --version`)

---

## 🚀 Local Development Setup

1. **Fork and clone the repository**:

   ```bash
   git clone https://github.com/FuntionalFrost/organic-og.git
   cd organic-og
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure environment variables**:

   ```bash
   cp .env.example .env
   ```

   _(The default `.env.example` provides local development fallbacks for database and HMAC signing secrets.)_

4. **Start the local development server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📋 Available Scripts

| Command            | Description                                                                       |
| :----------------- | :-------------------------------------------------------------------------------- |
| `pnpm dev`         | Starts Vite dev server with hot module replacement                                |
| `pnpm test`        | Runs all 27 unit and integration tests via Vitest                                 |
| `pnpm test:watch`  | Runs Vitest in interactive watch mode                                             |
| `pnpm test:engine` | Runs the template engine tests specifically                                       |
| `pnpm test:probe`  | Probes a running server (`http://localhost:5173`) using zero-browser HTTP `fetch` |
| `pnpm check`       | Runs SvelteKit typecheck and Svelte compiler diagnostics                          |
| `pnpm lint`        | Runs Prettier format verification and ESLint                                      |
| `pnpm format`      | Auto-formats all code using Prettier                                              |
| `pnpm build`       | Compiles the production build for Vercel Serverless / Node adapter                |

---

## 📐 Architecture & Architectural Guidelines

### 1. Svelte 5 Runes & Modern SvelteKit

- Use modern **Svelte 5 runes** (`$state`, `$derived`, `$props`, `$bindable`) rather than legacy Svelte 4 stores or reactive declarations (`$: ...`).
- Use snippets (`{#snippet ...}`) for slotted content.
- Ensure all `.svelte` components pass `pnpm check` with zero diagnostic errors.

### 2. Zero-WASM / Resvg SVG Rendering Constraints

When modifying or creating OpenGraph templates under `src/lib/server/og/`:

- **Native SVG Only**: Templates must return valid SVG strings designed for the 1200×630 canvas (`viewBox="0 0 1200 630"`).
- **Resvg Compatibility**: Organic-OG uses `@resvg/resvg-js` (Rust-compiled native engine) for sub-10ms serverless rasterization.
  - Do **not** rely on CSS Flexbox or browser DOM APIs inside SVG templates.
  - Use absolute coordinate positioning (`<rect x="..." y="...">`, `<g transform="...">`, `<text x="..." y="...">`).
  - Use `<tspan>` for text wrapping and multiline layouts (see existing templates in `src/lib/server/og/` for examples).
- **Sub-10ms Edge Goal**: Avoid slow third-party network fetches during image rendering. Remote assets (avatars/logos) should be fetched through the cached image fetcher.

### 3. Styling & Design Tokens

- The Studio UI uses **Tailwind CSS v4** and **Yaxa UI** component tokens.
- Maintain dark-mode and light-mode parity across all UI tabs.
- Ensure layouts remain responsive on mobile screens ($< 640\text{px}$).

---

## 🧪 Testing Your Changes

Before submitting your pull request, verify that all quality gates pass:

```bash
# 1. Format code
pnpm format

# 2. Check types and Svelte compiler
pnpm check

# 3. Lint and style checks
pnpm lint

# 4. Run Vitest test suite
pnpm test

# 5. Production build test
pnpm build
```

If you add a new template, feature, or parameter, please add corresponding tests in [`src/tests/`](src/tests/).

---

## 📦 Pull Request Guidelines

1. **Create a branch**:
   ```bash
   git checkout -b feat/my-new-template
   # or
   git checkout -b fix/mobile-alignment
   ```
2. **Follow Conventional Commits**:
   - `feat:` New features or templates
   - `fix:` Bug fixes or layout corrections
   - `perf:` Performance improvements
   - `refactor:` Code refactoring without behavior changes
   - `docs:` Documentation improvements
   - `test:` Adding or updating tests
   - `chore:` Dependency bumps, CI updates, or build tooling
3. **Open a Pull Request**:
   - Target the `main` branch.
   - Fill out the provided PR template checklist.

Thank you for helping make Organic-OG faster, cleaner, and more useful!
