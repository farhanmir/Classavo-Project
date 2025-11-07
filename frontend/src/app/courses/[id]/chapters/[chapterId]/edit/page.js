'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/axios';
import AuthGuard from '@/components/AuthGuard';
import Input from '@/components/Input';
import Button from '@/components/Button';
import PlateEditor from '@/components/PlateEditor';

function ChapterEditPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id: courseId, chapterId } = params;

  const [title, setTitle] = useState('');
  const [order, setOrder] = useState(1);
  const [isPublic, setIsPublic] = useState(false);
  const [content, setContent] = useState('');

  const isNewChapter = chapterId === 'new';

  const { isLoading } = useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: async () => {
      const response = await api.get(`/chapters/${chapterId}/`);
      setTitle(response.data.title);
      setOrder(response.data.order);
      setIsPublic(response.data.is_public);
      setContent(response.data.content);
      return response.data;
    },
    enabled: !isNewChapter,
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (isNewChapter) {
        const response = await api.post('/chapters/', {
          ...data,
          course: courseId,
        });
        return response.data;
      } else {
        const response = await api.put(`/chapters/${chapterId}/`, data);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chapters', courseId]);
      alert('Chapter saved successfully!');
      router.push(`/courses/${courseId}/manage`);
    },
    onError: (error) => {
      alert('Error saving chapter: ' + (error.response?.data?.detail || error.message));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/chapters/${chapterId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chapters', courseId]);
      router.push(`/courses/${courseId}/manage`);
    },
  });

  const handleSave = (e) => {
    e.preventDefault();
    saveMutation.mutate({
      title,
      order: parseInt(order, 10),
      is_public: isPublic,
      content: typeof content === 'string' ? content : JSON.stringify(content),
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this chapter?')) {
      deleteMutation.mutate();
    }
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
          href={`/courses/${courseId}/manage`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Course Management
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {isNewChapter ? 'Create New Chapter' : 'Edit Chapter'}
      </h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSave}>
          <Input
            label="Chapter Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Order"
            name="order"
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            min="1"
            required
          />

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Make this chapter public (visible to non-enrolled users)
              </span>
            </label>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chapter Content
            </label>
            <PlateEditor
              initialValue={content}
              onChange={setContent}
              readOnly={false}
            />
          </div>

          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              variant="primary"
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Chapter'}
            </Button>

            <Link href={`/courses/${courseId}/manage`}>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>

            {!isNewChapter && (
              <Button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                variant="danger"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Chapter'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ChapterEditPageWrapper() {
  return (
    <AuthGuard requireAuth={true} requiredRole="instructor">
      <ChapterEditPage />
    </AuthGuard>
  );
}
