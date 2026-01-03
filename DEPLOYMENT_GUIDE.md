# EduSphere Deployment Guide

## 1. Database Hosting (Neon / Supabase)
Since we are moving to the cloud, we need a PostgreSQL database. **SQLite will not work on cloud hosting.**

1.  Go to **[Neon.tech](https://neon.tech)** or **[Supabase.com](https://supabase.com)** and create a free account.
2.  Create a new Project.
3.  Copy the **Connection String** (it looks like `postgres://user:password@host/db`).

### Update Project for PostgreSQL
1.  Open `server/prisma/schema.prisma`.
2.  Change the provider from `"sqlite"` to `"postgresql"`.
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```
3.  Update your `server/.env` file with the new connection string:
    ```env
    DATABASE_URL="postgres://user:password@host/db?sslmode=require"
    ```
    *(Keep your local SQLite url commented out just in case).*
4.  Run migration:
    ```bash
    cd server
    npx prisma db push
    npm run seed  # To re-add admin user
    ```

---

## 2. Backend Hosting (Render)
We will host the Node.js server on Render (it has a verified free tier).

1.  Push your code to **GitHub**.
2.  Go to **[Render.com](https://render.com)** and create a **New Web Service**.
3.  Connect your GitHub repository.
4.  **Settings**:
    *   **Root Directory**: `server`
    *   **Build Command**: `npm install && npx prisma generate && npm run build`
    *   **Start Command**: `npm start`
5.  **Environment Variables** (Add these in Render Dashboard):
    *   `DATABASE_URL`: (Paste your Neon/Supabase connection string)
    *   `JWT_SECRET`: (Create a random secure secret)
    *   `PORT`: `10000` (Render default)

---

## 3. Frontend Hosting await (Vercel)
1.  Go to **[Vercel.com](https://vercel.com)**.
2.  **Add New Project** -> Import from GitHub.
3.  **Settings**:
    *   **Root Directory**: `client`
    *   **Build Output**: `dist` (Vercel usually detects this)
4.  **Environment Variables**:
    *   `VITE_API_URL`: (The URL of your deployed Render backend, e.g., `https://edusphere-api.onrender.com`)
    *   **IMPORTANT**: In your local code, ensure your axios client uses this variable.

### Checking Frontend Code
Make sure `client/src/context/api.ts` (or wherever you define the base URL) looks like this:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```
