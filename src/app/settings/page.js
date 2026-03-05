'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, removeAuthToken } from '@/lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [usage, setUsage] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Email update form
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Password update form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchUserData();
    fetchUsageHistory();
  }, [router]);

  const fetchUserData = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data);
      setNewEmail(data.email);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageHistory = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/users/me/usage`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch usage history');
      }

      const data = await response.json();
      setUsage(data.usage_history || []);
    } catch (err) {
      console.error('Failed to fetch usage history:', err);
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newEmail || !newEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setEmailLoading(true);

    try {
      const token = getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/users/me/email`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update email');
      }

      setSuccess('Email updated successfully');
      await fetchUserData();
    } catch (err) {
      setError(err.message);
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      const token = getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/users/me/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update password');
      }

      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    router.push('/auth/login');
  };

  const getTierDisplayName = (tier) => {
    const tierMap = {
      'starter': 'Starter',
      'max': 'Max',
    };
    return tierMap[tier] || tier;
  };

  const getPolarCheckoutUrl = (tier) => {
    // TODO: Replace with actual Polar checkout URLs
    const checkoutUrls = {
      'starter': 'https://polar.sh/workerscraft/starter',
      'max': 'https://polar.sh/workerscraft/max',
    };
    return checkoutUrls[tier] || '#';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Settings</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">{success}</div>
          </div>
        )}

        {/* Account Information */}
        <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-400">Email:</span>
              <span className="ml-2 text-white">{user?.email}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-400">Subscription Tier:</span>
              <span className="ml-2 text-white font-semibold">{getTierDisplayName(user?.subscription_tier)}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-400">Member Since:</span>
              <span className="ml-2 text-white">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Billing Section */}
        <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Billing & Usage</h2>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">Builds Remaining:</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {user?.builds_remaining === null ? '∞' : user?.builds_remaining}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {user?.subscription_tier === 'starter' && 'Resets monthly'}
              {user?.subscription_tier === 'max' && 'Unlimited builds'}
            </div>
          </div>

          {/* Usage History */}
          {usage.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Recent Usage</h3>
              <div className="space-y-2">
                {usage.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm py-2 border-b border-gray-800">
                    <span className="text-gray-400">{item.project_name || 'Project'}</span>
                    <span className="text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upgrade/Downgrade Options */}
          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Manage Subscription</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.subscription_tier !== 'starter' && (
                <a
                  href={getPolarCheckoutUrl('starter')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center font-medium rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-colors"
                >
                  {user?.subscription_tier === 'max' ? 'Downgrade to Starter' : 'Upgrade to Starter'}
                </a>
              )}
              {user?.subscription_tier !== 'max' && (
                <a
                  href={getPolarCheckoutUrl('max')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 bg-gray-800 text-white text-center font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Upgrade to Max
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Update Email */}
        <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Update Email</h2>
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div>
              <label htmlFor="new-email" className="block text-sm font-medium text-gray-300 mb-1">
                New Email Address
              </label>
              <input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={emailLoading}
              />
            </div>
            <button
              type="submit"
              disabled={emailLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emailLoading ? 'Updating...' : 'Update Email'}
            </button>
          </form>
        </div>

        {/* Update Password */}
        <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Update Password</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-300 mb-1">
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={passwordLoading}
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-1">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="At least 8 characters"
                disabled={passwordLoading}
              />
            </div>
            <div>
              <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirm-new-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={passwordLoading}
              />
            </div>
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Logout */}
        <div className="bg-gray-900 rounded-lg shadow-md p-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Account Actions</h2>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
