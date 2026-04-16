# TaskFlow — Collaborative Task Board

A lightweight Jira-style task board built with React + Vite. Designed for small teams of 2-3 people working from the same machine or sharing a deployment.

## Features

- 5-column Kanban board: Backlog → To Do → In Progress → Review → Done
- Drag & drop cards between columns
- Create, edit, delete tasks
- Filter by type (Bug, Feature, Task, Docs) and priority (P1, P2, P3)
- Search by task title
- Per-user avatar switching (3 users preconfigured)
- Stats bar showing progress and per-user task count
- Persists to `localStorage` — survives page refresh
- Light/dark mode via `prefers-color-scheme`

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:5173
```

## Build for production

```bash
npm run build
# Output in /dist — deploy to GitHub Pages, Vercel, Netlify, etc.
```

## Deploy to GitHub Pages

1. Add to `vite.config.js`: `base: '/your-repo-name/'`
2. Install: `npm install --save-dev gh-pages`
3. Add to `package.json` scripts:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```
4. Run: `npm run deploy`

## Customizing for your team

Edit `src/constants.js` to change:
- **USERS** — names, initials, colors for your 3 collaborators
- **DEFAULT_TASKS** — initial tasks loaded on first visit
- **COLUMNS** — rename or reorder board columns

## Collaboration

This app uses `localStorage` for persistence, which means:
- **Same machine**: multiple users can switch avatars with the top-right buttons
- **Multiple machines**: deploy to a shared URL (Vercel/GitHub Pages) — each user's browser keeps its own state independently
- **True real-time sync**: would require a backend (Firebase, Supabase, etc.) — see the `firebase-branch` for an experimental version

## Tech stack

- React 18
- Vite 5
- No external UI libraries — pure CSS variables with light/dark mode
