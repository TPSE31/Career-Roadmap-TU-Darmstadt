# Career Roadmap Tool

A web application for TU Darmstadt B.Sc. Informatik students to explore career paths, study modules and support resources. Built as part of the TPSE31 project (Gruppe 31).

**Live:** https://fec-roadmap.precis.tu-darmstadt.de


## What the Tool Does

The Career Roadmap Tool helps students answer three questions: *What can I become?*, *What should I study?*, and *Where do I get help?*

**Home (Dashboard)**
Overview of the tool with quick links, career path cards, and key statistics (117 careers, 251 modules, 180 ECTS, 6 semesters).

**Modulkatalog (Module Catalog)**
Browse all B.Sc. Informatik modules grouped by category: Pflichtbereich, Wahlpflichtbereich, Informatik Wahlbereich, and Studium Generale. Each module shows credits, language, learning objectives and exam format.

**Karrierewege (Career Paths)**
Explore 117 career paths from Software Engineer to Quantum Computing Researcher. Click a career to see its recommended module roadmap, salary range (junior/mid/senior), and required skills. Modules are ranked by relevance score and marked as core or supplementary.

**Roadmap**
A Duolingo style semester by semester study plan showing the path from Semester 1 to the Bachelor thesis. Click a semester node to see its modules grouped by type (Pflicht, Wahlpflicht, Wahlbereich).

**Support & Ressourcen**
17 support resources from the TU Darmstadt Infomappe, organized into three categories: Studienerfolg (study success), Berufseinstieg (career entry), and Integration & Sprache (integration and language). Each resource shows the provider, description, links and contact emails.

**Language Toggle**
Every page supports German and English. The toggle is in the top right corner of the navigation bar.


## Project Structure

```
Career-Roadmap-TU-Darmstadt/
|
|   docker-compose.yml          # Production deployment config
|   .gitignore
|
|   backend/                    # Django REST API
|       manage.py
|       config/                 # Django settings, URLs, WSGI
|           settings.py
|           urls.py
|       api/                    # Main app
|           models.py           # Database models (User, Module, CareerPath, etc.)
|           views.py            # API endpoints
|           serializers.py      # JSON serialization
|           urls.py             # API URL routing
|           management/commands/ # Data seeding commands
|       requirements.txt
|
|   frontend/                   # React single page application
|       package.json
|       .env.production         # Production API URL
|       public/
|           index.html
|       src/
|           App.js              # Main app with navigation
|           components/         # Page components (Dashboard, ModuleList, etc.)
|           services/           # API client and service modules
|           data/               # Local fallback data
|           hooks/              # Custom React hooks
|
|   docs/
|       data-model/
|           career_paths.json   # 117 career paths with skills and salaries
|           modules_cleaned.json # 251 modules with career relevance scores
```


## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Axios, CSS in JS (inline styles) |
| Backend | Python 3.12, Django 5.2, Django REST Framework 3.16 |
| Database | SQLite (file based, no external DB needed) |
| Auth | Django Token Authentication |
| Deployment | Docker Compose, Traefik reverse proxy |
| Server | precis.tu-darmstadt.de (ext-52-vb) |


## Architecture

```
Browser
   |
   v
Traefik (reverse proxy, TLS)
   |
   |   /api/*  /admin/*   -->   Django backend (port 8000)
   |   /*  (everything else) -->   React frontend (port 3000)
   |
   v
Docker containers on internal-web network
```

The frontend is a React SPA served by `serve` on port 3000. It makes API calls to `/api/*` which Traefik routes to the Django backend on port 8000. The backend serves the REST API and seeds the database on startup.


## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/hello/` | GET | No | Health check |
| `/api/careers/` | GET | No | All 117 career paths |
| `/api/careers/:id/` | GET | No | Single career path details |
| `/api/careers/:id/modules/` | GET | No | Modules relevant to a career |
| `/api/modules/` | GET | No | All 251 modules |
| `/api/modules/:id/` | GET | No | Single module details |
| `/api/career-offers/` | GET | No | 17 support resources from Infomappe |
| `/api/master-programs/` | GET | No | TU Darmstadt CS Master programs |
| `/api/recommendations/` | GET | Yes | Personalized module recommendations |


## Getting It Running

### Prerequisites

You need **Docker** and **Docker Compose** installed. Nothing else.

### Step 1: Clone the Repository

```bash
git clone https://github.com/TPSE31/Career-Roadmap-TU-Darmstadt.git
cd Career-Roadmap-TU-Darmstadt
```

### Step 2: Start the Application

On the production server (with Traefik already running):

```bash
sudo docker compose up -d
```

This does everything automatically:
1. Installs Python dependencies and Node packages
2. Runs database migrations (creates tables)
3. Seeds the database with 117 careers, 251 modules, 17 support resources, and 5 master programs
4. Builds the React frontend for production
5. Starts both containers

The backend takes about 1 minute to start (installing + seeding). The frontend takes about 2 minutes (npm install + build). Once both are ready, the site is live.

### Step 3: Verify

```bash
sudo docker compose logs backend 2>&1 | tail -10
sudo docker compose logs frontend 2>&1 | tail -5
```

Backend should show `Starting development server at http://0.0.0.0:8000/`.
Frontend should show `INFO Accepting connections at http://localhost:3000`.

Test from the server:

```bash
curl -s https://fec-roadmap.precis.tu-darmstadt.de/api/careers/ | head -c 200
```

Should return JSON with career data.


## How the Deployment Works

The `docker-compose.yml` defines two services:

**backend** (Python 3.12)
Mounts `./backend` at `/app` and `./docs` at `/docs`. On startup it installs pip packages, runs migrations, seeds the database from JSON files, then starts Django. Traefik routes `/api/*` and `/admin/*` to this container on port 8000.

**frontend** (Node 20)
Mounts `./frontend` at `/app`. On startup it runs `npm install`, builds the React app with the production API URL baked in, then serves the build with `serve`. Traefik routes all other requests to this container on port 3000 (lowest priority, so `/api` always goes to backend first).

The `internal-web` Docker network connects both containers to the shared Traefik instance on the server. No ports are exposed directly; all traffic goes through Traefik with TLS.


## Database and Data Sources

The database is SQLite, stored at `backend/db.sqlite3`. It is created automatically on first startup and seeded by management commands.

**Career paths** (117 entries) come from `docs/data-model/career_paths.json`. Each career has a German and English title, description, salary range, and required skills.

**Modules** (251 entries) come from `docs/data-model/modules_cleaned.json`. Each module has its code, name, credits, category, learning content, exam form, and career relevance scores mapping it to the 117 careers.

**Support resources** (17 entries) are seeded by `seed_career_offers`. These are the yellow highlighted offers from the TU Darmstadt Infomappe, organized into studienerfolg, berufseinstieg, and integration categories.

**Master programs** (5 entries) are seeded by `seed_master_programs`. These are the CS department master programs at TU Darmstadt.

The seed commands use `update_or_create`, so they are safe to run multiple times without creating duplicates.


## Maintenance

### Updating Code

After making changes to the code:

```bash
cd /srv/tpse31/fec-roadmap/Career-Roadmap-TU-Darmstadt
git pull
sudo docker compose down
sudo docker compose up -d
```

Both containers rebuild automatically. Wait 2 minutes for the frontend build to complete.

### Adding New Career Paths

Edit `docs/data-model/career_paths.json` and add new entries following the existing format:

```json
{
  "id": "your_career_id",
  "title_en": "English Title",
  "title_de": "German Title",
  "description_en": "...",
  "description_de": "...",
  "average_salary": { "junior": 50000, "mid": 65000, "senior": 80000 },
  "required_skills": ["Skill 1", "Skill 2"]
}
```

Then redeploy. The `import_course_data` command runs on startup and picks up new entries.

### Adding New Modules

Edit `docs/data-model/modules_cleaned.json`. Each module needs a `module_code`, `name_de`, `name_en`, `credits`, `category`, and a `career_relevance` mapping:

```json
{
  "module_code": "20-00-XXXX",
  "name_de": "Modulname",
  "name_en": "Module Name",
  "credits": 5,
  "category": "Wahlpflichtbereich",
  "career_relevance": {
    "software_engineer": 80,
    "data_scientist": 40
  }
}
```

### Adding New Support Resources

Edit `backend/api/management/commands/seed_career_offers.py`. Add a new entry to the `offers_data` list following the existing format with `title_de`, `title_en`, `provider`, `category`, `description_de`, `description_en`, `links`, and `contact_emails`.

### Viewing Logs

```bash
sudo docker compose logs backend
sudo docker compose logs frontend
sudo docker compose logs -f backend    # follow live
```

### Restarting

```bash
sudo docker compose restart            # restart without rebuilding
sudo docker compose down && sudo docker compose up -d   # full restart
```

### Database Backup

```bash
cp backend/db.sqlite3 backend/db.sqlite3.backup
```

The database is recreated from JSON on every container start, so backing it up is optional. The JSON files in `docs/data-model/` are the real source of truth.

### Django Admin Panel

Accessible at `https://fec-roadmap.precis.tu-darmstadt.de/admin/`. To create an admin user:

```bash
sudo docker compose exec backend python manage.py createsuperuser
```


