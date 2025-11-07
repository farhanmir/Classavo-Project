'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import CourseCard from '@/components/CourseCard';

export default function HomePage() {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses', 'featured'],
    queryFn: async () => {
      const response = await api.get('/courses/');
      return response.data.results || response.data;
    },
  });

  const featuredCourses = courses?.slice(0, 6) || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-12 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Classavo LMS
          </h1>
          <p className="text-xl mb-8">
            Discover, learn, and grow with our comprehensive learning management system.
            Join thousands of students and instructors in their educational journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              href="/auth/register"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors border-2 border-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Featured Courses
        </h2>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md h-64 animate-pulse"
              >
                <div className="h-full bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error loading courses. Please try again later.</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {featuredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">
                  No courses available yet. Check back soon!
                </p>
              </div>
            )}

            {featuredCourses.length > 0 && (
              <div className="text-center mt-8">
                <Link
                  href="/courses"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All Courses
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
