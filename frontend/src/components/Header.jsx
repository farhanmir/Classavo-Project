'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useAuthStore from '@/store/authStore';

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Classavo LMS
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/courses" className="text-gray-700 hover:text-blue-600">
              Courses
            </Link>

            {isAuthenticated ? (
              <>
                {user?.profile?.role === 'student' && (
                  <Link href="/my-courses" className="text-gray-700 hover:text-blue-600">
                    My Courses
                  </Link>
                )}

                {user?.profile?.role === 'instructor' && (
                  <>
                    <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                      Dashboard
                    </Link>
                    <Link href="/create-course" className="text-gray-700 hover:text-blue-600">
                      Create Course
                    </Link>
                  </>
                )}

                <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            <Link
              href="/courses"
              className="block text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Courses
            </Link>

            {isAuthenticated ? (
              <>
                {user?.profile?.role === 'student' && (
                  <Link
                    href="/my-courses"
                    className="block text-gray-700 hover:text-blue-600 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Courses
                  </Link>
                )}

                {user?.profile?.role === 'instructor' && (
                  <>
                    <Link
                      href="/dashboard"
                      className="block text-gray-700 hover:text-blue-600 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/create-course"
                      className="block text-gray-700 hover:text-blue-600 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Create Course
                    </Link>
                  </>
                )}

                <Link
                  href="/profile"
                  className="block text-gray-700 hover:text-blue-600 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block text-gray-700 hover:text-blue-600 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
