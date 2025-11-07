'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/axios';
import useAuthStore from '@/store/authStore';
import PlateEditor from '@/components/PlateEditor';

export default function ChapterViewerPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const { id: courseId, chapterId } = params;

  const { data: chapter, isLoading, error } = useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: async () => {
      const response = await api.get(`/chapters/${chapterId}/`);
      return response.data;
    },
  });

  const { data: chapters = [] } = useQuery({
    queryKey: ['chapters', courseId],
    queryFn: async () => {
      const response = await api.get(`/chapters/?course_id=${courseId}`);
      return response.data.results || response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    const status = error.response?.status;
    
    if (status === 403) {
      return (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="mb-4">
            This chapter is private. You need to enroll in the course to access it.
          </p>
          <Link
            href={`/courses/${courseId}`}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Course
          </Link>
        </div>
      );
    }

    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error loading chapter. Please try again later.</p>
      </div>
    );
  }

  const currentIndex = chapters.findIndex((ch) => ch.id === parseInt(chapterId));
  const previousChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const isInstructor = user?.id === chapter?.course?.created_by?.id;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 text-gray-600">
        <Link href={`/courses/${courseId}`} className="hover:text-blue-600">
          {chapter.course_title}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800">{chapter.title}</span>
      </div>

      {/* Chapter Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            {chapter.title}
          </h1>
          {isInstructor && (
            <Link href={`/courses/${courseId}/chapters/${chapterId}/edit`}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Edit Chapter
              </button>
            </Link>
          )}
        </div>

        <div className="text-sm text-gray-500 mb-6">
          Chapter {chapter.order}
          {chapter.is_public && (
            <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              Public
            </span>
          )}
        </div>

        {/* Chapter Content */}
        <div className="prose max-w-none">
          <PlateEditor initialValue={chapter.content} readOnly={true} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mb-8">
        {previousChapter ? (
          <Link
            href={`/courses/${courseId}/chapters/${previousChapter.id}`}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous: {previousChapter.title}
          </Link>
        ) : (
          <div></div>
        )}

        <Link
          href={`/courses/${courseId}`}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Back to Course
        </Link>

        {nextChapter ? (
          <Link
            href={`/courses/${courseId}/chapters/${nextChapter.id}`}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            Next: {nextChapter.title}
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
