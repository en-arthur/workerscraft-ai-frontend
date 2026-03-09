'use client';

import { useState, useRef, useEffect } from 'react';
import { projectsAPI } from '@/lib/api';

export default function ExportDropdown({ projectId, applicationType, onError }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [customDomain, setCustomDomain] = useState('');
  const [showDomainInput, setShowDomainInput] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowDomainInput(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      setIsOpen(false);
      
      // Call export API
      const response = await projectsAPI.exportProject(projectId);
      
      // Trigger download
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const downloadUrl = `${apiUrl}${response.download_url}`;
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = response.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err) {
      if (onError) {
        onError(err.message || 'Failed to export project');
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeploy = async () => {
    try {
      setIsDeploying(true);
      setIsOpen(false);
      
      // Call deploy API
      const response = await projectsAPI.deployProject(projectId);
      
      // Show success message with live URL
      alert(`Deployment started! Your app will be available at:\n${response.live_url}\n\nDeployment ID: ${response.deployment_id}`);
      
    } catch (err) {
      if (onError) {
        onError(err.message || 'Failed to deploy project');
      }
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCustomDomainDeploy = async () => {
    if (!customDomain.trim()) {
      if (onError) {
        onError('Please enter a domain name');
      }
      return;
    }

    try {
      setIsDeploying(true);
      setIsOpen(false);
      setShowDomainInput(false);
      
      // Call custom domain deploy API
      const response = await projectsAPI.deployToCustomDomain(projectId, customDomain);
      
      // Show success message with live URL
      alert(`Deployment started! Your app will be available at:\n${response.live_url}\n\nDeployment ID: ${response.deployment_id}`);
      
      setCustomDomain('');
      
    } catch (err) {
      if (onError) {
        onError(err.message || 'Failed to deploy to custom domain');
      }
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting || isDeploying}
        className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        title="Export & Deploy"
      >
        {isExporting || isDeploying ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            {isExporting ? 'Exporting...' : 'Deploying...'}
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !showDomainInput && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* Download as ZIP */}
          <button
            onClick={handleDownloadZip}
            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <div className="font-medium text-gray-900">Download as ZIP</div>
              <div className="text-xs text-gray-500">Export all project files</div>
            </div>
          </button>

          {/* Deploy (Web only) */}
          {applicationType === 'web' && (
            <>
              <div className="border-t border-gray-200 my-2"></div>
              
              <button
                onClick={handleDeploy}
                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">Deploy</div>
                  <div className="text-xs text-gray-500">Deploy to hosting service</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowDomainInput(true);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">Deploy to Custom Domain</div>
                  <div className="text-xs text-gray-500">Use your own domain</div>
                </div>
              </button>
            </>
          )}
        </div>
      )}

      {/* Custom Domain Input */}
      {showDomainInput && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Domain
            </label>
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your domain without http:// or https://
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleCustomDomainDeploy}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Deploy
            </button>
            <button
              onClick={() => {
                setShowDomainInput(false);
                setCustomDomain('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
