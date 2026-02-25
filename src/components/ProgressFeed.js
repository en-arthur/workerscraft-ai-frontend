'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * ProgressFeed component displays real-time agent actions and terminal output
 * 
 * @param {Object} props
 * @param {string} props.projectId - ID of the project to monitor
 * @param {string} props.websocketUrl - WebSocket URL (e.g., ws://localhost:8000)
 */
export default function ProgressFeed({ projectId, websocketUrl }) {
  const [events, setEvents] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const wsRef = useRef(null);
  const eventsEndRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Auto-scroll to latest event
  useEffect(() => {
    if (eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events]);

  // Establish WebSocket connection
  useEffect(() => {
    if (!projectId || !websocketUrl) return;

    const connectWebSocket = () => {
      try {
        // Get auth token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        
        // Build WebSocket URL with auth token
        const wsUrl = `${websocketUrl}/ws/projects/${projectId}/progress${token ? `?token=${token}` : ''}`;
        
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          setConnectionError('');
          console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
          try {
            const progressEvent = JSON.parse(event.data);
            
            // Update thinking indicator for planning phases
            if (progressEvent.metadata?.phase === 'planning' || progressEvent.message?.includes('Architect Thinking')) {
              setIsThinking(true);
            } else if (progressEvent.type === 'phase_complete') {
              setIsThinking(false);
            }
            
            // Add event to feed
            setEvents((prev) => [...prev, {
              ...progressEvent,
              id: `${Date.now()}-${Math.random()}`,
              timestamp: progressEvent.timestamp || new Date().toISOString(),
            }]);
          } catch (err) {
            console.error('Failed to parse WebSocket message:', err);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionError('Connection error occurred');
        };

        ws.onclose = () => {
          setIsConnected(false);
          console.log('WebSocket disconnected');
          
          // Attempt to reconnect after 3 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...');
            connectWebSocket();
          }, 3000);
        };
      } catch (err) {
        console.error('Failed to create WebSocket:', err);
        setConnectionError('Failed to establish connection');
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [projectId, websocketUrl]);

  const getEventStyles = (event) => {
    switch (event.type) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          text: 'text-red-900',
          iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        };
      case 'fix':
        return {
          container: 'bg-green-50 border-green-200',
          icon: 'text-green-600',
          text: 'text-green-900',
          iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        };
      case 'phase_complete':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          text: 'text-blue-900',
          iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        };
      case 'action':
        return {
          container: 'bg-purple-50 border-purple-200',
          icon: 'text-purple-600',
          text: 'text-purple-900',
          iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
        };
      case 'terminal':
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-600',
          text: 'text-gray-900',
          iconPath: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        };
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Progress Feed</h3>
        <div className="flex items-center gap-2">
          {isThinking && (
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              <div className="animate-pulse">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Architect Thinking...</span>
            </div>
          )}
          <div className={`flex items-center gap-1.5 text-sm ${isConnected ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      {/* Connection Error */}
      {connectionError && (
        <div className="mx-4 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          {connectionError}
        </div>
      )}

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {events.length === 0 && !connectionError && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500">Waiting for build to start...</p>
          </div>
        )}

        {events.map((event) => {
          const styles = getEventStyles(event);
          return (
            <div
              key={event.id}
              className={`p-3 rounded-lg border ${styles.container} transition-all duration-200`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${styles.icon}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={styles.iconPath} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-xs font-medium uppercase tracking-wide ${styles.text}`}>
                      {event.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                  <p className={`text-sm ${styles.text} whitespace-pre-wrap break-words`}>
                    {event.message}
                  </p>
                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">{key}:</span> {String(value)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Auto-scroll anchor */}
        <div ref={eventsEndRef} />
      </div>
    </div>
  );
}
