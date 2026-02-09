# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**lofi-bot-dashboard** (v0.1.0) — A lightweight desktop dashboard for managing [lofi-bot](https://github.com/MeninoNias/lofi-bot), a 24/7 Discord radio bot that streams lofi music to voice channels.

The dashboard provides a visual interface to manage radio stations (CRUD), control playback (play/stop/skip), monitor bot health (uptime, latency, connections), and view listener stats (XP, levels, leaderboards) — replacing the need for Discord `!` commands for administration.

Built with **Tauri 2.0** for a minimal footprint (~5 MB, ~30 MB RAM) and connects to the bot's REST API (Elysia.js) via API key authentication.

- **App identifier**: `com.lofi-bot.dashboard`
- **Default window**: 1024×768, title "Lofi Bot Dashboard"

## Golden Rules

1. **Always use `bun` / `bunx`** — never `npm` or `npx`. This project uses Bun as its package manager and script runner.
2. **Always use issue templates** — when creating GitHub issues, follow the templates in `.github/ISSUE_TEMPLATE/` (use `feature_request.md` for enhancements, `bug_report.md` for bugs). Title format: `[FEATURE] ...` or `[BUG] ...`.

## Build/Test Commands

```bash
bun install              # Install dependencies
bun run dev              # Start Rsbuild dev server (port 3000)
bun run build            # Build frontend for production (output: dist/)
bun run preview          # Preview production build
bun run tauri dev        # Start Tauri dev mode (frontend + native window)
bun run tauri build      # Build production desktop app
bunx tauri icon <png>    # Generate app icons from source image
```

## Architecture

- **Desktop Runtime**: Tauri 2.0 (Rust backend)
- **Build Tool**: Rsbuild (Rust-based, via Rspack)
- **Frontend**: React 19 + TypeScript
- **Serialization**: serde + serde_json (Rust side)
- **Entry points**: `src/main.tsx` (React), `src-tauri/src/main.rs` (Tauri)

### Directory Structure

```
lofi-bot-dashboard/
├── src/                       # React frontend
│   ├── main.tsx               # React entry point (renders into #root)
│   ├── App.tsx                # App root component (router)
│   ├── index.css              # Tailwind v4 theme (inline @theme, CSS variables)
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # shadcn/ui primitives (button, card, dialog, etc.)
│   │   ├── stations/          # Station-specific components (dialogs, sheets)
│   │   ├── app-sidebar.tsx    # Navigation sidebar
│   │   ├── auth-guard.tsx     # Protected route wrapper
│   │   └── dashboard-layout.tsx # Sidebar + layout wrapper
│   ├── hooks/                 # React Query hooks
│   │   ├── use-stations.ts    # Station CRUD mutations & queries
│   │   ├── use-health.ts      # Health status & API info queries
│   │   ├── use-leaderboard.ts # Global & guild leaderboard queries
│   │   └── use-mobile.ts      # Responsive breakpoint hook
│   ├── lib/                   # Utilities
│   │   ├── api-client.ts      # HTTP client (fetch, ApiError, auth header)
│   │   ├── query-client.ts    # TanStack Query config (30s stale, no 401 retry)
│   │   └── utils.ts           # cn() helper (clsx + tailwind-merge)
│   ├── pages/                 # Route pages (one directory per domain)
│   │   ├── auth/              # Login page
│   │   ├── dashboard/         # Overview, controls, health
│   │   ├── stations/          # Station management (CRUD)
│   │   ├── users/             # Profiles, leaderboard
│   │   └── settings/          # App settings
│   ├── services/              # API service functions
│   │   ├── station-service.ts # Station CRUD + setDefault
│   │   ├── health-service.ts  # Health status & API info
│   │   ├── leaderboard-service.ts # Leaderboard queries
│   │   └── profile-service.ts # User profile queries
│   ├── stores/                # Zustand stores
│   │   └── auth-store.ts      # API key + base URL (persisted to localStorage)
│   └── types/                 # TypeScript types
│       └── api.ts             # API response types (Station, HealthStatus, etc.)
├── src-tauri/                 # Tauri / Rust backend
│   ├── src/
│   │   ├── main.rs            # Tauri entry point (calls lib::run)
│   │   └── lib.rs             # Tauri builder setup
│   ├── capabilities/          # Tauri 2.0 permissions
│   │   └── default.json       # Default window capabilities
│   ├── icons/                 # App icons (all platforms)
│   ├── build.rs               # Tauri build script
│   ├── Cargo.toml             # Rust dependencies
│   └── tauri.conf.json        # Tauri configuration
├── .github/                   # GitHub config
│   ├── workflows/release.yml  # Release-please automation
│   ├── ISSUE_TEMPLATE/        # Bug report & feature request templates
│   ├── pull_request_template.md
│   └── dependabot.yml         # Dependency update automation
├── docs/mock/                 # HTML design mocks (reference only)
├── index.html                 # HTML template (loads JetBrains Mono)
├── components.json            # shadcn/ui config (new-york style, Lucide icons)
├── postcss.config.mjs         # PostCSS with @tailwindcss/postcss
├── rsbuild.config.ts          # Rsbuild configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies & scripts
```

### Page Organization

Pages are organized **by domain**, not nested under a single `dashboard/` directory. Each domain gets its own directory under `src/pages/`:

| Directory | Pages | Description |
|-----------|-------|-------------|
| `pages/auth/` | Login | Authentication flow |
| `pages/dashboard/` | Overview, Controls, Health | General bot monitoring |
| `pages/stations/` | Stations | Station CRUD management |
| `pages/users/` | Profiles, Leaderboard | User stats and rankings |
| `pages/settings/` | Settings | App configuration |

Each directory has an `index.ts` barrel export. Routes are defined in `App.tsx`.

### Key Technologies

| Layer | Technology |
|-------|-----------|
| Desktop Runtime | Tauri 2.0 (Rust) |
| Build Tool | Rsbuild (Rspack/SWC) |
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Routing | React Router v7 |
| Data Fetching | TanStack Query v5 |
| State Management | Zustand v5 (with persist) |
| Icons | Lucide React |

### API Client & Data Layer

**API client** (`lib/api-client.ts`):
- Custom `ApiError` class with `statusCode` and optional `body`
- Sends `X-API-Key` header from Zustand auth store
- Auto-clears auth and redirects on 401 responses
- Base URL from `PUBLIC_LOFI_BOT_API_URL` env var (default: `http://localhost:3000`)

**Query client** (`lib/query-client.ts`):
- 30s stale time, no refetch on window focus
- Retries up to 2 times (skips retry on 401)

**Auth store** (`stores/auth-store.ts`):
- Zustand with `persist` middleware (localStorage key: `lofi-auth`)
- Stores `apiKey` — set on login, cleared on 401 or logout

### Communication

- **This repo is frontend-only** — the bot stays in [lofi-bot](https://github.com/MeninoNias/lofi-bot)
- **REST API** — dashboard consumes the HTTP API exposed by lofi-bot (Elysia.js)
- **Tauri commands** — used for local features (system tray, file dialogs, notifications)

### Backend Project — [lofi-bot](https://github.com/MeninoNias/lofi-bot)

The bot is a separate repo. The dashboard consumes its REST API.

- **Runtime**: Bun + TypeScript
- **HTTP framework**: Elysia.js (exposes REST API)
- **Bot framework**: Discord.js
- **Database**: PostgreSQL (Drizzle ORM)
- **Auth**: API key via `X-API-Key` header
- **Bot commands**: `!play`, `!stop`, `!stations`, `!addstation`, `!removestation`, `!setdefault`
- **API endpoints consumed by dashboard**:
  - `GET /` — API info (name, version, endpoints)
  - `GET /health` — bot health status (also used for API key validation)
  - `GET /api/stations` — list all stations
  - `POST /api/stations` — create station
  - `DELETE /api/stations/:id` — delete station
  - `PUT /api/stations/:id/default` — set default station
  - `GET /api/leaderboard?limit=N` — global leaderboard
  - `GET /api/guilds/:guildId/leaderboard?limit=N` — guild leaderboard
  - `GET /api/users/:userId/profile` — user profile
  - CORS must be enabled in Elysia.js

### Tauri 2.0 Capabilities

Permissions are defined in `src-tauri/capabilities/default.json`. The default capability grants the main window:

- `core:default` — standard Tauri core permissions
- `core:window:allow-set-title` — allows setting the window title at runtime

### Tailwind CSS v4

Uses the new Tailwind v4 architecture — **no `tailwind.config.js`**. All theme configuration lives in `src/index.css` via `@theme inline` and CSS custom properties. PostCSS integration via `@tailwindcss/postcss` in `postcss.config.mjs`. shadcn/ui configured with `new-york` style in `components.json`.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PUBLIC_LOFI_BOT_API_URL` | `http://localhost:3000` | Bot API base URL |

Set in `.env` file at project root. Accessed via `import.meta.env.PUBLIC_LOFI_BOT_API_URL`.

## Design System — Monospaced Lofi

A terminal-inspired, monochrome design language. Reference mock: `docs/mock/desiner-system.html`

### Typography

- **Font**: JetBrains Mono (monospace) — all UI text
- **Weights**: Light (300), Regular (400), Medium (500), SemiBold (600), Bold (700)
- **Scale**:
  - Display: `text-5xl font-bold tracking-tighter`
  - Section: `text-2xl font-bold uppercase tracking-tight`
  - Body: `text-sm text-zinc-400 leading-relaxed`
  - Label: `text-xs font-bold uppercase tracking-widest text-zinc-500`

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `background-dark` | `#09090b` | Main app background |
| `card-dark` | `#18181b` | Card/panel surfaces |
| `sidebar-dark` | `#101012` | Sidebar background |
| Primary text | `#FFFFFF` | Headings, emphasis |
| Secondary text | `#94A3B8` | Body text, descriptions |
| Border | `#27272a` | Card/section borders |
| Input border | `#3f3f46` | Form input borders |
| Success | `emerald-500` | Online/live indicators |
| Glass | `white/10` | Overlay effects |

### Component Patterns

- **Primary button**: `bg-white text-black` with `shadow-white/10`
- **Secondary button**: `border border-zinc-600 text-white` (outline)
- **Inputs**: `bg-black border-zinc-700`, focus: `border-white`
- **Cards**: `bg-card-dark border border-zinc-800 rounded-lg`
- **Status indicator**: `w-2 h-2 bg-emerald-500 rounded-full animate-pulse`
- **Station cards**: Grayscale images → colorize on hover
- **Icons**: Lucide React, 24px base

## Prerequisites

- **Bun** (package manager and script runner)
- **Rust** (for Tauri/Cargo compilation)
- Tauri system dependencies: see [Tauri Prerequisites](https://v2.tauri.app/start/prerequisites/)

## GitHub

### Labels

| Label | Description |
|-------|-------------|
| `enhancement` | New feature or request |
| `bug` | Something isn't working |
| `frontend` | React frontend / UI work |
| `ui/ux` | UI components, design, and user experience |
| `api` | REST API integration with lofi-bot |
| `tauri` | Tauri desktop runtime |
| `rsbuild` | Rsbuild / Rspack build tooling |
| `setup` | Project setup and configuration |
| `architecture` | Project structure and architectural decisions |
| `ci/cd` | GitHub Actions, builds, and deployment |
| `documentation` | Improvements or additions to documentation |
| `blocked` | Blocked by external dependency |
| `priority: high` | High priority task |

### Milestones

| Milestone | Description |
|-----------|-------------|
| `v0.1.0 - Project Foundation` | Tauri 2.0 + React + Rsbuild scaffold, Tailwind CSS + shadcn/ui, basic layout and navigation |
| `v0.2.0 - Core Dashboard` | Station management UI, bot controls, health monitoring, API client integration |
| `v0.3.0 - User Features` | User profiles, XP/level display, leaderboards, settings page |
| `v1.0.0 - Production Release` | System tray, log viewer, multi-platform builds, CI/CD, auto-updates, polished UI |

### Issue Guidelines

- **Always use the templates** in `.github/ISSUE_TEMPLATE/` when creating issues:
  - `feature_request.md` → sections: Description, Use Case, Proposed Solution (title prefix: `[FEATURE]`)
  - `bug_report.md` → sections: Description, Steps to Reproduce, Expected/Actual Behavior, Environment (title prefix: `[BUG]`)
- Use labels to categorize issues (combine multiple: e.g. `enhancement` + `frontend` + `ui/ux`)
- Assign issues to the appropriate milestone based on scope
- Reference the backend repo when issues involve API integration

## Release Process

Uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` → minor version bump
- `fix:` → patch version bump
- `feat!:` or `BREAKING CHANGE:` → major version bump
