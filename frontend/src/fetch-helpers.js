const handleFetch = async (url, config) => {
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchUsers = async () => {
  const url = '/api/users';
  return await handleFetch(url);
};

export const loginUser = async (username, password) => {
  const url = '/api/auth/login';
  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  };
  return await handleFetch(url, config);
};

export const logoutUser = async () => {
  const url = '/api/auth/logout';
  const config = { method: 'DELETE' };
  return await handleFetch(url, config);
};

export const createUser = async (username, email, role, password) => {
  const url = '/api/auth/register';
  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email, role }),
  };
  return await handleFetch(url, config);
};

export const authUser = async () => {
  return await handleFetch('/api/auth/me', { credentials: 'include' });
};
