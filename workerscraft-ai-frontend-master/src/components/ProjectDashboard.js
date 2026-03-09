'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { projectsAPI } from '@/lib/api';

export default function ProjectDashboard({ user }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await projectsAPI.list();
      setProjects(data);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId) => {
    router.push(`/workspace/${projectId}`);
  };

  const handleDeleteClick = (e, projectId) => {
    e.stopPropagation();
    setDeleteConfirm(projectId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      setDeleting(true);
      await projectsAPI.delete(deleteConfirm);
      setProjects(projects.filter(p => p.id !== deleteConfirm));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message || 'Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'building':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* User Info Skeleton */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-6 bg-gray-800 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-48"></div>
            </div>
            <div className="text-right">
              <div className="h-4 bg-gray-800 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-800 rounded w-16"></div>
            </div>
          </div>
        </div>

        {/* Projects Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-gray-800 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-2/3 mb-4"></div>
              <div className="h-4 bg-gray-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Info Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-white">Your Account</h2>
              <button
                onClick={() => router.push('/settings')}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title="Account Settings"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-gray-300">{user?.email}</span>
              </div>
              <span className="text-gray-700">•</span>
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <span className="font-medium capitalize text-gray-300">{user?.subscription_tier || 'Starter'} Plan</span>
              </div>
            </div>
          </div>
          <div className="text-right pl-6 border-l border-gray-700">
            <p className="text-sm font-medium text-gray-400 mb-1">Builds Remaining</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {user?.builds_remaining === null ? '∞' : user?.builds_remaining ?? 0}
            </p>
            {user?.builds_remaining === 0 && (
              <button
                onClick={() => router.push('/pricing')}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Upgrade Plan →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-400 mb-1">Failed to load projects</p>
              <p className="text-sm text-red-400/80">{error}</p>
            </div>
            <button
              onClick={loadProjects}
              className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Projects List */}
      {!error && projects.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-16 text-center shadow-xl">
          <div className="max-w-md mx-auto">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
              <svg
                className="h-10 w-10 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">No projects yet</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Get started by creating your first application with the Master Architect Agent.
            </p>
            <button
              onClick={() => router.push('/projects/new')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Project
            </button>
          </div>
        </div>
      ) : !error ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className="group relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer overflow-hidden shadow-lg hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-blue-400 transition-colors flex-1">
                    {project.name}
                  </h3>
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border flex-shrink-0 ml-2 ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[2.5rem]">
                  {project.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="capitalize font-medium text-gray-400">{project.application_type}</span>
                    {project.enable_supabase && (
                      <>
                        <span className="text-gray-700">•</span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <svg
                            className="h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                          </svg>
                          Supabase
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-gray-600">{formatDate(project.created_at)}</span>
                </div>
              </div>

              <div className="relative px-6 py-3 bg-gray-900/50 border-t border-gray-800 flex items-center justify-between">
                <button
                  onClick={(e) => handleDeleteClick(e, project.id)}
                  className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
                >
                  Delete
                </button>
                <svg
                  className="h-4 w-4 text-gray-600 group-hover:text-blue-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Delete Project</h3>
                <p className="text-sm text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this project? All associated data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
