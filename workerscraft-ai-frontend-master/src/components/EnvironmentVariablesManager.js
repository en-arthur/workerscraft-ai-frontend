'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, AlertCircle } from 'lucide-react';

export default function EnvironmentVariablesManager({ projectId }) {
  const [variables, setVariables] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch environment variables
  useEffect(() => {
    fetchVariables();
  }, [projectId]);

  const fetchVariables = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/env`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch environment variables');
      }

      const data = await response.json();
      setVariables(data.variables || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariable = async () => {
    if (!newKey.trim() || !newValue.trim()) {
      setError('Both key and value are required');
      return;
    }

    try {
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/env`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: newKey,
          value: newValue
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add environment variable');
      }

      // Refresh variables list
      await fetchVariables();
      
      // Reset form
      setNewKey('');
      setNewValue('');
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateVariable = async (key) => {
    if (!editValue.trim()) {
      setError('Value cannot be empty');
      return;
    }

    try {
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/env/${key}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: editValue
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update environment variable');
      }

      // Refresh variables list
      await fetchVariables();
      
      // Reset edit state
      setEditingKey(null);
      setEditValue('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteVariable = async (key) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/env/${key}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete environment variable');
      }

      // Refresh variables list
      await fetchVariables();
      
      // Reset delete confirmation
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (key, value) => {
    setEditingKey(key);
    setEditValue(value);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const confirmDelete = (key) => {
    setDeleteConfirm(key);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Environment Variables</h3>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Environment Variables</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? 'Cancel' : 'Add Variable'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {showAddForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key
              </label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="API_KEY"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="your-api-key-here"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleAddVariable}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Variable
          </button>
        </div>
      )}

      <div className="space-y-2">
        {Object.keys(variables).length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No environment variables yet. Add one to get started.
          </p>
        ) : (
          Object.entries(variables).map(([key, value]) => (
            <div
              key={key}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
            >
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Key</p>
                  <p className="text-gray-900 font-mono">{key}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Value</p>
                  {editingKey === key ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  ) : (
                    <p className="text-gray-900 font-mono truncate">{value}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {editingKey === key ? (
                  <>
                    <button
                      onClick={() => handleUpdateVariable(key)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Save"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Cancel"
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(key, value)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => confirmDelete(key)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold mb-2">Confirm Deletion</h4>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the environment variable <span className="font-mono font-semibold">{deleteConfirm}</span>? This action cannot be undone and will restart the development server.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteVariable(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
