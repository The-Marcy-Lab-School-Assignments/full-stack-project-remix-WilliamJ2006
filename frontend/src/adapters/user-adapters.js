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

export const fetchUsersByRole = async (role) => {
  return await handleFetch(`/api/users/role`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
};

export const fetchUsersByEnrollments = async (userId) => {
  const url = `/api/users/${userId}/students`;
  return await handleFetch(url);
};

export const fetchUsersByCourses = async (userId) => {
  const url = `/api/users/${userId}/professors`;
  return await handleFetch(url);
};

export const fetchUpdateUser = async (userId, password, email) => {
  const url = `/api/users/${userId}`;
  const config = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, email }),
  };
  return await handleFetch(url, config);
};

export const fetchDeleteUser = async (userId) => {
  const url = `/api/users/${userId}`;
  const config = { method: `DELETE` };
  return await handleFetch(url, config);
};
