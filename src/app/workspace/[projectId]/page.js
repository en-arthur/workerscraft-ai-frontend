'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { projectsAPI, getAuthToken } from '@/lib/api';
import LivePreview from '@/components/LivePreview';
import ChatInterface from '@/components/ChatInterface';
import ProgressNotifier from '@/components/ProgressNotifier';
import ProgressPanel from '@/components/ProgressPanel';
import ResizableDivider from '@/components/ResizableDivider';
import EnvironmentVariablesManager from '@/components/EnvironmentVariablesManager';
import ExportDropdown from '@/components/ExportDropdown';
import VisualDebugger from '@/components/VisualDebugger';
import { Settings, ArrowLeft, RefreshCw } from 'lucide-react';

export default function WorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debuggerEnabled, setDebuggerEnabled] = useState(false);
  const [showEnvModal, setShowEnvModal] = useState(false);
  const [previewKey, setPreviewKey] = useState(0); // Key to force preview refresh
  const [isRestoring, setIsRestoring] = useState(false); // Track restoration status
  const hasTriggeredRestore = useRef(false); // Prevent multiple restore triggers

  // Progress Feed state
  const [progressPanelOpen, setProgressPanelOpen] = useState(false);
  const [progressEvents, setProgressEvents] = useState([]);
  const [buildStatus, setBuildStatus] = useState('idle'); // idle, building, thinking, failed, ready
  const [unreadEventCount, setUnreadEventCount] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Resizable panels state
  const [previewWidth, setPreviewWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('workspace-preview-width');
      return saved ? parseFloat(saved) : 60;
    }
    return 60;
  });
  const [isDragging, setIsDragging] = useState(false);

  const wsRef = useRef(null);

  useEffect(() => {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadProject();
  }, [projectId, router]);
  
  // Separate effect for polling - only when building
  useEffect(() => {
    // Only set up polling if project exists and is building
    if (!project || project.status !== 'building') {
      return;
    }
    
    // Poll project status every 10 seconds while building
    const pollInterval = setInterval(() => {
      loadProject();
    }, 10000);
    
    return () => clearInterval(pollInterval);
  }, [project?.status]); // Only depend on status

  // WebSocket connection for progress feed
  useEffect(() => {
    // Don't connect WebSocket if:
    // 1. No projectId
    // 2. There's an error (project not found, etc.)
    // 3. Project hasn't loaded yet (loading state)
    // 4. Project loaded but doesn't exist
    if (!projectId || error || loading || !project) return;

    const token = getAuthToken();
    const wsUrl = `ws://127.0.0.1:8000/ws/projects/${projectId}/progress${token ? `?token=${token}` : ''}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log('Progress WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const progressEvent = JSON.parse(event.data);

        // Handle connection_established event with current project state
        if (progressEvent.type === 'connection_established') {
          console.log('WebSocket connection established:', progressEvent.metadata);
          
          // If project is ready, trigger a project reload to get preview URL
          if (progressEvent.metadata?.project_status === 'ready') {
            loadProject();
          }
          
          return; // Don't add connection event to progress feed
        }
        
        // Handle build_complete event
        if (progressEvent.type === 'build_complete') {
          console.log('Build completed, reloading project...');
          loadProject(); // Reload to get preview URL
        }

        // Add event to list
        setProgressEvents(prev => [...prev, {
          ...progressEvent,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: progressEvent.timestamp || new Date().toISOString()
        }]);

        // Update thinking indicator
        if (progressEvent.metadata?.phase === 'planning') {
          setIsThinking(true);
        } else if (progressEvent.type === 'phase_complete') {
          setIsThinking(false);
        }

        // Auto-open panel on first event or error
        if (progressEvents.length === 0 || progressEvent.type === 'error') {
          setProgressPanelOpen(true);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onerror = (error) => {
      if (error && error.message) {
        console.error('WebSocket error:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('Progress WebSocket disconnected');
    };

    return () => {
      if (ws) ws.close();
    };
  }, [projectId, error, loading, project]); // Only connect after project successfully loads

  // Update build status based on events
  useEffect(() => {
    if (progressEvents.length === 0) {
      setBuildStatus('idle');
      return;
    }

    const latestEvent = progressEvents[progressEvents.length - 1];

    if (latestEvent.type === 'error') {
      setBuildStatus('failed');
    } else if (latestEvent.metadata?.phase === 'planning') {
      setBuildStatus('thinking');
      setIsThinking(true);
    } else if (latestEvent.type === 'phase_complete' && latestEvent.message.includes('complete')) {
      setBuildStatus('ready');
      setIsThinking(false);
      // Auto-close panel after 3 seconds
      setTimeout(() => setProgressPanelOpen(false), 3000);
    } else if (latestEvent.type === 'action' || latestEvent.type === 'terminal') {
      setBuildStatus('building');
      setIsThinking(false);
    }
  }, [progressEvents]);

  // Increment unread count when panel is closed
  useEffect(() => {
    if (!progressPanelOpen && progressEvents.length > 0) {
      setUnreadEventCount(prev => prev + 1);
    }
  }, [progressEvents.length, progressPanelOpen]);

  // Reset unread count when panel opens
  useEffect(() => {
    if (progressPanelOpen) {
      setUnreadEventCount(0);
    }
  }, [progressPanelOpen]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await projectsAPI.get(projectId);
      setProject(data);
      
      // Auto-restore if project is ready but has no preview URL (sandbox expired)
      // Only trigger once per page load
      if (data.status === 'ready' && data.sandbox_id && !data.preview_url && !isRestoring) {
        console.log('[Workspace] Detected expired sandbox, triggering auto-restore...');
        // Use setTimeout to avoid calling during render
        setTimeout(() => handleSandboxExpired(), 100);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to load project';
      setError(errorMessage);
      
      // If project not found (404), redirect to dashboard immediately
      if (errorMessage.includes('404') || errorMessage.includes('not found') || errorMessage.includes('Project not found')) {
        console.log('[Workspace] Project not found, redirecting to dashboard...');
        router.push('/dashboard'); // Immediate redirect to stop WebSocket spam
      }
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

  const handleClearEvents = () => {
    setProgressEvents([]);
    setUnreadEventCount(0);
  };
  
  const handleSandboxExpired = async () => {
    if (isRestoring || hasTriggeredRestore.current) {
      console.log('[Workspace] Already restoring or restore already triggered, skipping...');
      return;
    }
    
    console.log('[Workspace] Starting sandbox restoration...');
    hasTriggeredRestore.current = true;
    setIsRestoring(true);
    setError('Sandbox expired. Restoring automatically...');
    
    try {
      console.log('[Workspace] Calling resume API...');
      const response = await projectsAPI.resumeProject(projectId);
      console.log('[Workspace] Resume API response:', response);
      
      // Show different messages based on whether files were restored
      if (response.files_restored > 0) {
        setError(`Restored ${response.files_restored} files. Reloading preview...`);
      } else {
        setError('Sandbox provisioned with template defaults. Use chat to rebuild or start a new build.');
      }
      
      console.log('[Workspace] Reloading project data...');
      await loadProject();
      
      console.log('[Workspace] Forcing preview refresh...');
      setPreviewKey(prev => prev + 1);
      
      // Clear error after a delay if files were restored
      if (response.files_restored > 0) {
        setTimeout(() => {
          setError('');
          setIsRestoring(false);
        }, 3000);
      } else {
        // For no files, keep the message and allow user to dismiss
        setIsRestoring(false);
      }
      
      console.log('[Workspace] Sandbox restoration completed successfully!');
    } catch (err) {
      console.error('[Workspace] Sandbox restoration failed:', err);
      setError(`Failed to restore sandbox: ${err.message}. Please start a new build.`);
      setIsRestoring(false);
      hasTriggeredRestore.current = false; // Allow retry on error
    }
  };

  // Resize handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const containerWidth = window.innerWidth;
      const newPreviewWidth = (e.clientX / containerWidth) * 100;

      // Enforce min/max constraints
      if (newPreviewWidth >= 40 && newPreviewWidth <= 70) {
        setPreviewWidth(newPreviewWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        // Save to localStorage
        localStorage.setItem('workspace-preview-width', previewWidth.toString());
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, previewWidth]);

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
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Workspace Header */}
      <header className="bg-gray-900 shadow-sm border-b border-gray-800 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back button and project info */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-white">{project?.name}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm text-gray-400 capitalize">{project?.application_type}</span>
                  <span className="text-gray-600">•</span>
                  <span className={`text-sm font-medium ${
                    project?.status === 'ready' ? 'text-green-400' :
                    project?.status === 'building' ? 'text-blue-400' :
                    project?.status === 'failed' ? 'text-red-400' :
                    'text-gray-400'
                  }`}>
                    {project?.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center gap-3">
              {/* Refresh Preview Button */}
              {project?.status === 'ready' && previewUrl && (
                <button
                  onClick={() => setPreviewKey(prev => prev + 1)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                  title="Refresh Preview"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              )}
              
              {/* Progress Notifier */}
              <ProgressNotifier
                status={buildStatus}
                eventCount={unreadEventCount}
                isOpen={progressPanelOpen}
                onClick={() => setProgressPanelOpen(!progressPanelOpen)}
              />

              {/* Environment Variables Button */}
              <button
                onClick={() => setShowEnvModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
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
                      : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
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

      {/* Progress Panel */}
      <ProgressPanel
        isOpen={progressPanelOpen}
        onClose={() => setProgressPanelOpen(false)}
        events={progressEvents}
        isConnected={isConnected}
        isThinking={isThinking}
        onClear={handleClearEvents}
      />

      {/* Main Workspace Content - Two Column Resizable Layout */}
      <main className="flex-1 overflow-hidden relative">
        {/* Error Message Overlay */}
        {error && (
          <div className="absolute top-0 left-0 right-0 z-20 px-6 pt-4">
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-sm text-red-400 flex items-start gap-2 backdrop-blur-sm">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="h-full flex">
          {/* Left: Live Preview */}
          <div
            className="flex-shrink-0 bg-gray-950 overflow-hidden h-full relative"
            style={{ width: `${previewWidth}%` }}
          >
            <LivePreview
              key={previewKey}
              previewUrl={previewUrl}
              applicationType={project?.application_type}
              onSandboxExpired={handleSandboxExpired}
            />
            
            {/* Visual Debugger Overlay */}
            {project?.status === 'ready' && (
              <VisualDebugger
                enabled={debuggerEnabled}
                onFixRequest={handleFixRequest}
              />
            )}
          </div>

          {/* Resizable Divider */}
          <ResizableDivider onMouseDown={handleMouseDown} />

          {/* Right: AI Chat Assistant */}
          <div
            className="flex-shrink-0 bg-gray-900 h-full"
            style={{ width: `${100 - previewWidth}%` }}
          >
            <ChatInterface
              projectId={projectId}
              visible={true}
              onSendMessage={handleSendChatMessage}
            />
          </div>
        </div>
      </main>

      {/* Environment Variables Modal */}
      {showEnvModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-800">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Environment Variables</h2>
              <button
                onClick={() => setShowEnvModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
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
            <div className="px-6 py-4 border-t border-gray-800 flex justify-end">
              <button
                onClick={() => setShowEnvModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors"
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
