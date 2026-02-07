# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

lofi-bot-dashboard (v0.1.0) — A desktop dashboard application for managing the lofi Discord bot. Built with Tauri 2.0, React 19, TypeScript, and Rsbuild. Communicates with the lofi-bot via its REST API.

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
│   └── App.tsx                # App root component
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
├── index.html                 # HTML template
├── rsbuild.config.ts          # Rsbuild configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Node.js dependencies & scripts
```

### Key Technologies

| Layer | Technology |
|-------|-----------|
| Desktop Runtime | Tauri 2.0 (Rust) |
| Build Tool | Rsbuild (Rspack/SWC) |
| Frontend | React 19 + TypeScript |
| Styling | TBD — Tailwind CSS v4 |
| UI Components | TBD — shadcn/ui |
| Routing | TBD — React Router |
| Data Fetching | TBD — TanStack Query |
| State Management | TBD — Zustand |

### Communication

- **This repo is frontend-only** — the bot stays in [lofi-bot](https://github.com/MeninoNias/lofi-bot)
- **REST API** — dashboard consumes the HTTP API exposed by lofi-bot (Elysia.js)
- **Tauri commands** — used for local features (system tray, file dialogs, notifications)

### Tauri 2.0 Capabilities

Permissions are defined in `src-tauri/capabilities/default.json`. The default capability grants the main window:

- `core:default` — standard Tauri core permissions
- `core:window:allow-set-title` — allows setting the window title at runtime

## Prerequisites

- **Node.js** (for npm/frontend tooling) — or **Bun** (tauri.conf.json currently references bun)
- **Rust** (for Tauri/Cargo compilation)
- Tauri system dependencies: see [Tauri Prerequisites](https://v2.tauri.app/start/prerequisites/)

## Release Process

Uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` → minor version bump
- `fix:` → patch version bump
- `feat!:` or `BREAKING CHANGE:` → major version bump
