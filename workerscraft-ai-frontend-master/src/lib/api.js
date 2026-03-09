/**
 * API client for Workerscraft backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Get auth token from localStorage
 */
export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Set auth token in localStorage
 */
export function setAuthToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

/**
 * Remove auth token from localStorage
 */
export function removeAuthToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid - but don't redirect if this is a login/signup request
    const isAuthEndpoint = endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/signup');
    
    if (!isAuthEndpoint) {
      removeAuthToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'An error occurred');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Auth API
export const authAPI = {
  signup: async (email, password) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  passwordReset: async (email) => {
    return apiRequest('/auth/password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// Users API
export const usersAPI = {
  getCurrentUser: async () => {
    return apiRequest('/users/me');
  },

  updateEmail: async (email) => {
    return apiRequest('/users/me/email', {
      method: 'PUT',
      body: JSON.stringify({ email }),
    });
  },

  updatePassword: async (currentPassword, newPassword) => {
    return apiRequest('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
  },

  getUsageHistory: async () => {
    return apiRequest('/users/me/usage');
  },
};

// Projects API
export const projectsAPI = {
  create: async (projectData) => {
    return apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  list: async () => {
    return apiRequest('/projects');
  },

  get: async (projectId) => {
    return apiRequest(`/projects/${projectId}`);
  },

  delete: async (projectId) => {
    return apiRequest(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  },

  startBuild: async (projectId) => {
    return apiRequest(`/projects/${projectId}/build`, {
      method: 'POST',
    });
  },

  applyFix: async (projectId, fixRequest) => {
    return apiRequest(`/projects/${projectId}/fix`, {
      method: 'POST',
      body: JSON.stringify(fixRequest),
    });
  },

  sendChatMessage: async (projectId, message) => {
    return apiRequest(`/projects/${projectId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  exportProject: async (projectId) => {
    return apiRequest(`/projects/${projectId}/export`, {
      method: 'POST',
    });
  },

  deployProject: async (projectId) => {
    return apiRequest(`/projects/${projectId}/deploy`, {
      method: 'POST',
    });
  },

  deployToCustomDomain: async (projectId, domain) => {
    return apiRequest(`/projects/${projectId}/deploy/custom`, {
      method: 'POST',
      body: JSON.stringify({ domain }),
    });
  },

  getDeploymentStatus: async (deploymentId) => {
    return apiRequest(`/projects/deployments/${deploymentId}/status`);
  },
  
  resumeProject: async (projectId) => {
    return apiRequest(`/projects/${projectId}/resume`, {
      method: 'POST',
    });
  },
};
