'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/axios';
import AuthGuard from '@/components/AuthGuard';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

function CourseManagePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const courseId = params.id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState(null);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await api.get(`/courses/${courseId}/`);
      setTitle(response.data.title);
      setDescription(response.data.description);
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

  const updateCourseMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put(`/courses/${courseId}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['course', courseId]);
      alert('Course updated successfully!');
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/courses/${courseId}/`);
    },
    onSuccess: () => {
      router.push('/dashboard');
    },
  });

  const deleteChapterMutation = useMutation({
    mutationFn: async (chapterId) => {
      await api.delete(`/chapters/${chapterId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chapters', courseId]);
      setChapterToDelete(null);
    },
  });

  const handleSaveCourse = (e) => {
    e.preventDefault();
    updateCourseMutation.mutate({ title, description });
  };

  const handleDeleteCourse = () => {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      deleteCourseMutation.mutate();
    }
  };

  const handleDeleteChapter = (chapter) => {
    setChapterToDelete(chapter);
    setShowDeleteModal(true);
  };

  const confirmDeleteChapter = () => {
    if (chapterToDelete) {
      deleteChapterMutation.mutate(chapterToDelete.id);
    }
    setShowDeleteModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/courses/${courseId}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Course
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Manage Course
      </h1>

      {/* Course Edit Form */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Course Details
        </h2>

        <form onSubmit={handleSaveCourse}>
          <Input
            label="Course Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            label="Course Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            required
          />

          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={updateCourseMutation.isPending}
              variant="primary"
            >
              {updateCourseMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>

            <Button
              type="button"
              onClick={handleDeleteCourse}
              disabled={deleteCourseMutation.isPending}
              variant="danger"
            >
              {deleteCourseMutation.isPending ? 'Deleting...' : 'Delete Course'}
            </Button>
          </div>
        </form>
      </div>

      {/* Chapters Management */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Manage Chapters
          </h2>
          <Link href={`/courses/${courseId}/chapters/new/edit`}>
            <Button variant="primary">Add New Chapter</Button>
          </Link>
        </div>

        {chapters.length > 0 ? (
          <div className="space-y-4">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500 font-semibold">
                      {chapter.order}.
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {chapter.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          chapter.is_public
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {chapter.is_public ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/courses/${courseId}/chapters/${chapter.id}/edit`}
                  >
                    <Button variant="secondary">Edit</Button>
                  </Link>
                  <Button
                    onClick={() => handleDeleteChapter(chapter)}
                    variant="danger"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No chapters yet. Add your first chapter to get started!
          </p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Chapter"
      >
        <p className="mb-4">
          Are you sure you want to delete the chapter &quot;{chapterToDelete?.title}&quot;?
          This action cannot be undone.
        </p>
        <div className="flex space-x-4">
          <Button
            onClick={confirmDeleteChapter}
            disabled={deleteChapterMutation.isPending}
            variant="danger"
          >
            {deleteChapterMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
          <Button
            onClick={() => setShowDeleteModal(false)}
            variant="secondary"
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default function ManageCoursePage() {
  return (
    <AuthGuard requireAuth={true} requiredRole="instructor">
      <CourseManagePage />
    </AuthGuard>
  );
}
