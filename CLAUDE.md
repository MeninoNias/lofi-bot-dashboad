# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

lofi-bot-dashboard - A desktop dashboard application for managing the lofi Discord bot. Built with Tauri 2.0, React 19, TypeScript, and Rsbuild. Communicates with the lofi-bot via its REST API.

## Build/Test Commands

```bash
npm install              # Install dependencies
npm run dev              # Start Rsbuild dev server
npm run build            # Build frontend for production
npm run preview          # Preview production build
npm run tauri dev        # Start Tauri dev mode (frontend + native window)
npm run tauri build      # Build production desktop app
npx tauri icon <png>     # Generate app icons from source image
```

## Architecture

- **Desktop Runtime**: Tauri 2.0 (Rust backend)
- **Build Tool**: Rsbuild (Rust-based, via Rspack)
- **Frontend**: React 19 + TypeScript
- **Entry point**: `src/main.tsx` (React), `src-tauri/src/main.rs` (Tauri)

### Directory Structure

```
lofi-bot-dashboard/
├── src/                       # React frontend
│   ├── main.tsx               # React entry point
│   └── App.tsx                # App root component
├── src-tauri/                 # Tauri / Rust backend
│   ├── src/
│   │   ├── main.rs            # Tauri entry point
│   │   └── lib.rs             # Shared Rust logic
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
| Styling | (TBD - Tailwind CSS v4) |
| UI Components | (TBD - shadcn/ui) |
| Routing | (TBD - React Router) |
| Data Fetching | (TBD - TanStack Query) |
| State Management | (TBD - Zustand) |

### Communication

- **This repo is frontend-only** — the bot stays in [lofi-bot](https://github.com/MeninoNias/lofi-bot)
- **REST API** — dashboard consumes the HTTP API exposed by lofi-bot (Elysia.js)
- **Tauri commands** — used for local features (system tray, file dialogs, notifications)

### Tauri 2.0 Capabilities

Permissions are defined in `src-tauri/capabilities/`. The default capability grants `core:default` permissions to the main window.

## Prerequisites

- **Node.js** (for npm/frontend tooling)
- **Rust** (for Tauri/Cargo compilation)
- Tauri system dependencies: see [Tauri Prerequisites](https://v2.tauri.app/start/prerequisites/)

## Release Process

Uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` → minor version bump
- `fix:` → patch version bump
- `feat!:` or `BREAKING CHANGE:` → major version bump
