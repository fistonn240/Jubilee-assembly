# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:


## React Compiler

# Jubilee Assembly

React/Vite church website with an Express API and MySQL-backed services, events, FAQ chat, and contact messages.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set the MySQL credentials.
3. Create the configured MySQL database, then run `npm run db:init`.
4. Start the API with `npm run server`.
5. In another terminal, start Vite with `npm run dev` and open the printed URL.

The Vite development server proxies `/api` requests to `http://localhost:4000`. Services, events, and chat have read-only fallback content when MySQL is unavailable. Contact submissions use MySQL when available and fall back to `data/contact-messages.json` for local development.

## API

- `GET /api/health` checks MySQL connectivity.
- `GET /api/services` returns service times.
- `GET /api/events?limit=20` returns upcoming events.
- `POST /api/chat` accepts `{ "question": "..." }`.
- `POST /api/contact` accepts `{ "name", "email", "subject", "message" }` and stores the message.

Useful commands: `npm run lint`, `npm run build`, and `npm run server:watch`.
