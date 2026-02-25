'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProjectCreationForm from '@/components/ProjectCreationForm';
import { getAuthToken } from '@/lib/api';

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setLoading(false);
  }, [router]);

  const handleSuccess = (project) => {
    // Redirect to project detail page
    router.push(`/projects/${project.id}`);
  };

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
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Project</h2>
            <p className="text-gray-600">
              Describe your application and let the Master Architect Agent build it for you.
            </p>
          </div>

          <ProjectCreationForm onSuccess={handleSuccess} />
        </div>
      </main>
    </div>
  );
}
