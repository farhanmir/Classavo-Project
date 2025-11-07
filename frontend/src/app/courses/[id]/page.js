'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import ChapterList from '@/components/ChapterList';
import Button from '@/components/Button';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const courseId = params.id;

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await api.get(`/courses/${courseId}/`);
      return response.data;
    },
  });

  const { data: chapters = [] } = useQuery({
    queryKey: ['chapters', courseId],
    queryFn: async () => {
      const response = await api.get(`/chapters/?course_id=${courseId}`);
      return response.data.results || response.data;
    },
    enabled: !!courseId,
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/courses/${courseId}/enroll/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['course', courseId]);
    },
  });

  const unenrollMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/courses/${courseId}/unenroll/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['course', courseId]);
    },
  });

  const handleEnroll = () => {
    enrollMutation.mutate();
  };

  const handleUnenroll = () => {
    if (confirm('Are you sure you want to unenroll from this course?')) {
      unenrollMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error loading course. Please try again later.</p>
      </div>
    );
  }

  const isInstructor = user?.id === course?.created_by?.id;
  const isEnrolled = course?.is_enrolled;
  const isStudent = user?.profile?.role === 'student';

  return (
    <div>
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {course.title}
        </h1>

        <div className="flex items-center text-gray-600 mb-4 space-x-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>
              Instructor:{' '}
              <Link
                href={`/users/${course.created_by?.id}`}
                className="text-blue-600 hover:underline"
              >
                {course.created_by?.username}
              </Link>
            </span>
          </div>

          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>{course.student_count} students enrolled</span>
          </div>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">
          {course.description}
        </p>

        <div className="flex space-x-4">
          {isInstructor && (
            <Link href={`/courses/${courseId}/manage`}>
              <Button variant="primary">Manage Course</Button>
            </Link>
          )}

          {isStudent && !isEnrolled && (
            <Button
              onClick={handleEnroll}
              disabled={enrollMutation.isPending}
              variant="primary"
            >
              {enrollMutation.isPending ? 'Enrolling...' : 'Enroll in Course'}
            </Button>
          )}

          {isStudent && isEnrolled && (
            <Button
              onClick={handleUnenroll}
              disabled={unenrollMutation.isPending}
              variant="danger"
            >
              {unenrollMutation.isPending ? 'Unenrolling...' : 'Unenroll'}
            </Button>
          )}
        </div>
      </div>

      {/* Chapters Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Course Chapters
        </h2>

        <ChapterList
          chapters={chapters}
          courseId={courseId}
          isInstructor={isInstructor}
          isEnrolled={isEnrolled}
        />
      </div>
    </div>
  );
}
