'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { projectsAPI, getAuthToken } from '@/lib/api';
import LivePreview from '@/components/LivePreview';
import ProgressFeed from '@/components/ProgressFeed';
import VisualDebugger from '@/components/VisualDebugger';
import ChatInterface from '@/components/ChatInterface';
import ExportDropdown from '@/components/ExportDropdown';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buildStarting, setBuildStarting] = useState(false);
  const [debuggerEnabled, setDebuggerEnabled] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadProject();
  }, [projectId, router]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await projectsAPI.get(projectId);
      setProject(data);
    } catch (err) {
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleStartBuild = async () => {
    try {
      setBuildStarting(true);
      setError('');
      await projectsAPI.startBuild(projectId);
      // Reload project to get updated status
      await loadProject();
    } catch (err) {
      setError(err.message || 'Failed to start build');
    } finally {
      setBuildStarting(false);
    }
  };

  const handleFixRequest = async (element, description) => {
    try {
      await projectsAPI.applyFix(projectId, { element, description });
      // Fix will be applied in background, progress shown in feed
    } catch (err) {
      throw new Error(err.message || 'Failed to submit fix request');
    }
  };

  const handleSendChatMessage = async (message) => {
    try {
      const response = await projectsAPI.sendChatMessage(projectId, message);
      return response.response;
    } catch (err) {
      throw new Error(err.message || 'Failed to send chat message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading project...</div>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Get WebSocket URL from API URL
  const getWebSocketUrl = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return apiUrl.replace('http://', 'ws://').replace('https://', 'wss://');
  };

  // Determine if we should show live preview and progress feed
  const showLiveView = project?.status === 'building' || project?.status === 'ready';
  const previewUrl = project?.sandbox_id ? project.preview_url : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                title="Back to Dashboard"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  <span className="capitalize">{project?.application_type}</span>
                  {' • '}
                  <span className={`font-medium ${
                    project?.status === 'ready' ? 'text-green-600' :
                    project?.status === 'building' ? 'text-blue-600' :
                    project?.status === 'failed' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {project?.status}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {project?.status === 'ready' && (
                <>
                  <ExportDropdown
                    projectId={projectId}
                    applicationType={project?.application_type}
                    onError={(err) => setError(err)}
                  />
                  
                  <button
                    onClick={() => setChatVisible(!chatVisible)}
                    className={`px-4 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 ${
                      chatVisible
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    title="Toggle Chat"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat
                  </button>
                  
                  <button
                    onClick={() => setDebuggerEnabled(!debuggerEnabled)}
                    className={`px-4 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 ${
                      debuggerEnabled
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    title="Toggle Visual Debugger"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    {debuggerEnabled ? 'Debugger On' : 'Visual Debugger'}
                  </button>
                </>
              )}
              
              {project?.status === 'initializing' && (
                <button
                  onClick={handleStartBuild}
                  disabled={buildStarting}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {buildStarting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Start Build
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {!showLiveView ? (
          // Show project details when not building
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Details</h2>
                <p className="text-gray-600">{project?.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Application Type</p>
                  <p className="text-lg font-medium capitalize">{project?.application_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-lg font-medium capitalize">{project?.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Supabase Backend</p>
                  <p className="text-lg font-medium">{project?.enable_supabase ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-lg font-medium">
                    {project?.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {project?.status === 'failed' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">Build failed</p>
                  <p className="text-sm text-red-600 mt-1">
                    The build process encountered an error. You can try starting a new build.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Show live preview and progress feed when building or ready
          <div className="h-full flex gap-4 p-4">
            {/* Live Preview - Left Side */}
            <div className="flex-1 min-w-0 relative" style={{ flexBasis: chatVisible ? '40%' : '60%' }}>
              <LivePreview
                previewUrl={previewUrl}
                applicationType={project?.application_type}
              />
              
              {/* Visual Debugger Overlay */}
              {project?.status === 'ready' && (
                <VisualDebugger
                  enabled={debuggerEnabled}
                  onFixRequest={handleFixRequest}
                />
              )}
            </div>

            {/* Chat Interface - Middle (when visible) */}
            {chatVisible && project?.status === 'ready' && (
              <div className="flex-shrink-0" style={{ width: '30%', minWidth: '350px' }}>
                <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
                  <ChatInterface
                    projectId={projectId}
                    visible={chatVisible}
                    onSendMessage={handleSendChatMessage}
                  />
                </div>
              </div>
            )}

            {/* Progress Feed - Right Side */}
            <div className="flex-shrink-0" style={{ width: chatVisible ? '30%' : '40%', minWidth: '350px' }}>
              <ProgressFeed
                projectId={projectId}
                websocketUrl={getWebSocketUrl()}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
