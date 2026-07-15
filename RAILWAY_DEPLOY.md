# Deploying to Railway

This guide walks through deploying the INCK Realty full-stack app (Next.js frontend + Flask backend + PostgreSQL) to [Railway](https://railway.app).

## What you need

- A Railway account (sign up at https://railway.app).
- The code already pushed to GitHub. The repo is currently at:
  `https://github.com/dkasuku/inckrealtys.git`
- Your local repo is on the `main` branch and up to date with GitHub.

## Overview

You will create **three services** in one Railway project:

1. **PostgreSQL** — managed database.
2. **INCK Backend** — the Flask API, deployed from the `backend/` folder.
3. **INCK Frontend** — the Next.js app, deployed from the `nextjs/` folder.

## Step 1: Push the latest code to GitHub

The deployment files (`backend/railway.json`, `nextjs/railway.json`, `Procfile`, etc.) have been added to the repo. Make sure they are pushed:

```bash
git add .
git commit -m "Add Railway deployment config"
git push origin main
```

## Step 2: Create a Railway project

1. Log in to Railway and click **New Project**.
2. Choose **Deploy from GitHub repo**.
3. Select the `inckrealtys` repository and the `main` branch.
4. Railway will create an empty project. You will add services next.

## Step 3: Add PostgreSQL

1. In your Railway project, click **New** → **Database** → **Add PostgreSQL**.
2. Railway will create the database and generate a `DATABASE_URL` variable automatically.

## Step 4: Add the Backend service

1. Click **New** → **GitHub Repo**.
2. Select the `inckrealtys` repo again.
3. In the service settings, set:
   - **Name**: `inck-backend` (or any name you prefer)
   - **Root Directory**: `backend`
4. Go to the **Variables** tab and add:

   | Variable | Value / Notes |
   | --- | --- |
   | `DATABASE_URL` | Railway will auto-fill this from the PostgreSQL service after you link it. If not, copy it from the PostgreSQL service. |
   | `SECRET_KEY` | A long random string. Generate one locally with `python -c "import secrets; print(secrets.token_hex(32))"` |
   | `ADMIN_EMAIL` | The email you will use to log into `/admin` |
   | `ADMIN_PASSWORD` | A strong admin password |
   | `CORS_ORIGINS` | The full frontend domain(s), e.g. `https://inck-frontend.up.railway.app` (use your actual domain) |
   | `UPLOAD_DIR` | `/app/uploads` |
   | `UPLOAD_URL_PREFIX` | Set to the **full backend URL** with `/uploads`, e.g. `https://inck-backend.up.railway.app/uploads` |
   | `JWT_EXPIRES_HOURS` | `12` (or any value you prefer) |
   | `MAX_UPLOAD_MB` | `10` |

5. Link the PostgreSQL database to the backend service:
   - In the backend service **Settings** → **Networking**, add a **Reference** to the PostgreSQL service. This automatically injects `DATABASE_URL`.
6. Click **Deploy**.

After the first successful deploy, Railway will give the backend a public domain like `https://inck-backend.up.railway.app`. Copy this URL — you will need it for the frontend.


## Step 5: Seed the database (one-time)

The backend creates the database tables automatically on startup, but the admin user and sample data must be seeded once.

1. In Railway, open the **backend service**.
2. Go to the **Deployments** tab and click the three dots on the latest deploy → **View Logs**.
3. If the deploy succeeded, go to the service's **Shell** tab and run:

   ```bash
   python seed.py
   ```

   You should see output confirming the admin user, properties, and site sections were created.

## Step 6: Add the Frontend service

1. Click **New** → **GitHub Repo**.
2. Select the `inckrealtys` repo.
3. In the service settings, set:
   - **Name**: `inck-frontend` (or any name you prefer)
   - **Root Directory**: `nextjs`
4. Go to the **Variables** tab and add:

   | Variable | Value / Notes |
   | --- | --- |
   | `NEXT_PUBLIC_API_URL` | The full backend URL you copied earlier, e.g. `https://inck-backend.up.railway.app` |

   > `NEXT_PUBLIC_API_URL` is read at build time, so you must set it **before** the first deploy.

5. Click **Deploy**.

Railway will give the frontend a public domain like `https://inck-frontend.up.railway.app`. Wait for the deploy to finish, then open the URL.

## Step 7: Update CORS with the real frontend domain

1. Copy the frontend's public domain.
2. Go to the **backend service** → **Variables**.
3. Update `CORS_ORIGINS` to the frontend domain, e.g. `https://inck-frontend.up.railway.app`.
4. Redeploy the backend so the change takes effect.

## Step 8: Log in to the admin panel

1. Open `https://<your-frontend-domain>/admin`.
2. Sign in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you set in the backend variables.
3. You can now manage content, properties, and media from the admin panel.

## Important notes

- **Uploaded images**: The backend saves uploads to `/app/uploads` and serves them at `/uploads/<file>`. Because the backend and frontend are separate services, we set `UPLOAD_URL_PREFIX` to the full backend URL. New uploads will work correctly. Existing URLs that were saved as `/uploads/...` will only resolve if the frontend also has the same file in its `public/uploads` folder, which is not the case on Railway. After deploying, re-upload any images you need through the admin panel or edit their URLs to point to the backend.

- **Persistent uploads**: The `/app/uploads` folder is inside the backend container. If the container is restarted or redeployed, uploaded files may be lost unless you attach a Railway Volume at `/app/uploads`. For a production site, consider using an external service such as Cloudinary, AWS S3, or Cloudflare R2 instead of local disk storage.

- **Secrets**: Never commit `.env`, `.env.local`, or real secrets to Git. Both the backend and frontend `.gitignore` files already ignore them. Always set secrets through Railway's Variables tab.

- **Custom domains**: Once everything works, you can add custom domains in Railway's service settings for both the frontend and backend.

## Troubleshooting

- **Frontend build fails**: Make sure `NEXT_PUBLIC_API_URL` is set and points to a working backend URL. Check the deploy logs.
- **Backend fails to start**: Check the backend logs. Common issues:
  - `DATABASE_URL` is missing or malformed.
  - `PORT` is not set (Railway sets this automatically, so no action needed).
  - `CORS_ORIGINS` does not include the frontend domain.
- **Admin login fails**: Make sure you ran `python seed.py` in the backend shell after the database was connected.
- **Images not loading**: Verify `UPLOAD_URL_PREFIX` is set to the full backend URL with `/uploads` and that the backend was redeployed after changing it.

## Files added for Railway

- `backend/railway.json` — tells Railway to use Nixpacks and start with Gunicorn.
- `backend/Procfile` — fallback for the Python build process.
- `backend/requirements.txt` — now includes `gunicorn`.
- `backend/config.py` — normalizes `DATABASE_URL` so Railway's `postgres://` or `postgresql://` URLs work with the psycopg driver.
- `nextjs/railway.json` — tells Railway to build and start the Next.js app.
- `RAILWAY_DEPLOY.md` — this guide.