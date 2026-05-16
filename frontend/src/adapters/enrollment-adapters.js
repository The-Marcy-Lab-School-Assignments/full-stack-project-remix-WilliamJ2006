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

export const fetchEnrollCourse = async (courseId) => {
  const url = `/api/courses/${courseId}/enroll`;
  const config = {
    method: 'POST',
  };
  return await handleFetch(url, config);
};

export const fetchUnenrollCourse = async (courseId) => {
  const url = `/api/courses/${courseId}/enroll`;
  const config = {
    method: 'DELETE',
  };
  return await handleFetch(url, config);
};

export const fetchStudentEnrollments = async (userId) => {
  const url = `/api/users/${userId}/enrollments`;
  return await handleFetch(url);
};
