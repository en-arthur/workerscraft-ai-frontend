'use client';

import { useState } from 'react';
import { projectsAPI } from '@/lib/api';

export default function ProjectCreationForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [applicationType, setApplicationType] = useState('web');
  const [enableSupabase, setEnableSupabase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Please provide a name for your project');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a description for your project');
      return;
    }

    setLoading(true);

    try {
      const project = await projectsAPI.create({
        name: name.trim(),
        description: description.trim(),
        application_type: applicationType,
        enable_supabase: enableSupabase,
      });

      // Reset form
      setName('');
      setDescription('');
      setApplicationType('web');
      setEnableSupabase(false);

      // Call success callback
      if (onSuccess) {
        onSuccess(project);
      }
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Project Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="E.g., Task Manager App"
          className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Describe your application
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="E.g., A task management app with user authentication and real-time updates"
          rows={4}
          className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={loading}
        />
      </div>

      {/* Application Type Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Application Type
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setApplicationType('web')}
            disabled={loading}
            className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-colors ${
              applicationType === 'web'
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
            }`}
          >
            Web Application
          </button>
          <button
            type="button"
            onClick={() => setApplicationType('mobile')}
            disabled={loading}
            className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-colors ${
              applicationType === 'mobile'
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
            }`}
          >
            Mobile Application
          </button>
        </div>
      </div>

      {/* Supabase Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div>
          <label htmlFor="supabase-toggle" className="block text-sm font-medium text-gray-300">
            Enable Supabase Backend
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Includes PostgreSQL database and authentication
          </p>
        </div>
        <button
          type="button"
          id="supabase-toggle"
          role="switch"
          aria-checked={enableSupabase}
          onClick={() => setEnableSupabase(!enableSupabase)}
          disabled={loading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enableSupabase ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enableSupabase ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Creating Project...' : 'Create Project'}
      </button>
    </form>
  );
}
