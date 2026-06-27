const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

let accessToken: string | null = null;
let logoutCallback: (() => void) | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export const api = async (path: string, options: RequestOptions = {}) => {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(options.headers || {});

  if (!options.skipAuth && accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  if (options.body && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  let response = await fetch(url, fetchOptions);

  // If unauthorized and we have a refresh token, try to rotate tokens
  if (response.status === 401 && !options.skipAuth) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          // Save new tokens
          setAccessToken(data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          // Retry the original request
          headers.set('Authorization', `Bearer ${data.accessToken}`);
          response = await fetch(url, {
            ...options,
            headers,
          });
        } else {
          // Refresh token expired or invalid
          handleLogout();
        }
      } catch (error) {
        handleLogout();
      }
    } else {
      handleLogout();
    }
  }

  return response;
};

const handleLogout = () => {
  setAccessToken(null);
  localStorage.removeItem('refreshToken');
  if (logoutCallback) {
    logoutCallback();
  }
};
