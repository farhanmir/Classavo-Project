# Classavo LMS - Learning Management System

> **Software Developer Intern Assignment**  
> A full-stack Learning Management System built with Django REST Framework and Next.js

This project was developed as part of the Classavo hiring process to demonstrate proficiency in full-stack development, API design, and modern web technologies.

## 📋 Assignment Overview

This LMS application was built to meet the following requirements:
- Support for two user roles: **Instructor** and **Student**
- Course and chapter management system
- Rich text editing with Plate.js
- Chapter visibility controls (public/private)
- Course enrollment functionality
- RESTful API with JWT authentication

## 🌟 Implemented Features

### For Students
- 📚 **Browse & Enroll** - Discover courses and enroll with one click
- 📖 **Learn** - Access course chapters with rich content
- 📊 **Track Progress** - View enrolled courses and learning history
- 🔒 **Secure Access** - Chapter visibility based on enrollment status

### For Instructors
- ✏️ **Create Courses** - Build comprehensive courses with descriptions
- 📝 **Manage Content** - Add, edit, and organize chapters
- 👥 **Track Students** - Monitor enrollment and engagement
- 🎯 **Control Access** - Set chapters as public or private
- 📊 **Dashboard** - Overview of courses and student statistics

### Technical Features
- 🔐 **JWT Authentication** - Secure token-based authentication with automatic refresh
- 👤 **Role-Based Access** - Separate permissions for students and instructors
- 🎨 **Responsive Design** - Mobile-first UI with TailwindCSS
- ⚡ **Real-time Updates** - Optimistic UI updates and cache management
- 🔄 **RESTful API** - Well-documented API endpoints
- 📦 **Rich Content Editor** - Plate.js integration for chapter content

## 🛠️ Tech Stack

### Backend
- **Django 5.2.8** - Python web framework
- **Django REST Framework** - API toolkit
- **Simple JWT** - JWT authentication
- **PostgreSQL/SQLite** - Database
- **CORS Headers** - Cross-origin support

### Frontend
- **Next.js 14+** - React framework with App Router
- **React 18+** - UI library
- **TailwindCSS 3.4+** - Utility-first CSS
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client
- **Plate.js** - Rich text editor

## 🚀 Quick Start

> **Note**: This is a demonstration project. See [SETUP.md](./SETUP.md) for complete installation instructions.

### Prerequisites
- Python 3.9+
- Node.js 18+
- pip and npm

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend
npm install
# Create .env.local with: NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin

## 📁 Project Structure

```
Classavo Project/
├── backend/                 # Django REST API
│   ├── api/                # Main API application
│   │   ├── models.py       # Database models
│   │   ├── serializers.py  # DRF serializers
│   │   ├── views.py        # API views
│   │   ├── permissions.py  # Custom permissions
│   │   └── urls.py         # API routes
│   ├── lms_project/        # Django project settings
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Utilities (axios config)
│   │   └── store/         # Zustand stores
│   └── package.json       # Node dependencies
│
├── PROJECT_BLUEPRINT.md   # Detailed specifications
├── SETUP.md              # Complete setup guide
└── README.md             # This file
```

## 🎯 Key Workflows

### Student Journey
1. Register as a student → Browse courses → Enroll → View chapters → Learn

### Instructor Journey
1. Register as instructor → Create course → Add chapters → Manage content → Track students

## 📚 Database Models

### Profile
- Links to Django User model
- Fields: `role` (student/instructor), `bio`

### Course
- Fields: `title`, `description`, `created_by`, timestamps
- Relationships: Many students through Enrollment

### Chapter
- Fields: `title`, `content` (JSON), `order`, `is_public`, timestamps
- Belongs to a Course

### Enrollment
- Links Student to Course
- Tracks enrollment date
- Unique constraint on student-course pairs

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `POST /api/auth/token/refresh/` - Refresh token

### Courses
- `GET /api/courses/` - List courses
- `POST /api/courses/` - Create course (instructor)
- `GET /api/courses/{id}/` - Get course details
- `PUT /api/courses/{id}/` - Update course (owner)
- `DELETE /api/courses/{id}/` - Delete course (owner)
- `POST /api/courses/{id}/enroll/` - Enroll in course
- `DELETE /api/courses/{id}/unenroll/` - Unenroll

### Chapters
- `GET /api/chapters/` - List chapters
- `POST /api/chapters/` - Create chapter (course owner)
- `GET /api/chapters/{id}/` - Get chapter (if enrolled)
- `PUT /api/chapters/{id}/` - Update chapter (course owner)
- `DELETE /api/chapters/{id}/` - Delete chapter (course owner)

### Profile
- `GET /api/profile/` - Get current user profile
- `PUT /api/profile/` - Update profile

### Student
- `GET /api/my-courses/` - Get enrolled courses

## 🎨 Frontend Features

- **Responsive Design** - Works on mobile, tablet, and desktop
- **Dark/Light Mode Ready** - TailwindCSS theming support
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - User-friendly error messages
- **Optimistic Updates** - Instant UI feedback
- **Protected Routes** - AuthGuard component for access control
- **Form Validation** - Client and server-side validation

## 🔒 Security Features

- JWT token authentication with refresh
- Token blacklist on logout
- Role-based permissions
- CORS configuration
- Environment variable management
- SQL injection protection (Django ORM)
- XSS protection (React escaping)

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup guide with troubleshooting
- **[backend/README.md](./backend/README.md)** - Backend API documentation
- **[frontend/README.md](./frontend/README.md)** - Frontend architecture guide
- **[PROJECT_BLUEPRINT.md](./PROJECT_BLUEPRINT.md)** - Detailed specifications

## 🚦 Project Status

This project demonstrates:
- ✅ Full-stack development capabilities (Django + React/Next.js)
- ✅ RESTful API design and implementation
- ✅ Authentication and authorization (JWT, role-based access)
- ✅ Database modeling and relationships
- ✅ Modern frontend development (React hooks, state management)
- ✅ Responsive UI design with TailwindCSS
- ✅ Git version control and project organization

## 🧪 Testing the Application

### Test Accounts
After running migrations and creating a superuser, you can:
1. Register as an Instructor to create and manage courses
2. Register as a Student to enroll and view content
3. Use the Django admin panel to view database records

## 🧪 Testing the Application

### Test Accounts
After running migrations and creating a superuser, you can:
1. Register as an Instructor to create and manage courses
2. Register as a Student to enroll and view content
3. Use the Django admin panel to view database records

### Manual Testing
```bash
# Backend tests (if implemented)
cd backend
python manage.py test

# Frontend tests (if implemented)
cd frontend
npm run test
```

## � Design Decisions

### Why Django REST Framework?
- Robust authentication system out of the box
- Built-in serialization and validation
- Excellent documentation and community support
- Perfect for building secure APIs quickly

### Why Next.js?
- Server-side rendering for better SEO
- File-based routing simplifies organization
- Built-in API routes (though using separate backend)
- Excellent developer experience

### Architecture Choices
- **JWT Authentication**: Stateless, scalable authentication
- **Role-based Permissions**: Clean separation of instructor/student capabilities
- **Zustand for State**: Lightweight alternative to Redux
- **TanStack Query**: Powerful caching and synchronization
- **Component-based UI**: Reusable, maintainable frontend code

## � Documentation Structure

- **[README.md](./README.md)** - Project overview (this file)
- **[SETUP.md](./SETUP.md)** - Complete installation guide
- **[PROJECT_BLUEPRINT.md](./PROJECT_BLUEPRINT.md)** - Detailed specifications
- **[backend/README.md](./backend/README.md)** - Backend API documentation
- **[frontend/README.md](./frontend/README.md)** - Frontend architecture

## About This Project

This Learning Management System was developed as part of the Classavo Software Developer Intern hiring process. The project demonstrates:

- Strong understanding of full-stack web development
- Ability to work with modern frameworks and libraries
- Clean code organization and documentation
- Problem-solving and feature implementation skills