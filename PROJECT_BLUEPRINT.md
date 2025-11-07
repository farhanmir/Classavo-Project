# Classavo LMS - Project Blueprint

## Overview
A Learning Management System (LMS) with instructor and student roles, built with Django REST Framework (backend) and ReactJS/NextJS (frontend).

**Timeline:** 4 days
**Deliverables:** GitHub repo + 4-minute demo video

---

## 📋 Project Requirements

### Tech Stack
- **Backend:** Django REST Framework (DRF)
- **Frontend:** ReactJS or NextJS
- **Text Editor:** Plate.js (for chapter content)

### User Roles & Capabilities

#### 👨‍🏫 Instructor
- Create and manage courses
- Create chapters within courses
- Edit chapter content using Plate.js editor
- Set chapter visibility (public/private)

#### 👨‍🎓 Student
- View available courses
- Join courses
- Access and read public chapters

---

## 🏗️ System Architecture

### Backend (Django REST Framework)

#### Database Models
```
User (Django's built-in User model extended with profile)
├── Profile
│   ├── role (instructor/student)
│   └── bio (optional)

Course
├── id
├── title
├── description
├── created_by (FK to User/Instructor)
├── created_at
├── updated_at
└── students (M2M relationship)

Chapter
├── id
├── course (FK to Course)
├── title
├── content (JSON format for Plate.js editor content)
├── order (sequence in course)
├── is_public (Boolean)
├── created_at
└── updated_at

Enrollment
├── student (FK to User)
├── course (FK to Course)
└── enrolled_at

```

#### API Endpoints

**Authentication**
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout

**Courses (Public)**
- `GET /api/courses/` - List all courses
- `POST /api/courses/` - Create course (Instructor only)
- `GET /api/courses/<id>/` - Get course details
- `PUT /api/courses/<id>/` - Update course (Creator only)
- `DELETE /api/courses/<id>/` - Delete course (Creator only)

**Chapters**
- `GET /api/courses/<id>/chapters/` - List chapters in course
- `POST /api/courses/<id>/chapters/` - Create chapter (Instructor only)
- `GET /api/chapters/<id>/` - Get chapter details (public chapters visible to all, private to instructor)
- `PUT /api/chapters/<id>/` - Update chapter (Creator only)
- `DELETE /api/chapters/<id>/` - Delete chapter (Creator only)

**Enrollment**
- `POST /api/courses/<id>/enroll/` - Enroll in course (Student)
- `GET /api/my-courses/` - Get enrolled courses (Student)
- `DELETE /api/courses/<id>/unenroll/` - Unenroll from course (Student)

**User Profile**
- `GET /api/profile/` - Get current user profile
- `PUT /api/profile/` - Update profile
- `GET /api/users/<id>/` - Get public user info

#### Permissions/Access Control
- **Public views:** Course list, chapter content (if public)
- **Authenticated:** Enroll, view enrolled courses
- **Instructor only:** Create courses, create chapters, edit chapter visibility
- **Creator only:** Edit/delete their own courses and chapters

---

### Frontend (React/Next.js)

#### Pages/Routes

**Public Routes**
- `/` - Landing page with course listings
- `/courses` - Browse all courses
- `/courses/:id` - Course detail page
- `/chapters/:id` - Chapter content viewer

**Authentication Routes**
- `/auth/register` - Registration form
- `/auth/login` - Login form

**Instructor Routes**
- `/dashboard` - Instructor dashboard
- `/create-course` - Create new course form
- `/courses/:id/manage` - Manage course (edit, add chapters, visibility)
- `/courses/:id/chapters/:chapterId/edit` - Edit chapter content with Plate.js editor

**Student Routes**
- `/my-courses` - Student's enrolled courses
- `/courses/:id/chapters` - View chapters of enrolled course

#### Components

**Global Components**
- `Header/Navigation` - Navigation bar with auth status
- `Footer` - Footer component
- `AuthGuard` - Protected route wrapper

**Pages**
- `HomePage` - Landing page
- `CourseListPage` - Browse courses
- `CourseDetailPage` - View course info & enrollment button
- `DashboardPage` - User dashboard (different for instructor/student)
- `CourseManagePage` - Instructor course management
- `ChapterEditorPage` - Plate.js editor for chapter content
- `ChapterViewPage` - Read chapter content
- `ProfilePage` - User profile settings

**Reusable Components**
- `CourseCard` - Display course in a card
- `ChapterList` - List chapters
- `PlateEditor` - Plate.js editor wrapper
- `Modal` - Generic modal
- `Button` - Styled button component
- `Form` - Form components (Input, Textarea, Select, etc.)

#### State Management
- **React Context API** or **Zustand** for user auth state
- **React Query/TanStack Query** for server state management
- **Local state** for form handling

---

## 📅 Development Timeline (4 Days)

### Day 1: Project Setup & Backend Foundation
- [x] Initialize Django project structure
- [x] Set up models (User Profile, Course, Chapter, Enrollment)
- [x] Configure Django settings (CORS, JWT auth)
- [x] Create basic serializers
- [x] Implement authentication endpoints

### Day 2: Backend API Development
- [x] Complete all API endpoints
- [x] Implement permissions/access control
- [x] Add pagination for course lists
- [x] Add filters (by instructor, by visibility)
- [x] Basic testing of endpoints

### Day 3: Frontend Setup & Core Features
- [x] Initialize React/Next.js project
- [x] Set up routing
- [x] Create layout components (Header, Footer, Navigation)
- [x] Implement authentication UI (login, register)
- [x] Set up API client/fetching logic
- [x] Create course browsing pages

### Day 4: Advanced Features & Polish
- [x] Integrate Plate.js editor for chapter content
- [x] Implement course management for instructors
- [x] Student enrollment and course viewing
- [x] Chapter visibility management
- [x] Error handling and loading states
- [x] Deploy both frontend and backend
- [x] Final testing and bug fixes

---

## 🚀 Deployment Strategy

### Backend Deployment
- **Option 1:** Render.com (free tier)
- **Option 2:** Railway.app
- **Option 3:** Heroku (with paid account)

### Frontend Deployment
- **Option 1:** Vercel (best for Next.js)
- **Option 2:** Netlify (great for React)
- **Option 3:** GitHub Pages

---

## 📦 Technology Stack Details

### Backend Libraries
```
djangorestframework
django-cors-headers
djangorestframework-simplejwt
python-dotenv
psycopg2 (PostgreSQL adapter)
```

### Frontend Libraries (React)
```
react-router-dom (routing)
axios (API client)
zustand or context-api (state management)
react-query (server state)
@udecode/plate (Plate.js editor)
tailwindcss (styling)
react-icons (icons)
```

### Frontend Libraries (Next.js)
```
next
axios
zustand
swr or react-query
@udecode/plate
tailwindcss
```

---

## 🔐 Security Considerations

1. **Authentication:** JWT tokens (SimplJWT for Django)
2. **Authorization:** Role-based access control
3. **CORS:** Only allow frontend origin
4. **Input validation:** Server-side validation for all inputs
5. **Environment variables:** Use .env files (not committed to git)
6. **Password hashing:** Django's built-in password hashing

---

## ✅ Testing Checklist

### Backend
- [x] User registration and login
- [x] Course creation by instructor
- [x] Course listing and filtering
- [x] Chapter creation and editing
- [x] Chapter visibility (public/private)
- [x] Student enrollment
- [x] Permission checks

### Frontend
- [x] User can register and login
- [x] Course browsing works
- [x] Enrollment functionality
- [x] Instructor can create courses
- [x] Instructor can add chapters with editor
- [x] Student can view public chapters
- [x] Responsive design

---

## 📹 Video Deliverable (4 minutes)

**Structure:**
1. **Intro (30 seconds)** - Brief introduction and project overview
2. **Architecture Overview (1 minute)** - Show database schema, API structure
3. **Feature Demo (2 minutes)** - Show:
   - User registration
   - Instructor creating a course
   - Instructor adding chapters with Plate.js editor
   - Instructor setting visibility
   - Student viewing courses
   - Student enrolling in course
   - Student viewing chapters
4. **Conclusion (30 seconds)** - Key features and tech stack summary

**Recording Tools:** Loom or OBS

---

## 🎯 Key Success Metrics

- ✅ All requirements implemented
- ✅ Clean, readable code with comments
- ✅ Proper error handling
- ✅ Responsive UI
- ✅ Functional video demonstration
- ✅ GitHub repo with clear documentation
- ✅ Both frontend and backend deployed

---

## 📝 GitHub Repository Structure

```
classavo-lms/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── lms_project/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── api/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       └── permissions.py
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   └── .env.example
├── README.md
├── SETUP.md
└── .gitignore
```

---

## 🔗 Resources & References

- Django REST Framework: https://www.django-rest-framework.org/
- Plate.js Documentation: https://platejs.org/
- React Documentation: https://react.dev/
- Next.js Documentation: https://nextjs.org/
- JWT Authentication: https://django-rest-framework-simplejwt.readthedocs.io/

---

**Created:** November 7, 2025
**Updated:** November 7, 2025
