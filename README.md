# SHOPIQ

SHOPIQ is a store management web app. The codebase contains a Next.js frontend and a Django REST Framework API for store-owner accounts.

## What is implemented

- A responsive SHOPIQ sign-in page with email and password fields.
- A Google sign-in button that verifies Google credentials through the API for existing store-owner accounts.
- Login requests sent to the API. On success, the API token is saved in browser storage. `Keep me signed in` chooses persistent browser storage; clearing it keeps the token for the current browser session.
- A three-step owner registration flow:
  1. Store owner name and email.
  2. Store name and category.
  3. Password and account creation.
- The API creates a store owner and their store together. The user role is set to `STORE_OWNER`; the registration form does not accept a different role.
- Passwords are stored as bcrypt hashes. The API returns a JWT that expires after one day.
- SQLite persistence through Django ORM models.

## Languages and technologies

| Area | Languages / technologies |
| --- | --- |
| Frontend | TypeScript, TSX (React), CSS, Next.js, Material UI |
| Backend | Python, Django REST Framework |
| Database | SQLite (`backend/db.sqlite3`) |
| Authentication | Email/password, Google Identity Services, JWT |
| Project configuration | JSON, environment files (`.env`) |

The backend uses SQLite. Django creates and manages its `User` and `Store` tables through migrations. Set `SQLITE_NAME` in `backend/.env` to use a different database file.

## Run the frontend

In a terminal:

```sh
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`. It uses `http://localhost:3001` as the default API URL. To use another API origin, set `NEXT_PUBLIC_API_URL` in `frontend/.env.local`.

## Run the API

In a second terminal:

```sh
cd backend
```

Copy `backend/.env.example` to `backend/.env` and set a strong, random `JWT_SECRET`. From the `backend` directory, install dependencies and initialize SQLite:

```sh
py -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
py manage.py migrate
py manage.py runserver 0.0.0.0:3001
```

POSTGRESQL PSW: admin@123

The Django API listens at `http://localhost:3001` with the command above. Set `JWT_SECRET` and `FRONTEND_URL` in `backend/.env`. Set `GOOGLE_CLIENT_ID` and the super admin credentials to enable those sign-in flows.

### Super admin panel

The platform administrator can sign in at `http://localhost:3000/admin/login`. Set `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` in `backend/.env` (copy the variable names from `.env.example`) before starting the API. Replace the example password with a long, unique secret and keep it private. The `/admin` dashboard checks for the `SUPER_ADMIN` role; its overview API returns store and owner counts, new registrations from the last seven days, and the latest registered stores from SQLite. Store owners cannot use the super admin login.

The admin interface is modeled on a retail operations dashboard, with a left navigation rail, platform metrics, a store growth chart, and a recent stores/owners directory. The store directory currently shows the six most recent registrations.

Store-owner registration, email login, and Google login send store owners to `/dashboard`. That page verifies the session against `GET /auth/me` and loads the owner and store details from SQLite. Super-admin access remains separate at `/admin/login`.

### Enable Google sign-in

Create a Google OAuth 2.0 Web client in Google Cloud Console and add `http://localhost:3000` as an authorized JavaScript origin. Put that same client ID in `backend/.env` as `GOOGLE_CLIENT_ID` and `frontend/.env.local` as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, then restart both servers. Google sign-in verifies the credential on the API and only signs in an existing SHOPIQ store-owner account with the same verified Google email. New store owners should first complete the three-step registration.

## Authentication API

### `POST /auth/register`

Creates a store owner and a store. Send JSON with these fields:

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "at-least-8-characters",
  "storeName": "Alex's Store",
  "storeCategory": "Clothing"
}
```

### `POST /auth/login`

Signs in an existing account with email and password:

```json
{
  "email": "alex@example.com",
  "password": "at-least-8-characters"
}
```

Both endpoints return an `accessToken` and user details when successful. The API validates request fields and reports duplicate emails or invalid login credentials with an error response.

### `POST /auth/google`

Verifies a Google Identity Services credential and signs in the matching existing store-owner account:

```json
{
  "credential": "google-identity-token-from-the-browser"
}
```

## Project folders

- `frontend/` - Next.js app, including `/login` and `/register`.
- `backend/` - Django REST Framework API, SQLite database, and authentication endpoints.
