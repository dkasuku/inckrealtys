# INCK Realty — Backend API (Flask + PostgreSQL)

Powers the public website and the admin panel: properties, enquiry requests,
uploaded media, and the editable content of every site section.

## Setup

**1. Create the database** (PostgreSQL must be installed and running):

```bash
createdb inck_realty
# or from psql:  CREATE DATABASE inck_realty;
```

**2. Install dependencies:**

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
```

**3. Configure:**

```bash
copy .env.example .env         # Windows  (cp on macOS/Linux)
```

Edit `.env` — set `DATABASE_URL`, a long random `SECRET_KEY`, and your
`ADMIN_EMAIL` / `ADMIN_PASSWORD`.

**4. Seed the database** (creates tables, the admin user, 6 properties and all site sections):

```bash
python seed.py
```

**5. Run:**

```bash
python app.py          # http://localhost:5000
```

Then start the frontend (`npm run dev` in `../nextjs`) and sign in at
<http://localhost:3000/admin> with the admin credentials from your `.env`.

## Uploads

Images upload to `../nextjs/public/uploads` by default, so Next.js serves them
directly at `/uploads/<file>`. Override with `UPLOAD_DIR` in `.env`.

## API

**Public**

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/properties` | Published properties (`?type=`, `?status=`, `?featured=1`) |
| GET | `/api/properties/<slug>` | One property |
| GET | `/api/sections` | All site content, keyed by section |
| POST | `/api/enquiries` | Submit a contact/viewing request |

**Admin** — all require `Authorization: Bearer <token>`

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/login` | Get a JWT |
| GET | `/api/admin/stats` | Dashboard counts |
| GET/POST | `/api/admin/properties` | List / create |
| GET/PUT/DELETE | `/api/admin/properties/<id>` | Read / update / delete |
| GET | `/api/admin/enquiries` | List requests (`?status=`) |
| PATCH/DELETE | `/api/admin/enquiries/<id>` | Set status / delete |
| GET/POST | `/api/admin/media` | List / upload image |
| DELETE | `/api/admin/media/<id>` | Delete image (file + record) |
| GET | `/api/admin/sections` | All editable sections |
| PUT | `/api/admin/sections/<key>` | Update a section's content |

## Models

- **AdminUser** — admin login (hashed password)
- **Property** — developments; JSON fields for description, highlights, amenities, gallery
- **Enquiry** — website requests, optionally linked to a property; status `new` / `contacted` / `closed`
- **MediaAsset** — uploaded images
- **SiteSection** — a `key` + JSON `content` blob per site section

`python seed.py --reset` drops and recreates everything.
