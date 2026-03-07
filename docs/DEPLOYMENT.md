# Career Roadmap Tool - Deployment & Maintenance Guide

## Overview

The Career Roadmap Tool helps TU Darmstadt B.Sc. Informatik students explore 117 career paths, view recommended study modules for each career, and access support resources. It consists of a **Django REST backend** (API + database) and a **React frontend** (single-page application).

---

## Architecture

```
                ┌─────────────────────────────────────┐
                │           Reverse Proxy              │
                │             (Traefik)                │
                │                                      │
                │   /api/*  ──► Django (port 8000)     │
                │   /*      ──► React static files     │
                └─────────────────────────────────────┘
```

**Backend** (`backend/`)
- Django 5.2 + Django REST Framework
- SQLite database (can switch to PostgreSQL via env vars)
- Token-based authentication
- Endpoints: `/api/careers/`, `/api/modules/`, `/api/career-offers/`, `/api/support/`, etc.

**Frontend** (`frontend/`)
- React 18 (Create React App)
- Axios for API communication
- No routing library — uses state-based navigation
- Production build outputs to `frontend/build/`

---

## Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm**
- A web server / reverse proxy (nginx recommended)

---

## Setup from Scratch

### 1. Clone the Repository

```bash
git clone <repo-url> Career-Roadmap
cd Career-Roadmap
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Seed the database with career paths, modules, and resources
python manage.py seed_data
python manage.py import_course_data
python manage.py seed_career_offers
python manage.py seed_master_programs

# Create an admin user (optional)
python manage.py createsuperuser

# Verify it works
python manage.py runserver 0.0.0.0:8000
# Visit http://localhost:8000/api/hello/ — should say "Hello World from Gruppe 31!"
# Visit http://localhost:8000/api/careers/ — should list 117 career paths
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# For local development (connects to localhost:8000)
npm start

# For production build
# Make sure .env.production has the correct API URL:
#   REACT_APP_API_URL=http://<your-server-domain>/api
npm run build
```

The production build is output to `frontend/build/`.

### 4. Server / Reverse Proxy Configuration

The reverse proxy must:
- Serve `frontend/build/` as static files for all non-API routes
- Proxy `/api/` requests to the Django backend

The server uses **Traefik** as reverse proxy. Traefik routes requests to the appropriate service (Django backend or a static file server for the React build).

**Key routing rules:**

| Path | Target |
|------|--------|
| `/api/*` | Django backend (gunicorn on port 8000) |
| `/admin/*` | Django backend (gunicorn on port 8000) |
| `/*` (everything else) | React static files (`frontend/build/`) |

**Example Traefik dynamic config (file provider):**

```yaml
http:
  routers:
    career-api:
      rule: "Host(`fec-roadmap.precis.tu-darmstadt.de`) && PathPrefix(`/api`)"
      service: career-backend
    career-admin:
      rule: "Host(`fec-roadmap.precis.tu-darmstadt.de`) && PathPrefix(`/admin`)"
      service: career-backend
    career-frontend:
      rule: "Host(`fec-roadmap.precis.tu-darmstadt.de`)"
      service: career-frontend

  services:
    career-backend:
      loadBalancer:
        servers:
          - url: "http://127.0.0.1:8000"
    career-frontend:
      loadBalancer:
        servers:
          - url: "http://127.0.0.1:3001"  # or serve build/ via a static file server
```

> **Note:** If using Docker/Traefik labels instead of file config, apply equivalent labels to the Django and frontend containers. The important thing is that `/api/` and `/admin/` go to Django, and everything else serves the React build with a fallback to `index.html` for client-side routing.

### 5. Running Django in Production

Use **gunicorn** instead of the development server:

```bash
cd backend
source venv/bin/activate

# Collect Django static files (for admin panel)
python manage.py collectstatic --noinput

# Run with gunicorn
gunicorn config.wsgi:application --bind 127.0.0.1:8000 --workers 3
```

To keep it running, use **systemd** or **supervisor**:

```ini
# /etc/systemd/system/career-roadmap.service
[Unit]
Description=Career Roadmap Django Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/backend
ExecStart=/path/to/backend/venv/bin/gunicorn config.wsgi:application --bind 127.0.0.1:8000 --workers 3
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable career-roadmap
sudo systemctl start career-roadmap
```

---

## Environment Variables

### Frontend (`frontend/.env.production`)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://fec-roadmap.precis.tu-darmstadt.de/api` |

### Backend (optional, for PostgreSQL)

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_ENGINE` | `sqlite` or `postgresql` | `sqlite` |
| `DB_NAME` | Database name | `career_roadmap` |
| `DB_USER` | Database user | `career_roadmap_user` |
| `DB_PASSWORD` | Database password | (empty) |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |

---

## Django Settings for Production

In `backend/config/settings.py`, ensure:

- `ALLOWED_HOSTS` includes your server domain
- `CORS_ALLOWED_ORIGINS` includes your frontend URL
- `DEBUG = False` for production (currently `True`)
- Change `SECRET_KEY` to a secure random value

---

## Key API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/hello/` | GET | No | Health check |
| `/api/careers/` | GET | No | List all 117 career paths |
| `/api/careers/:id/` | GET | No | Career path details |
| `/api/careers/:id/modules/` | GET | No | Modules relevant to a career |
| `/api/modules/` | GET | No | List all modules |
| `/api/career-offers/` | GET | No | Support resources from Infomappe |
| `/api/master-programs/` | GET | No | Master's program information |
| `/api/recommendations/` | GET | Yes | Personalized module recommendations |

---

## Frontend Pages

| Page | Description |
|------|-------------|
| **Home** (Dashboard) | Overview with career cards, quick stats |
| **Module** | Browse all B.Sc. Informatik modules by semester/category |
| **Karrierewege** (Careers) | Explore 117 careers, click for recommended module roadmap |
| **Roadmap** | Semester-by-semester study roadmap (Duolingo-style path) |
| **Support** | TU Darmstadt resources from the Infomappe (career entry, study success, integration) |

---

## Maintenance

### Updating the Frontend

```bash
cd frontend
# Make code changes in src/
npm run build
# Deploy the new build/ folder to the server
```

### Updating the Backend

```bash
cd backend
source venv/bin/activate
# Pull latest code
git pull
# Run migrations if models changed
python manage.py migrate
# Re-seed if data changed
python manage.py seed_data
python manage.py seed_career_offers
# Restart the service
sudo systemctl restart career-roadmap
```

### Adding New Career Paths

Career paths are seeded via `python manage.py seed_data`. To add new ones, edit the seed command at `backend/api/management/commands/seed_data.py` and re-run it.

### Adding New Support Resources

Support resources (Infomappe) are seeded via `python manage.py seed_career_offers`. Edit `backend/api/management/commands/seed_career_offers.py` to add or modify entries.

### Database Backup

```bash
# SQLite
cp backend/db.sqlite3 backup/db.sqlite3.$(date +%Y%m%d)

# PostgreSQL
pg_dump career_roadmap > backup/career_roadmap_$(date +%Y%m%d).sql
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Only 10 careers shown | `REACT_APP_API_URL` not set in build | Set `.env.production` and rebuild |
| Career roadmap empty | API call to `/careers/:id/modules/` fails | Ensure Django is running and reachable |
| Support page error | `/api/career-offers/` fails | Ensure Django is running and DB is seeded |
| CORS error in browser | Server domain not in `CORS_ALLOWED_ORIGINS` | Add domain to `settings.py` |
| 400 Bad Request | Server domain not in `ALLOWED_HOSTS` | Add domain to `settings.py` |
| Static files 404 | Reverse proxy not serving React SPA correctly | Ensure fallback to `index.html` for non-API routes |

---

## Tech Stack Summary

- **Backend:** Python 3, Django 5.2, Django REST Framework, SQLite/PostgreSQL
- **Frontend:** React 18, Axios, CSS-in-JS (inline styles)
- **Authentication:** Django Token Authentication
- **Deployment:** gunicorn + Traefik
