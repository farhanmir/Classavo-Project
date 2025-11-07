# Classavo LMS - Setup Guide

> **Software Developer Intern Assignment - Installation Instructions**

This guide will help you set up and run the Classavo Learning Management System locally for evaluation.

## Prerequisites

Ensure you have the following installed on your system:

- **Python 3.9+** (for backend)
- **Node.js 18+** (for frontend)
- **pip** (Python package manager)
- **npm** or **yarn** (JavaScript package manager)
- **Git** (version control)

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Copy from example
cp .env.example .env
```

Edit `.env` and update the following:

```env
# Generate a new secret key
# Run: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
DJANGO_SECRET_KEY=your-generated-secret-key-here

DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 5. Run Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser (Admin Account)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### 7. Start Backend Server

```bash
python manage.py runserver
```

The backend will be available at **http://localhost:8000/**

- Admin interface: **http://localhost:8000/admin/**
- API root: **http://localhost:8000/api/**

## Frontend Setup

### 1. Navigate to Frontend Directory

Open a **new terminal window** and navigate to the frontend:

```bash
cd frontend
```

### 2. Install Node Dependencies

```bash
npm install
```

This may take a few minutes.

### 3. Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```bash
# Create the file
touch .env.local  # macOS/Linux
# OR
type nul > .env.local  # Windows
```

Add the following content:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at **http://localhost:3000/**

## Running Both Servers

To run the complete application, you need **both** servers running simultaneously:

1. **Terminal 1** (Backend):
   ```bash
   cd backend
   venv\Scripts\activate  # or source venv/bin/activate on macOS/Linux
   python manage.py runserver
   ```

2. **Terminal 2** (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

## Initial Testing

### 1. Create Test Data via Admin

1. Open **http://localhost:8000/admin/**
2. Log in with your superuser credentials
3. You can create additional test users or use the registration flow

### 2. Test the Application Flow

1. Open **http://localhost:3000/**
2. Register a new account (choose Instructor or Student role)
3. Test the implemented features based on your role

## Testing Key Workflows

### Student Workflow

1. Register as a student at `/auth/register`
2. Browse courses at `/courses`
3. Click on a course to view details
4. Enroll in the course
5. View chapters (public chapters visible without enrollment)
6. Access enrolled courses at `/my-courses`

### Instructor Workflow

1. Register as an instructor at `/auth/register`
2. Go to dashboard at `/dashboard`
3. Click "Create New Course"
4. Fill in course details and save
5. Click "Manage" on the created course
6. Add chapters with title, order, and content
7. Set chapters as public/private
8. View course as a student would

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'rest_framework'`
**Solution**: Ensure virtual environment is activated and dependencies are installed:
```bash
pip install -r requirements.txt
```

**Problem**: Database errors on migration
**Solution**: Delete `db.sqlite3` and migrations, then re-run:
```bash
python manage.py makemigrations
python manage.py migrate
```

**Problem**: CORS errors from frontend
**Solution**: Check `CORS_ALLOWED_ORIGINS` in `.env` includes `http://localhost:3000`

### Frontend Issues

**Problem**: `Module not found` errors
**Solution**: Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Problem**: API calls failing with 404
**Solution**: Verify `NEXT_PUBLIC_API_URL` in `.env.local` is correct and backend is running

**Problem**: Authentication not persisting
**Solution**: Check browser console for localStorage errors, ensure tokens are being saved

**Problem**: Blank page or errors
**Solution**: Check browser console for errors, verify both servers are running

### Common Issues

**Port Already in Use**
- Backend (8000): Stop other Django processes or use `python manage.py runserver 8001`
- Frontend (3000): Use `npm run dev -- -p 3001`

**Database Locked (SQLite)**
- Close any database browser tools
- Restart the backend server

## Development Tips

### Backend

- Use Django admin for quick data management
- Check API responses at `/api/` endpoints
- View logs in terminal for debugging
- Use `python manage.py shell` for testing models

### Frontend

- Use React DevTools for component debugging
- Check Network tab for API calls
- Use TanStack Query DevTools (can be added)
- Hot reload is enabled - changes reflect immediately

## Production Deployment

### Backend (Django)

1. Set `DEBUG=False` in production `.env`
2. Generate a strong `DJANGO_SECRET_KEY`
3. Use PostgreSQL instead of SQLite
4. Set proper `ALLOWED_HOSTS`
5. Collect static files: `python manage.py collectstatic`
6. Use production-grade server (Gunicorn, uWSGI)
7. Set up HTTPS

### Frontend (Next.js)

1. Build production version: `npm run build`
2. Update `NEXT_PUBLIC_API_URL` to production API
3. Deploy to Vercel, Netlify, or custom server
4. Ensure CORS is configured on backend for production domain

## Project Structure Overview

```
Classavo Project/
├── backend/                 # Django REST API
│   ├── api/                # Main API app
│   ├── lms_project/        # Django project settings
│   ├── manage.py           # Django CLI
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Environment variables (not in git)
│
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Utilities
│   │   └── store/         # State management
│   ├── package.json       # Node dependencies
│   └── .env.local         # Environment variables (not in git)
│
├── PROJECT_BLUEPRINT.md   # Detailed project specifications
├── SETUP.md              # This file
└── README.md             # Project overview
```

## Next Steps

After successful setup:

1. Review the `PROJECT_BLUEPRINT.md` for detailed specifications
2. Explore the codebase to understand the architecture
3. Create test courses and chapters
4. Test the complete user journey
5. Customize as needed for your use case

## Support & Resources

- **Backend API Docs**: See `backend/README.md`
- **Frontend Docs**: See `frontend/README.md`
- **Django Documentation**: https://docs.djangoproject.com/
- **Next.js Documentation**: https://nextjs.org/docs
- **TanStack Query**: https://tanstack.com/query/latest

## Security Checklist

Before deploying to production:

- [ ] Change default `DJANGO_SECRET_KEY`
- [ ] Set `DEBUG=False` in production
- [ ] Use strong passwords for admin accounts
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Keep dependencies updated
- [ ] Use environment variables for sensitive data
- [ ] Enable JWT token blacklist
- [ ] Review and test all security settings
