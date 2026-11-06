const handleFetch = async (url, config) => {
  try {
    const response = await fetch(url, config);

    let data = null;

    if (response.status !== 204) {
      data = await response.json();
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchCompleteAssignment = async (assignmentId) => {
  return await handleFetch(`/api/assignments/${assignmentId}/complete`, {
    method: 'POST',
  });
};

export const fetchUncompleteAssignment = async (assignmentId) => {
  return await handleFetch(`/api/assignments/${assignmentId}/complete`, {
    method: 'DELETE',
  });
};

export const fetchStudentCompletions = async (userId) => {
  return await handleFetch(`/api/users/${userId}/completions`);
};
