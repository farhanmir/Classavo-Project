'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id;

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}/`);
      return response.data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-red-600">Unable to load user profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
      <p className="text-gray-700 mb-4">{user.first_name} {user.last_name}</p>

      <div className="space-y-2">
        <div>
          <strong>Role: </strong>
          <span>{user.role || user.profile?.role || 'N/A'}</span>
        </div>
        <div>
          <strong>Email: </strong>
          <span>{user.email || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
