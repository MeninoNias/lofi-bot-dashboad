# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**lofi-bot-dashboard** (v0.1.0) — A lightweight desktop dashboard for managing [lofi-bot](https://github.com/MeninoNias/lofi-bot), a 24/7 Discord radio bot that streams lofi music to voice channels.

The dashboard provides a visual interface to manage radio stations (CRUD), control playback (play/stop/skip), monitor bot health (uptime, latency, connections), and view listener stats (XP, levels, leaderboards) — replacing the need for Discord `!` commands for administration.

Built with **Tauri 2.0** for a minimal footprint (~5 MB, ~30 MB RAM) and connects to the bot's REST API (Elysia.js) via API key authentication.

- **App identifier**: `com.lofi-bot.dashboard`
- **Default window**: 1024×768, title "Lofi Bot Dashboard"

## Build/Test Commands

```bash
npm install              # Install dependencies
npm run dev              # Start Rsbuild dev server (port 3000)
npm run build            # Build frontend for production (output: dist/)
npm run preview          # Preview production build
npm run tauri dev        # Start Tauri dev mode (frontend + native window)
npm run tauri build      # Build production desktop app
npx tauri icon <png>     # Generate app icons from source image
```

> **Note:** `tauri.conf.json` uses `bun run dev` / `bun run build` as before-commands. If you use npm instead of bun, update the `beforeDevCommand` and `beforeBuildCommand` fields in `src-tauri/tauri.conf.json`.

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
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # shadcn/ui primitives
│   │   └── stations/          # Station-specific components (dialogs, sheets)
│   ├── hooks/                 # React Query hooks (use-stations, etc.)
│   ├── lib/                   # Utilities (api-client)
│   ├── pages/                 # Route pages (one directory per domain)
│   │   ├── auth/              # Login page
│   │   ├── dashboard/         # Overview, controls, health
│   │   ├── stations/          # Station management (CRUD)
│   │   ├── users/             # Profiles, leaderboard
│   │   └── settings/          # App settings
│   ├── services/              # API service functions (station-service, etc.)
│   ├── stores/                # Zustand stores (auth-store)
│   └── types/                 # TypeScript types (api.ts)
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
├── docs/mock/                 # HTML design mocks (reference only)
├── index.html                 # HTML template
├── rsbuild.config.ts          # Rsbuild configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Node.js dependencies & scripts
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
| Data Fetching | TBD — TanStack Query |
| State Management | TBD — Zustand |

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
- **Auth**: API key via header
- **Bot commands**: `!play`, `!stop`, `!stations`, `!addstation`, `!removestation`, `!setdefault`
- **API endpoints needed by dashboard**:
  - `GET/POST/PUT/DELETE /api/stations` — station CRUD
  - `GET /api/status` — bot status and health
  - CORS must be enabled in Elysia.js

### Tauri 2.0 Capabilities

Permissions are defined in `src-tauri/capabilities/default.json`. The default capability grants the main window:

- `core:default` — standard Tauri core permissions
- `core:window:allow-set-title` — allows setting the window title at runtime

## Design System — Monospaced Lofi

A terminal-inspired, monochrome design language. Reference mock: `docs/mock/desiner-system.html`

### Typography

- **Font**: JetBrains Mono (monospace) — all UI text
- **Weights**: Light (300), Regular (400), Medium (500), Bold (700)
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
- **Icons**: Google Material Icons Round, 24px base

## Prerequisites

- **Node.js** (for npm/frontend tooling) — or **Bun** (tauri.conf.json currently references bun)
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

- Use labels to categorize issues (combine multiple: e.g. `enhancement` + `frontend` + `ui/ux`)
- Assign issues to the appropriate milestone based on scope
- Reference the backend repo when issues involve API integration

## Release Process

Uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` → minor version bump
- `fix:` → patch version bump
- `feat!:` or `BREAKING CHANGE:` → major version bump
