const handleFetch = async (url, config) => {
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchCourses = async () => {
  const url = '/api/courses';
  return await handleFetch(url);
};

export const fetchStudentCourses = async (userId) => {
  const url = `/api/courses/students/${userId}`;
  return await handleFetch(url);
};

export const fetchProfessorCourses = async (userId) => {
  const url = `/api/courses/professors/${userId}`;
  return await handleFetch(url);
};

export const fetchCourse = async (courseId) => {
  const url = `/api/courses/${courseId}`;
  return await handleFetch(url);
};

export const fetchCreateCourse = async (
  course_name,
  description,
  max_capacity,
) => {
  const url = '/api/courses';

  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      course_name,
      description,
      max_capacity,
    }),
  };
  return await handleFetch(url, config);
};

export const fetchUpdateCourse = async (
  courseId,
  course_name,
  description,
  max_capacity,
) => {
  const url = `/api/courses/${courseId}`;
  const config = {
    method: 'PATCH',

    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      course_name,
      description,
      max_capacity,
    }),
  };
  return await handleFetch(url, config);
};

export const fetchDeleteCourse = async (courseId) => {
  const url = `/api/courses/${courseId}`;
  const config = {
    method: 'DELETE',
  };
  return await handleFetch(url, config);
};
