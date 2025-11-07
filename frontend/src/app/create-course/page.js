'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import AuthGuard from '@/components/AuthGuard';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';

function CreateCoursePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/courses/', data);
      return response.data;
    },
    onSuccess: (data) => {
      router.push(`/courses/${data.id}/manage`);
    },
    onError: (error) => {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: 'Failed to create course. Please try again.' });
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    createMutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Create New Course
        </h1>

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Course Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Enter a descriptive course title"
            required
          />

          <Textarea
            label="Course Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Describe what students will learn in this course"
            rows={6}
            required
          />

          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              variant="primary"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Course'}
            </Button>

            <Link href="/dashboard">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> After creating your course, you'll be able to add
            chapters and manage course content from the course management page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CreateCoursePageWrapper() {
  return (
    <AuthGuard requireAuth={true} requiredRole="instructor">
      <CreateCoursePage />
    </AuthGuard>
  );
}
