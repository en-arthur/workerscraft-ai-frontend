'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * LivePreview component renders real-time preview of application being built
 * 
 * @param {Object} props
 * @param {string|null} props.previewUrl - URL of the preview (null if not ready)
 * @param {'web'|'mobile'} props.applicationType - Type of application
 * @param {Function} props.onElementClick - Optional callback for element clicks (for Visual Debugger)
 */
export default function LivePreview({ previewUrl, applicationType, onElementClick }) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef(null);
  const prevUrlRef = useRef(null);

  // Auto-refresh when preview URL changes
  useEffect(() => {
    if (previewUrl && previewUrl !== prevUrlRef.current) {
      setIsLoading(true);
      setError('');
      prevUrlRef.current = previewUrl;
    }
  }, [previewUrl]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError('');
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load preview. The application may still be starting up.');
  };

  if (!previewUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500">Preview not available yet</p>
          <p className="text-sm text-gray-400 mt-1">Waiting for build to start...</p>
        </div>
      </div>
    );
  }

  // Render web application preview in iframe
  if (applicationType === 'web') {
    return (
      <div className="w-full h-full relative bg-white rounded-lg overflow-hidden shadow-lg">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading preview...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
            <div className="text-center p-6">
              <div className="text-red-600 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-700 font-medium">{error}</p>
              <button
                onClick={() => {
                  setError('');
                  setIsLoading(true);
                  if (iframeRef.current) {
                    iframeRef.current.src = previewUrl;
                  }
                }}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={previewUrl}
          className="w-full h-full border-0"
          title="Application Preview"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        />
      </div>
    );
  }

  // Render mobile application preview in mobile frame with webview
  if (applicationType === 'mobile') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg p-8">
        {/* Mobile device frame */}
        <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl" style={{ width: '375px', height: '667px' }}>
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-3xl z-10"></div>
          
          {/* Screen */}
          <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Loading preview...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
                <div className="text-center p-6">
                  <div className="text-red-600 mb-2">
                    <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                  <button
                    onClick={() => {
                      setError('');
                      setIsLoading(true);
                      if (iframeRef.current) {
                        iframeRef.current.src = previewUrl;
                      }
                    }}
                    className="mt-3 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full border-0"
              title="Mobile Application Preview"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
            />
          </div>
          
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  return null;
}
