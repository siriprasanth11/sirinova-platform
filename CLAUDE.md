# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SiriNova is a full-stack team-based dance competition registration site (React + Express/MongoDB), deployed as a single Render web service at `https://sirinova-platform.onrender.com`.

## Commands

Install dependencies (three separate `node_modules` trees — root, `client/`, `server/` — each needs its own install):
```bash
npm install               # root deps (express, mongoose, cors, dotenv)
cd client && npm install  # React app deps
cd server && npm install  # nodemailer, mongodb, etc. — NOT present in root node_modules
```
The root `package.json`'s `start` script (`node server/server.js`) will crash on a missing `nodemailer` module unless `server/`'s own deps have been installed — root and server dependency lists are not identical, so both installs are required to run the backend locally.

Run the backend locally:
```bash
node server/server.js     # from repo root; reads server/.env; listens on PORT or 5000
```

Run the frontend locally:
```bash
cd client && npm start    # CRA dev server on :3000
```
There is no dev-mode API proxy — `client/src/App.js` hardcodes `API_BASE = "https://sirinova-platform.onrender.com"`, so **running the frontend locally still talks to the live production backend/database**, not a local server. To test against a local backend, temporarily point `API_BASE` at `http://localhost:5000`.

Build the frontend (also what Render runs):
```bash
npm run build              # from root: cd client && npm install && npm run build
```

Tests:
```bash
cd client && npm test                    # CRA/Jest watch mode
cd client && npm test -- --watchAll=false               # single run
cd client && npm test -- -t "test name"  # run a single test by name
```
Note: `client/src/App.test.js` is the unmodified Create React App boilerplate test (asserts a "learn react" link exists) — it does not match the current `App.js` and will fail as-is.

Linting is whatever CRA's built-in `eslintConfig: { extends: ["react-app", "react-app/jest"] }` provides via `react-scripts`; there's no standalone lint script or CI config in the repo.

## Architecture

**Single Express service serves everything.** `server/server.js` defines the API routes *and* serves `client/build` as static files with a catch-all route to `index.html`. There's one Render web service, not separate frontend/backend deployments — `npm run build` must be re-run (and committed, since `client/build` is intentionally un-ignored per `.gitignore`) for frontend changes to ship.

**The entire live frontend is one component.** `client/src/App.js` (~590 lines) holds all UI and state — hero, event section, about/guidelines, registration form, admin login, and admin dashboard — via `useState`/`useEffect`, with styling in `client/src/App.css` (gold/black glassmorphic theme, CSS custom properties in `:root`). `react-router-dom` is a listed dependency but unused; there's no routing.

**Dead code — do not treat as part of the live app:** `client/src/components/RegistrationForm.js`, `client/src/components/footer.js`, `client/src/pages/AdminPage.js`, and `server/models/choreographer.js` are leftovers from an earlier (pre-team-registration) version of the app. Nothing imports them — `client/src/index.js` renders only `<App />`, and `server/server.js` defines its Mongoose schemas inline rather than importing the `Choreographer` model. They also reference a different, incompatible data shape (individual `name`/`danceStyle`/`experience` fields and a hardcoded `http://localhost:5000` API base) than what's actually in use.

**Backend (`server/server.js`), single file, ESM (`"type": "module"`):**
- Two Mongoose collections, both schemas defined inline: `Registration` (team-based: `teamName`, `contactName`, `email`, `phone`, `numberOfDancers`, `ageCategory`, `danceCategory`, `videoLink`, `createdAt`) and `Event`, treated as a singleton via `Event.findOne()` (no filter — there is only ever meant to be one event document).
- Four routes: `POST /api/register` (saves a registration, then sends two emails via `nodemailer`/Gmail — one to the admin inbox, one confirmation to the registrant), `GET /api/registrations`, `GET /api/event`, `POST /api/event` (upserts the singleton).
- Required env vars (in `server/.env`, gitignored, not committed): `MONGO_URI`, `EMAIL_USER`, `EMAIL_PASS` (Gmail credentials used directly by `nodemailer.createTransport`).
- **No server-side auth on any route.** `GET /api/registrations` and `POST /api/event` are wide open — admin access is a client-side-only password gate (see below).
- On Render, backend changes require a manual redeploy trigger; it does not always auto-pick-up schema/route changes without one.

**Admin auth is fake security.** `App.js` hardcodes `ADMIN_PASSWORD = "admin123"` as a frontend constant — it's shipped in the JS bundle and never validated server-side. This is a known, unresolved gap, not a decision to preserve; a real fix needs a backend auth endpoint.

**Event data uses stale-while-revalidate caching.** The `/api/event` fetch in `App.js` reads/writes `localStorage["sirinova_event_cache"]` so the Event section renders instantly from the last-known data while quietly revalidating — a deliberate workaround for Render free-tier cold starts (service spins down after ~15 min idle, first request after that takes 20–60s). If the perceived load time regresses, check whether this caching logic is still intact before assuming it's a new bug.
