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

export const fetchStudentAssignments = async (userId) => {
  return await handleFetch(`/api/assignments/students/${userId}`);
};

export const fetchProfessorAssignments = async (userId) => {
  return await handleFetch(`/api/assignments/professors/${userId}`);
};

export const fetchCreateAssignment = async (
  title,
  description,
  due_date,
  course_id,
) => {
  return await handleFetch('/api/assignments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description,
      due_date,
      course_id,
    }),
  });
};

export const fetchUpdateAssignment = async (
  assignmentId,
  title,
  description,
  due_date,
) => {
  return await handleFetch(`/api/assignments/${assignmentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description,
      due_date,
    }),
  });
};

export const fetchDeleteAssignment = async (assignmentId) => {
  return await handleFetch(`/api/assignments/${assignmentId}`, {
    method: 'DELETE',
  });
};

export const fetchAssignmentCompletionStatus = async (assignmentId) => {
  return await handleFetch(`/api/assignments/${assignmentId}/status`);
};
