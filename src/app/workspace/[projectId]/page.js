'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { projectsAPI, getAuthToken } from '@/lib/api';
import LivePreview from '@/components/LivePreview';
import ChatInterface from '@/components/ChatInterface';
import EnvironmentVariablesManager from '@/components/EnvironmentVariablesManager';
import ExportDropdown from '@/components/ExportDropdown';
import VisualDebugger from '@/components/VisualDebugger';
import { Settings, ArrowLeft } from 'lucide-react';

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debuggerEnabled, setDebuggerEnabled] = useState(false);
  const [showEnvModal, setShowEnvModal] = useState(false);

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

  const handleFixRequest = async (element, description) => {
    try {
      await projectsAPI.applyFix(projectId, { element, description });
      // Fix will be applied in background
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
          <div className="text-gray-600">Loading workspace...</div>
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

  const previewUrl = project?.sandbox_id ? project.preview_url : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Workspace Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back button and project info */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{project?.name}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm text-gray-500 capitalize">{project?.application_type}</span>
                  <span className="text-gray-300">•</span>
                  <span className={`text-sm font-medium ${
                    project?.status === 'ready' ? 'text-green-600' :
                    project?.status === 'building' ? 'text-blue-600' :
                    project?.status === 'failed' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {project?.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center gap-3">
              {/* Environment Variables Button */}
              <button
                onClick={() => setShowEnvModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Environment Variables"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Environment Variables</span>
              </button>

              {/* Export Dropdown */}
              {project?.status === 'ready' && (
                <ExportDropdown
                  projectId={projectId}
                  applicationType={project?.application_type}
                  onError={(err) => setError(err)}
                />
              )}

              {/* Visual Debugger Toggle */}
              {project?.status === 'ready' && (
                <button
                  onClick={() => setDebuggerEnabled(!debuggerEnabled)}
                  className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors ${
                    debuggerEnabled
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                  title="Toggle Visual Debugger"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <span className="hidden sm:inline">{debuggerEnabled ? 'Debugger On' : 'Visual Debugger'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="px-6 pt-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main Workspace Content - Two Column Layout */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Left Column: Chat Interface */}
          <div className="w-96 flex-shrink-0 border-r border-gray-200 bg-white">
            <ChatInterface
              projectId={projectId}
              visible={true}
              onSendMessage={handleSendChatMessage}
            />
          </div>

          {/* Right Column: Live Preview */}
          <div className="flex-1 min-w-0 p-6 bg-gray-50">
            <div className="h-full relative">
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
          </div>
        </div>
      </main>

      {/* Environment Variables Modal */}
      {showEnvModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Environment Variables</h2>
              <button
                onClick={() => setShowEnvModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <EnvironmentVariablesManager projectId={projectId} />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowEnvModal(false)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
