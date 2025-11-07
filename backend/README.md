# Classavo LMS - Backend

Django REST Framework backend for the Classavo Learning Management System.

## Features

- **JWT Authentication:** Secure token-based authentication using Simple JWT
- **Role-Based Access Control:** Instructor and Student roles with different permissions
- **Course Management:** Full CRUD operations for courses and chapters
- **Enrollment System:** Students can enroll/unenroll from courses
- **Rich Content Editor:** Chapter content stored as JSON for Plate.js integration
- **RESTful API:** Well-structured API endpoints following REST principles

## Tech Stack

- **Django 5.2.8** - Python web framework
- **Django REST Framework** - API toolkit
- **Simple JWT** - JWT authentication
- **PostgreSQL/SQLite** - Database (SQLite for dev, PostgreSQL recommended for production)
- **CORS Headers** - Cross-origin resource sharing support

## Setup Instructions

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Installation Steps

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   # Copy the example file and update with your values
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `DJANGO_SECRET_KEY` - Generate using: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
   - `DEBUG=True` for development
   - Other settings as needed

5. **Run database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create a superuser (admin account):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000/`

## Database Models

### Profile
- Links to Django's User model
- Fields: `role` (instructor/student), `bio`
- Automatically created when User is registered

### Course
- Fields: `title`, `description`, `created_by`, `students` (M2M), timestamps
- Relationships: Created by an instructor, enrolled by students

### Chapter
- Fields: `title`, `content` (JSON), `order`, `is_public`, timestamps
- Belongs to a Course
- Content stored as JSON for Plate.js editor integration

### Enrollment
- Links Student to Course
- Fields: `student`, `course`, `enrolled_at`
- Unique constraint on student-course pairs

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login and get JWT tokens
- `POST /api/auth/logout/` - Logout (blacklist refresh token)
- `POST /api/auth/token/refresh/` - Refresh access token

### Courses
- `GET /api/courses/` - List all courses
- `POST /api/courses/` - Create course (instructors only)
- `GET /api/courses/{id}/` - Get course details
- `PUT /api/courses/{id}/` - Update course (owner only)
- `DELETE /api/courses/{id}/` - Delete course (owner only)
- `POST /api/courses/{id}/enroll/` - Enroll in course (students only)
- `DELETE /api/courses/{id}/unenroll/` - Unenroll from course

### Chapters
- `GET /api/chapters/` - List chapters (with filtering)
- `POST /api/chapters/` - Create chapter (course owner only)
- `GET /api/chapters/{id}/` - Get chapter details (if enrolled or public)
- `PUT /api/chapters/{id}/` - Update chapter (course owner only)
- `DELETE /api/chapters/{id}/` - Delete chapter (course owner only)

### User Profile
- `GET /api/profile/` - Get current user profile
- `PUT /api/profile/` - Update current user profile
- `GET /api/users/{id}/` - Get public user info

### Student
- `GET /api/my-courses/` - Get enrolled courses (students only)

## Admin Interface

Access the Django admin at `http://localhost:8000/admin/` using your superuser credentials.

The admin interface provides:
- User and Profile management
- Course management with student counts
- Chapter management with ordering
- Enrollment tracking

## Testing

Run tests with:
```bash
python manage.py test
```

## Deployment Considerations

### Environment Variables for Production

Update `.env` with production values:
- Set `DEBUG=False`
- Generate a strong `DJANGO_SECRET_KEY`
- Configure `ALLOWED_HOSTS` with your domain
- Set `CORS_ALLOWED_ORIGINS` to your frontend URL
- Use PostgreSQL instead of SQLite

### Database Migration

For PostgreSQL, install `psycopg2` and configure `DATABASE_URL`:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Static Files

Collect static files for production:
```bash
python manage.py collectstatic
```

### Security Checklist

- [ ] Change SECRET_KEY
- [ ] Set DEBUG=False
- [ ] Configure ALLOWED_HOSTS
- [ ] Use HTTPS in production
- [ ] Set up proper CORS origins
- [ ] Use environment variables for sensitive data
- [ ] Enable token blacklist for JWT
- [ ] Regular security updates

## Project Structure

```
backend/
├── api/                    # Main API app
│   ├── migrations/        # Database migrations
│   ├── admin.py          # Admin interface config
│   ├── apps.py           # App configuration
│   ├── models.py         # Database models
│   ├── permissions.py    # Custom permissions
│   ├── serializers.py    # DRF serializers
│   ├── signals.py        # Django signals
│   ├── urls.py           # API URL routing
│   └── views.py          # API views
├── lms_project/          # Project settings
│   ├── settings.py       # Django settings
│   ├── urls.py           # Root URL config
│   └── wsgi.py           # WSGI config
├── manage.py             # Django management script
├── requirements.txt      # Python dependencies
└── .env                  # Environment variables (not in git)
```

## Support

For issues or questions, please open an issue on the project repository.
