# Classavo LMS - Frontend

Modern React-based frontend for the Classavo Learning Management System built with Next.js 14+ and the App Router.

## Overview

The frontend is a responsive, single-page application providing an intuitive interface for both students and instructors. Built with modern React patterns including hooks, context, and server/client components.

### Architecture

- **Next.js 14+ App Router** - File-based routing with server and client components
- **TailwindCSS** - Utility-first CSS framework for responsive design
- **TanStack Query (React Query)** - Powerful server state management
- **Zustand** - Lightweight state management for authentication
- **Axios** - HTTP client with interceptors for JWT handling
- **Plate.js** - Rich text editor for chapter content (simplified implementation)

## Features

- 🔐 JWT-based authentication with automatic token refresh
- 👤 Role-based access control (Student/Instructor)
- 📚 Course browsing and enrollment
- 📖 Chapter viewing with rich content
- ✏️ Course and chapter management (instructors)
- 📊 Instructor dashboard with statistics
- 🎨 Fully responsive design
- ⚡ Optimistic UI updates
- 🔄 Automatic cache invalidation

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:8000

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create `.env.local` file with:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.js          # Root layout with providers
│   │   ├── page.js            # Home page
│   │   ├── globals.css        # Global styles
│   │   ├── auth/              # Authentication pages
│   │   ├── courses/           # Course pages
│   │   ├── dashboard/         # Instructor dashboard
│   │   ├── profile/           # User profile
│   │   ├── my-courses/        # Student enrolled courses
│   │   └── create-course/     # Create new course
│   │
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities
│   └── store/                 # State management
│
├── .env.local                 # Environment variables (not in git)
└── package.json               # Dependencies
```

## Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # Lint code
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/api` |

## Tech Stack

- **Next.js 14.2+** - React framework with App Router
- **React 18+** - UI library
- **TailwindCSS 3.4+** - Utility-first CSS
- **TanStack Query v5** - Server state management
- **Zustand 4+** - Client state management
- **Axios 1.6+** - HTTP client

## Support

For issues or questions, please open an issue on the project repository.

