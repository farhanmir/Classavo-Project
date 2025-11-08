# Classavo LMS - Learning Management System

> **Software Developer Intern Assignment**  
> A full-stack Learning Management System built with Django REST Framework and Next.js

This project was developed as part of the Classavo hiring process.
## Classavo LMS — Learning Management System

A small, full-stack learning management system built with a Django REST API and a Next.js + Tailwind frontend. This repository was created as a coding exercise and demonstrates common LMS features like courses, chapters, role-based access (Instructor / Student), and a rich content editor.

Key Steps:

## Quick snapshot

- Backend: Django + Django REST Framework (API, auth, models)
- Frontend: Next.js (App Router), React, TailwindCSS
- Editor: Plate.js for rich chapter content
- Auth: JWT (access + refresh)

## Requirements

- Python 3.9+
- Node.js 18+
- pip and npm

## Run locally (Windows PowerShell)
Backend

```powershell
cd backend
python -m venv venv
# Activate the venv in PowerShell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
# copy or set environment variables (see .env.example in backend)
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Frontend

```powershell
cd frontend
npm install
# create a .env.local with at least:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev
```

Open the frontend at http://localhost:3000 and the admin at http://localhost:8000/admin.

## Project layout (high level)

- `backend/` — Django project and the `api` app that contains models, serializers, views and routes.
- `frontend/` — Next.js app (App Router) with components, pages, and a small Zustand store.
- `PROJECT_BLUEPRINT.md` — feature and data model notes.
- `SETUP.md` — longer install/troubleshooting guide.

## What the code provides

- User roles: Instructor and Student (Profile model extends Django User).
- Course and Chapter models with enrollment.
- Chapter content stored as rich JSON (Plate.js) and editable in the UI.
- JWT-based authentication and role-based permissions on API endpoints.
- A small, mobile-friendly UI using TailwindCSS and server-state caching with TanStack Query.

## API highlights

Common endpoints you will use from the frontend:

- `POST /api/auth/register/` — create an account
- `POST /api/auth/login/` — get tokens
- `GET /api/courses/` — list courses
- `POST /api/courses/{id}/enroll/` — enroll in a course
- `GET /api/chapters/{id}/` — read chapter (access depends on enrollment / public flag)

See the backend `api` app for complete routes and permission checks.

## Notes for contributors

- Follow the Python and JavaScript style already in this repo.
- Backend migrations live under `backend/api/migrations` — run `python manage.py migrate` after pulling changes.
- Keep secrets out of the repo; use `.env` / `.env.local` as appropriate.

## Testing

- Backend unit tests (if any):

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py test
```

- Frontend tests (if configured):

```powershell
cd frontend
npm run test
```

## Where to look next

- Backend API code: `backend/api/` (models, serializers, views)
- Frontend pages & components: `frontend/src/app` and `frontend/src/components`
- Editor integration: `frontend/src/components/PlateEditor.jsx`