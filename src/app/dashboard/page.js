'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProjectDashboard from '@/components/ProjectDashboard';
import { getAuthToken } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // TODO: Fetch user data from API
    // For now, using mock data
    setUser({
      id: '1',
      email: 'user@example.com',
      subscription_tier: 'free',
      builds_remaining: 1,
    });
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Workerscraft</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/projects/new')}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Project
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('auth_token');
                  router.push('/auth/login');
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectDashboard user={user} />
      </main>
    </div>
  );
}
