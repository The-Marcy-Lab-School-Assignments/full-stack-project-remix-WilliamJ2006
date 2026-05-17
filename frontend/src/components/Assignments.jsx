import { useEffect, useState } from 'react';

import {
  fetchStudentAssignments,
  fetchProfessorAssignments,
  fetchCreateAssignment,
  fetchDeleteAssignment,
  fetchUpdateAssignment,
  fetchAssignmentCompletionStatus,
} from '../adapters/assignment-adapters';

import { fetchProfessorCourses } from '../adapters/course-adapters';

import {
  fetchCompleteAssignment,
  fetchUncompleteAssignment,
} from '../adapters/assignment-completion-adapters';

import CreateAssignment from './CreateAssignment';
import EditAssignmentForm from './EditAssignmentForm';

import '../css/Assignments.css';

function Assignments({ user, onAssignmentsClick }) {
  const [assignments, setAssignments] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const [viewMode, setViewMode] = useState(
    user.role === 'student' ? 'student' : 'professor',
  );

  const [showEdit, setShowEdit] = useState([false, null, null, null, null]);

  const [completionStatus, setCompletionStatus] = useState(null);

  const [professorCourses, setProfessorCourses] = useState([]);

  const [shownStatusId, setShownStatusId] = useState(null);

  const loadAssignments = async (mode = viewMode) => {
    let response;

    if (mode === 'student') {
      response = await fetchStudentAssignments(user.user_id);
    } else {
      response = await fetchProfessorAssignments(user.user_id);
    }

    const { data, error } = response;

    if (error) {
      return console.error(error);
    }

    setAssignments(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadAssignments(viewMode);

    const loadProfessorCourses = async () => {
      if (user.role !== 'professor') return;
      const { data, error } = await fetchProfessorCourses(user.user_id);
      if (error) return console.error(error);
      setProfessorCourses(Array.isArray(data) ? data : []);
    };
    loadProfessorCourses();
  }, [viewMode]);

  const handleCreate = async (e) => {
    e.preventDefault();

    const form = e.target;

    const values = {
      title: form.elements.title.value,
      description: form.elements.description.value,
      due_date: form.elements.due_date.value,
      course_id: Number(form.elements.course_id.value),
    };

    const { data, error } = await fetchCreateAssignment(
      values.title,
      values.description,
      values.due_date,
      values.course_id,
    );

    if (error) {
      return console.error(error);
    }

    if (data.message) {
      setCurrentMessage(data.message);

      return;
    }

    setCurrentMessage('Assignment created successfully.');

    form.reset();

    setViewMode('professor');
  };

  const handleDelete = async (assignmentId) => {
    const { data, error } = await fetchDeleteAssignment(assignmentId);

    if (error) {
      return console.error(error);
    }

    if (data.message) {
      setCurrentMessage(data.message);

      return;
    }

    setCurrentMessage('Assignment deleted successfully.');

    loadAssignments(viewMode);
  };

  const handleEditClick = (assignmentId, title, description, dueDate) => {
    setShowEdit([true, assignmentId, title, description, dueDate]);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const values = {
      title: form.elements.title.value || showEdit[2],

      description: form.elements.description.value || showEdit[3],

      due_date: form.elements.due_date.value || showEdit[4],
    };

    const { error } = await fetchUpdateAssignment(
      showEdit[1],
      values.title,
      values.description,
      values.due_date,
    );

    if (error) {
      return console.error(error);
    }

    setCurrentMessage('Assignment updated.');

    setShowEdit([false, null, null, null, null]);

    loadAssignments(viewMode);
  };

  const handleComplete = async (assignmentId) => {
    const { data, error } = await fetchCompleteAssignment(assignmentId);

    if (error) {
      return console.error(error);
    }

    if (data?.message || data?.error) {
      setCurrentMessage(data.message || data.error);

      return;
    }

    setCurrentMessage('Assignment completed.');

    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.assignment_id === assignmentId
          ? {
              ...assignment,
              is_completed: true,
            }
          : assignment,
      ),
    );
  };

  const handleUncomplete = async (assignmentId) => {
    const { error } = await fetchUncompleteAssignment(assignmentId);

    if (error) {
      return console.error(error);
    }

    setCurrentMessage('Assignment uncompleted.');

    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.assignment_id === assignmentId
          ? {
              ...assignment,
              is_completed: false,
            }
          : assignment,
      ),
    );
  };

  const handleViewStatus = async (assignmentId) => {
    if (shownStatusId === assignmentId) {
      setShownStatusId(null);

      setCompletionStatus(null);

      return;
    }

    const { data, error } = await fetchAssignmentCompletionStatus(assignmentId);

    if (error) {
      return console.error(error);
    }

    setCompletionStatus(data);

    setShownStatusId(assignmentId);
  };

  if (showEdit[0]) {
    return <EditAssignmentForm handleEdit={handleEdit} showEdit={showEdit} />;
  }

  return (
    <main className="assignmentsPage">
      <header className="assignmentsHeader">
        <h1 className="assignmentsTitle">Assignments</h1>

        <nav className="assignmentsControls">
          {user.role === 'professor' && (
            <>
              <button onClick={() => setViewMode('professor')}>
                Assignment View
              </button>
              <button onClick={() => setViewMode('create')}>
                Create Assignment
              </button>
            </>
          )}
        </nav>
      </header>

      {user.role === 'professor' && viewMode === 'create' && (
        <CreateAssignment
          onCreate={handleCreate}
          professorCourses={professorCourses}
        />
      )}

      <p className="assignmentsMessage">{currentMessage}</p>

      {completionStatus && (
        <section className="completionStatus">
          <h2>Completion Status</h2>

          {completionStatus.length === 0 ? (
            <p>No Submissions</p>
          ) : (
            completionStatus.map((student) => (
              <article key={student.user_id} className="completionCard">
                <p>{student.username}</p>

                <p>{student.completed ? 'Completed' : 'Missing'}</p>
              </article>
            ))
          )}
        </section>
      )}

      {viewMode !== 'create' && (
        <section
          className="assignmentsGrid"
          key={`${viewMode}-${assignments
            .map((assignment) => assignment.assignment_id)
            .join('-')}`}
        >
          {assignments.length === 0 ? (
            <h2>No assignments found.</h2>
          ) : (
            assignments.map((assignment) => (
              <article
                className="assignmentCard"
                key={assignment.assignment_id}
              >
                <div className="assignmentInfo">
                  <h2>{assignment.title}</h2>

                  <p>{assignment.description}</p>

                  <p>
                    Course: <strong>{assignment.course_name}</strong>
                  </p>

                  <p className="dueDate">
                    Due:{' '}
                    <strong>
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </strong>
                  </p>
                </div>

                {user.role === 'professor' && (
                  <div className="assignmentMeta">
                    <p>Completed: {assignment.completion_count || 0}</p>
                  </div>
                )}

                {user.role === 'student' &&
                  (assignment.is_completed ? (
                    <button
                      className="uncompleteButton"
                      onClick={() => handleUncomplete(assignment.assignment_id)}
                    >
                      Undo
                    </button>
                  ) : (
                    <button
                      className="completeButton"
                      onClick={() => handleComplete(assignment.assignment_id)}
                    >
                      Complete
                    </button>
                  ))}

                {user.role === 'professor' && (
                  <div className="assignmentActions">
                    <button
                      className={
                        shownStatusId === assignment.assignment_id
                          ? 'hideStatusButton'
                          : 'viewStatusButton'
                      }
                      onClick={() => handleViewStatus(assignment.assignment_id)}
                    >
                      {shownStatusId === assignment.assignment_id
                        ? 'Hide'
                        : 'Status'}
                    </button>

                    <button
                      className="editAssignmentButton"
                      onClick={() =>
                        handleEditClick(
                          assignment.assignment_id,
                          assignment.title,
                          assignment.description,
                          assignment.due_date,
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="deleteAssignmentButton"
                      onClick={() => handleDelete(assignment.assignment_id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))
          )}
        </section>
      )}

      <footer className="assignmentsFooter">
        <button className="returnButton" onClick={onAssignmentsClick}>
          Return
        </button>
      </footer>
    </main>
  );
}

export default Assignments;
