import { useEffect, useState } from 'react';

import {
  fetchCourses,
  fetchStudentCourses,
  fetchProfessorCourses,
  fetchCreateCourse,
  fetchDeleteCourse,
  fetchUpdateCourse,
} from '../adapters/course-adapters';

import {
  fetchEnrollCourse,
  fetchUnenrollCourse,
} from '../adapters/enrollment-adapters';

import CreateCourse from './CreateCourse';
import EditCourseForm from './EditCourseForm';

import '../css/Courses.css';

function Courses({ user, onCoursesClick }) {
  const [courses, setCourses] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [viewMode, setViewMode] = useState('all');
  const [showEdit, setShowEdit] = useState([
    false,
    null,
    null,
    null,
    null,
    null,
  ]);
  const onEditClick = (
    courseId,
    courseName,
    courseDesc,
    courseCap,
    courseEnroll,
  ) => {
    setShowEdit([
      !showEdit[0],
      courseId,
      courseName,
      courseDesc,
      courseCap,
      courseEnroll,
    ]);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const values = {
      course_name: form.elements.course_name.value,
      description: form.elements.description.value,
      max_capacity: Number(form.elements.max_capacity.value),
    };

    if (!values.course_name) values.course_name = null;
    if (!values.description) values.description = null;
    if (!values.max_capacity || values.max_capacity < showEdit[5]) {
      values.max_capacity = showEdit[4];
    }
    if (values.max_capacity < showEdit[5]) {
      setCurrentMessage(`Course capacity can't be below current enrollments!`);
      setShowEdit([false, null, null, null, null, null]);
      return;
    }
    const { error } = await fetchUpdateCourse(
      Number(showEdit[1]),
      values.course_name,
      values.description,
      values.max_capacity,
    );

    if (error) return console.error(error);
    setCurrentMessage('Course updated successfully.');
    await loadCourses(viewMode);

    setShowEdit([false, null, null, null, null]);
  };

  const loadCourses = async (mode = viewMode) => {
    let response;

    if (mode === 'student') {
      response = await fetchStudentCourses(user.user_id);
    } else if (mode === 'professor') {
      response = await fetchProfessorCourses(user.user_id);
    } else {
      response = await fetchCourses();
    }

    const { data, error } = response;

    if (error) {
      console.error(error);
      return;
    }

    setCourses(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadCourses(viewMode);
  }, [viewMode]);

  if (showEdit[0]) {
    return <EditCourseForm handleEdit={handleEdit} showEdit={showEdit} />;
  }

  const handleCreate = async (e) => {
    e.preventDefault();

    const form = e.target;

    const values = {
      course_name: form.elements.course_name.value,
      description: form.elements.description.value,
      max_capacity: Number(form.elements.max_capacity.value),
    };

    const { data, error } = await fetchCreateCourse(
      values.course_name,
      values.description,
      values.max_capacity,
    );

    if (error) {
      console.error(error);
      return;
    }

    if (data.message) {
      setCurrentMessage(data.message);
      return;
    }

    setCurrentMessage('Course created successfully.');

    form.reset();

    setViewMode('professor');
  };

  const handleDelete = async (courseId) => {
    const { data, error } = await fetchDeleteCourse(courseId);

    if (error) {
      console.error(error);
      return;
    }

    if (data.message) {
      setCurrentMessage(data.message);
      return;
    }

    setCurrentMessage('Course deleted successfully.');

    loadCourses(viewMode);
  };

  const handleEnroll = async (courseId) => {
    const { data, error } = await fetchEnrollCourse(courseId);

    if (error) {
      console.error(error);
      return;
    }

    if (data?.error || data?.message) {
      setCurrentMessage(data.error || data.message);

      return;
    }

    setCurrentMessage('Successfully enrolled.');

    setCourses((prev) =>
      prev.map((course) =>
        course.course_id === courseId
          ? {
              ...course,
              is_enrolled: true,
              enrollment_count: Number(course.enrollment_count) + 1,
            }
          : course,
      ),
    );
  };

  const handleUnenroll = async (courseId) => {
    const { error } = await fetchUnenrollCourse(courseId);

    if (error) {
      console.error(error);
      return;
    }

    setCurrentMessage('Successfully unenrolled.');

    if (viewMode === 'student') {
      setCourses((prev) =>
        prev.filter((course) => course.course_id !== courseId),
      );

      return;
    }

    setCourses((prev) =>
      prev.map((course) =>
        course.course_id === courseId
          ? {
              ...course,
              is_enrolled: false,
              enrollment_count: Number(course.enrollment_count) - 1,
            }
          : course,
      ),
    );
  };

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <main className="coursesPage">
      <header className="coursesHeader">
        <h1 className="coursesTitle">Courses</h1>

        <nav className="coursesControls">
          <button onClick={() => handleViewChange('all')}>All Courses</button>

          {user.role === 'student' ? (
            <button onClick={() => handleViewChange('student')}>
              My Enrollments
            </button>
          ) : (
            <>
              <button onClick={() => handleViewChange('professor')}>
                My Courses
              </button>

              <button onClick={() => handleViewChange('create')}>
                Create Course
              </button>
            </>
          )}
        </nav>
      </header>

      {user.role === 'professor' && viewMode === 'create' && (
        <CreateCourse onCreate={handleCreate} />
      )}

      <p className="coursesMessage">{currentMessage}</p>

      {viewMode !== 'create' && (
        <section className="coursesGrid">
          {courses.length === 0 ? (
            <h2>No courses found.</h2>
          ) : (
            courses.map((course) => {
              const isFull =
                Number(course.enrollment_count) >= Number(course.max_capacity);

              const isEnrolled = Boolean(course.is_enrolled);

              return (
                <article className="courseCard" key={course.course_id}>
                  <div>
                    <h2>{course.course_name}</h2>

                    <p>{course.description}</p>
                  </div>

                  <div className="courseMeta">
                    <p>Capacity: {course.max_capacity}</p>

                    <p>Enrolled: {course.enrollment_count || 0}</p>
                  </div>

                  {user.role === 'student' && (
                    <>
                      {viewMode === 'student' ? (
                        <button
                          className="unenrollButton"
                          onClick={() => handleUnenroll(course.course_id)}
                        >
                          Unenroll
                        </button>
                      ) : isEnrolled ? (
                        <button
                          className="unenrollButton"
                          onClick={() => handleUnenroll(course.course_id)}
                        >
                          Unenroll
                        </button>
                      ) : (
                        <button
                          className="enrollButton"
                          disabled={isFull}
                          onClick={() => handleEnroll(course.course_id)}
                        >
                          {isFull ? 'Course Full' : 'Enroll'}
                        </button>
                      )}
                    </>
                  )}

                  {user.role === 'professor' &&
                    course.professor_id === user.user_id && (
                      <div className="professorActions">
                        <button
                          className="editCourseButton"
                          onClick={() =>
                            onEditClick(
                              course.course_id,
                              course.course_name,
                              course.description,
                              course.max_capacity,
                              course.enrollment_count,
                            )
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="deleteCourseButton"
                          onClick={() => handleDelete(course.course_id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                </article>
              );
            })
          )}
        </section>
      )}

      <footer className="coursesFooter">
        <button className="returnButton" onClick={onCoursesClick}>
          Return
        </button>
      </footer>
    </main>
  );
}

export default Courses;
