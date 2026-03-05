'use client';

import { Bell, Brain, AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * ProgressNotifier - Header button that shows build status and event count
 * 
 * @param {Object} props
 * @param {string} props.status - Build status: idle, building, thinking, failed, ready
 * @param {number} props.eventCount - Number of unread events
 * @param {boolean} props.isOpen - Whether progress panel is open
 * @param {Function} props.onClick - Click handler
 */
export default function ProgressNotifier({ status, eventCount, isOpen, onClick }) {
  const getNotifierStyles = () => {
    switch (status) {
      case 'building':
        return 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white animate-pulse';
      case 'thinking':
        return 'bg-purple-600 text-white animate-pulse';
      case 'failed':
        return 'bg-red-600 text-white';
      case 'ready':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'building':
        return <Bell className="w-4 h-4" />;
      case 'thinking':
        return <Brain className="w-4 h-4" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'building':
        return 'Building...';
      case 'thinking':
        return 'Thinking...';
      case 'failed':
        return 'Failed';
      case 'ready':
        return 'Ready';
      default:
        return 'Progress';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-2 px-4 py-2 rounded-lg 
        font-medium text-sm transition-all duration-200
        ${getNotifierStyles()}
        ${status === 'failed' ? 'animate-shake' : ''}
      `}
      aria-label={`Progress: ${status}. ${eventCount} new events.`}
      aria-expanded={isOpen}
      aria-controls="progress-panel"
      title="View build progress"
    >
      {/* Icon */}
      <div className={status === 'building' || status === 'thinking' ? 'animate-pulse' : ''}>
        {getStatusIcon()}
      </div>
      
      {/* Status text */}
      <span className="hidden sm:inline">
        {getStatusText()}
      </span>
      
      {/* Badge (unread event count) */}
      {eventCount > 0 && !isOpen && (
        <span className="
          absolute -top-1 -right-1 
          bg-red-500 text-white text-xs font-bold
          rounded-full min-w-[20px] h-5 px-1.5
          flex items-center justify-center
          animate-pop
        ">
          {eventCount > 99 ? '99+' : eventCount}
        </span>
      )}
    </button>
  );
}