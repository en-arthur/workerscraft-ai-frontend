'use client';

import { useEffect, useRef } from 'react';
import { X, Trash2, Brain, Zap, CheckCircle, Terminal, AlertCircle, Wrench, Info } from 'lucide-react';

/**
 * ProgressPanel - Slide-down panel showing build progress events
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether panel is open
 * @param {Function} props.onClose - Close handler
 * @param {Array} props.events - Array of progress events
 * @param {boolean} props.isConnected - WebSocket connection status
 * @param {boolean} props.isThinking - Whether architect is thinking
 * @param {Function} props.onClear - Clear events handler
 */
export default function ProgressPanel({ 
  isOpen, 
  onClose, 
  events, 
  isConnected, 
  isThinking,
  onClear 
}) {
  const eventsEndRef = useRef(null);

  // Auto-scroll to latest event
  useEffect(() => {
    if (isOpen && eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events, isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

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

  const getEventStyles = (eventType) => {
    switch (eventType) {
      case 'action':
        return {
          container: 'bg-purple-900/20 border-purple-500/30',
          icon: 'text-purple-400',
          text: 'text-purple-100',
          iconComponent: <Zap className="w-5 h-5" />
        };
      case 'phase_complete':
        return {
          container: 'bg-blue-900/20 border-blue-500/30',
          icon: 'text-blue-400',
          text: 'text-blue-100',
          iconComponent: <CheckCircle className="w-5 h-5" />
        };
      case 'terminal':
        return {
          container: 'bg-gray-800/50 border-gray-700',
          icon: 'text-gray-400',
          text: 'text-gray-200',
          iconComponent: <Terminal className="w-5 h-5" />
        };
      case 'error':
        return {
          container: 'bg-red-900/20 border-red-500/30',
          icon: 'text-red-400',
          text: 'text-red-100',
          iconComponent: <AlertCircle className="w-5 h-5" />
        };
      case 'fix':
        return {
          container: 'bg-green-900/20 border-green-500/30',
          icon: 'text-green-400',
          text: 'text-green-100',
          iconComponent: <Wrench className="w-5 h-5" />
        };
      default:
        return {
          container: 'bg-gray-800/50 border-gray-700',
          icon: 'text-gray-400',
          text: 'text-gray-200',
          iconComponent: <Info className="w-5 h-5" />
        };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="relative z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Panel */}
      <div
        id="progress-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="progress-panel-title"
        className={`
          fixed left-0 right-0 
          bg-gray-900 border-b border-gray-800
          shadow-2xl
          transition-all duration-300 ease-out
          ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        `}
        style={{ 
          top: '72px', // Below header
          height: '400px',
          maxHeight: 'calc(100vh - 72px - 100px)' // Leave space for workspace
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900">
          <h3 id="progress-panel-title" className="text-lg font-semibold text-white">
            Progress Feed
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Clear all events"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Minimize panel"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Minimize</span>
            </button>
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="px-6 py-2 bg-gray-800/50 border-b border-gray-800">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className={isConnected ? 'text-green-400' : 'text-gray-400'}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            {isThinking && (
              <>
                <span className="text-gray-600">•</span>
                <div className="flex items-center gap-2 text-purple-400">
                  <Brain className="w-4 h-4 animate-pulse" />
                  <span>Architect Thinking...</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Events List */}
        <div className="h-[calc(100%-120px)] overflow-y-auto p-6 space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">
                <Terminal className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-400">Waiting for build to start...</p>
            </div>
          ) : (
            events.map((event) => {
              const styles = getEventStyles(event.type);
              return (
                <div
                  key={event.id}
                  className={`
                    p-4 rounded-lg border transition-all duration-200
                    ${styles.container}
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`flex-shrink-0 ${styles.icon}`}>
                      {styles.iconComponent}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wide ${styles.text}`}>
                          {event.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </div>
                      
                      {/* Message */}
                      <p className={`text-sm ${styles.text} whitespace-pre-wrap break-words`}>
                        {event.message}
                      </p>
                      
                      {/* Metadata */}
                      {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <div className="mt-2 text-xs text-gray-500 space-y-1">
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
            })
          )}
          <div ref={eventsEndRef} />
        </div>
      </div>
    </div>
  );
}
