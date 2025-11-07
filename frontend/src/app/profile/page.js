'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import AuthGuard from '@/components/AuthGuard';
import useAuthStore from '@/store/authStore';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import Button from '@/components/Button';

function ProfilePage() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    bio: '',
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/profile/');
      setFormData({
        email: response.data.email || '',
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        bio: response.data.profile?.bio || '',
      });
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put('/profile/', {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        profile: {
          bio: data.bio,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['profile']);
      updateUser(data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.profile?.bio || '',
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="primary">
              Edit Profile
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
                {user?.username}
              </div>
              <p className="mt-1 text-sm text-gray-500">Username cannot be changed</p>
            </div>

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />

              <Input
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>

            <Textarea
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={4}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 capitalize">
                {user?.profile?.role}
              </div>
              <p className="mt-1 text-sm text-gray-500">Role cannot be changed</p>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                variant="primary"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>

              <Button
                type="button"
                onClick={handleCancel}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Username</label>
              <p className="text-lg text-gray-800">{user?.username}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg text-gray-800">{user?.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">First Name</label>
                <p className="text-lg text-gray-800">{user?.first_name || '-'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Last Name</label>
                <p className="text-lg text-gray-800">{user?.last_name || '-'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Bio</label>
              <p className="text-lg text-gray-800">{user?.profile?.bio || 'No bio provided.'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Role</label>
              <p className="text-lg text-gray-800 capitalize">{user?.profile?.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePageWrapper() {
  return (
    <AuthGuard requireAuth={true}>
      <ProfilePage />
    </AuthGuard>
  );
}
