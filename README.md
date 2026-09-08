# Jubilee Assembly

React/Vite church website with an Express API and MySQL-backed services, events, FAQ chat, and contact messages.

## Local setup

1. Install dependencies: `npm install`.
2. Copy `.env.example` to `.env` and replace every `your-...` value with a real value.
3. Initialize MySQL: `npm run db:init`.
4. Start the API from the project root: `npm run server`.
5. In a second terminal, start Vite: `npm run dev`.

Open `http://localhost:5173`. The Vite server proxies `/api` to `http://localhost:4000`.

## Netlify environment variables

In Netlify, add each variable under **Site configuration > Environment variables**. Do not add empty rows:

```text
MYSQL_HOST=your-managed-mysql-host
MYSQL_PORT=3306
MYSQL_DATABASE=jubilee_assembly
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
CLIENT_ORIGIN=https://your-site.netlify.app
```

`OPENAI_API_KEY` and `OPENAI_MODEL` are optional. Never commit `.env` or real passwords to GitHub. `MYSQL_HOST=localhost` will not work from Netlify because Netlify cannot access your computer's local MySQL server.

The Netlify build uses `npm run build`, publishes `dist`, and routes `/api/*` to `netlify/functions`.

## API

- `GET /api/health` checks MySQL connectivity.
- `GET /api/services` returns service times.
- `GET /api/events?limit=20` returns upcoming events.
- `POST /api/chat` accepts `{ "question": "..." }`.
- `POST /api/contact` accepts `{ "name", "email", "subject", "message" }` and stores the message.

Useful commands: `npm run lint`, `npm run build`, and `npm run server:watch`.
