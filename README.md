# Locanda

AI-powered multi-hotel conversational assistant with a FastAPI backend, PostgreSQL/pgvector knowledge base, and React frontend.

## Project structure

```text
.
├── backend/          FastAPI application, database models, migrations, and seed script
├── hotel-frontend/   React + Vite frontend
├── .env              Local secrets and database URL (do not commit)
└── requirements.txt  Python dependencies
```

## Prerequisites

- Python 3.11 or newer
- Node.js and npm
- A PostgreSQL database with the `vector` extension
- Gemini API key
- Groq API key

Neon is the recommended PostgreSQL provider. When creating a Neon project, enable **Postgres database** only; object storage, Functions, AI Gateway, and Neon Auth are not required.

## Backend setup

Run these commands from the repository root.

### 1. Activate the virtual environment

```bash
source .venv/bin/activate
```

If the environment has not been created yet:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure environment variables

Create a `.env` file in the repository root, beside this README:

```env
DATABASE_URL=postgresql://username:password@host/database?sslmode=require&channel_binding=require
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

Copy `DATABASE_URL` from your database provider's **Connect** dialog. Do not commit `.env` or share its contents.

### 3. Create the database schema

```bash
cd backend
../.venv/bin/alembic upgrade head
```

The migration creates the application tables and enables the pgvector extension.

### 4. Seed initial data

```bash
python seed.py
```

Seeding creates sample hotel data, a test guest/session, and an initial Gemini embedding. It prints a test session ID when complete.

### 5. Start the API

From the repository root:

```bash
cd ..
python -m uvicorn main:app --reload --app-dir backend
```

The API is available at:

- `http://127.0.0.1:8000/`
- Swagger UI: `http://127.0.0.1:8000/docs`

## Frontend setup

Open a second terminal:

```bash
cd hotel-frontend
npm install
npm run dev
```

The frontend is normally available at `http://localhost:5173`.

The backend allows both `localhost:5173` and `127.0.0.1:5173` for local development.

## Development workflow

Start the backend and frontend in separate terminals:

### Terminal 1

```bash
cd /path/to/Locanda
source .venv/bin/activate
python -m uvicorn main:app --reload --app-dir backend
```

### Terminal 2

```bash
cd /path/to/Locanda/hotel-frontend
npm run dev
```

## Useful API endpoints

- `GET /` — backend health check
- `POST /chat` — send a chat message
- `POST /rate-session` — submit a session rating
- `POST /upload-document` — process a document into the knowledge base
- `GET /analytics/{hotel_id}/top-intents` — view common intents
- `GET /analytics/{hotel_id}/message-volume` — view message volume
- `GET /analytics/{hotel_id}/average-rating` — view average rating

## Troubleshooting

### `InvalidPasswordError`

Copy a fresh complete `DATABASE_URL` from the current database project's **Connect** dialog. Do not reuse a URL from another project or manually type only the password.

### `No module named alembic.__main__`

Use the Alembic executable rather than `python -m alembic`:

```bash
../.venv/bin/alembic upgrade head
```

### `OPTIONS /chat 400 Bad Request`

Make sure the frontend is running on `http://localhost:5173` or `http://127.0.0.1:5173`, and restart the backend after changing its CORS configuration.

### `@tailwindcss/vite` cannot be resolved

Install frontend dependencies from the frontend directory:

```bash
cd hotel-frontend
npm install
```

### Database schema or prepared-statement errors after migrations

Restart the backend after applying migrations. The project disables asyncpg's prepared-statement cache for compatibility with pooled PostgreSQL connections.

## Security notes

- Never commit `.env`, API keys, database passwords, or generated credentials.
- Rotate any key that has been exposed.
- Keep database credentials in local environment variables or a secret manager.
