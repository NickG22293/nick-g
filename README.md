# nick-gordon.com

Personal site built with Vite + React and an Express API server.

## Prerequisites

- Node.js 22+
- npm

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in `GOOGLE_SERVICE_ACCOUNT_JSON` with the contents of your Google service account key file. See the comments in `.env.example` for step-by-step instructions on creating the service account and enabling the Google Docs API.

### 3. Configure books (optional)

The Writing tab uses a `books.config.json` file to map book/section IDs to Google Doc IDs. This file is gitignored.

```bash
cp books.config.example.json books.config.json
```

Edit `books.config.json` and replace the placeholder `GOOGLE_DOC_ID` / `TAB_ID` values with real ones. Make sure the Google Doc is shared (view-only) with your service account's email address.

### 4. Run the dev server

```bash
npm run dev
```

This starts both the Vite frontend (http://localhost:5173) and the Express API server (http://localhost:3001) concurrently.

To run them separately:

```bash
npm run dev:vite   # frontend only
npm run dev:api    # API server only
```

### Feature flags

The Writing tab is hidden by default. To enable it locally, set the following in your `.env`:

```
VITE_FEATURE_WRITING=true
```

## Docker

Build and run the production image locally:

```bash
docker build -t nick-g .
docker run -p 8080:80 nick-g
```

The site will be available at http://localhost:8080.

> **Note:** The Docker image serves only the static Vite build via nginx. The Express API server (Google Docs integration) is not included — it runs separately in production.

## Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start frontend + API in watch mode |
| `npm run dev:vite` | Start Vite frontend only |
| `npm run dev:api` | Start Express API server only |
| `npm run build` | Build frontend for production (`dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
