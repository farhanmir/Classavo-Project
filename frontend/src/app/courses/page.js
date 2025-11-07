'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import CourseCard from '@/components/CourseCard';
import Input from '@/components/Input';

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['courses', page],
    queryFn: async () => {
      const response = await api.get(`/courses/?page=${page}`);
      return response.data;
    },
  });

  const courses = data?.results || data || [];
  
  // Client-side filtering
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">All Courses</h1>
        
        {/* Search Bar */}
        <div className="max-w-md">
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-0"
          />
        </div>
      </div>

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
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? 'No courses found matching your search.'
                  : 'No courses available yet.'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {data?.next || data?.previous ? (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!data?.previous}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-700">Page {page}</span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!data?.next}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
