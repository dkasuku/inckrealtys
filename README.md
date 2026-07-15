# INCK Realty Ltd

Full-stack site for INCK Realty Ltd — a Next.js front end with a Flask + PostgreSQL
backend and a shadcn/ui admin panel.

```
estate-nextjs/
├── nextjs/     # Public website + /admin panel (Next.js 16, Tailwind v4, shadcn/ui)
└── backend/    # Flask API + PostgreSQL (properties, requests, media, site content)
```

## Quick start

**Backend** (see `backend/README.md` for detail):

```bash
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env          # then edit DATABASE_URL / SECRET_KEY / ADMIN_*
python seed.py
python app.py                   # http://localhost:5000
```

**Frontend:**

```bash
cd nextjs
npm install
npm run dev                     # http://localhost:3000
```

`nextjs/.env.local` points the site at the API:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Admin panel

Sign in at <http://localhost:3000/admin> with the `ADMIN_EMAIL` / `ADMIN_PASSWORD`
from `backend/.env`.

| Screen | What you can do |
| --- | --- |
| **Dashboard** | Counts for properties, featured, requests and media; recent requests |
| **Properties** | Full CRUD — pricing, specs, description, highlights, amenities, hero/card images, gallery, featured & published toggles |
| **Requests** | Every enquiry from the site; filter by status, mark contacted/closed, reply by email, delete |
| **Blog** | Write/edit articles — cover image, category, tags, featured & publish toggles |
| **Media** | Upload/delete images. Saved to `nextjs/public/uploads`, served at `/uploads/…` |
| **Site Sections** | Edit the text **and images** of every section on every page |

## How content flows

Site content lives in the `site_sections` table as a JSON blob per section. Pages
fetch it server-side and merge it over the component's built-in defaults, so:

- Edits in the admin appear on the site within ~30 seconds (ISR).
- **If the backend is offline the site still renders** using the bundled defaults —
  it never breaks.

Every image field in the admin opens the media library, so all imagery across the
site is managed in one place.

## Notes

- **Hero slideshow** — the homepage hero cross-fades through several images with a slow
  Ken Burns drift. Add/remove images and change the timing under
  **Site Sections → Homepage — Hero** (`backgroundImages`, `intervalMs`).
- **Blog article format** — in the admin body editor, one block per line:
  `## ` for a heading, `> ` for a pull-quote, `!image-url | caption` for an image,
  anything else becomes a paragraph.
