// ====================================
// Imports / Constants
// ====================================

require('dotenv').config();

const path = require('path');
const express = require('express');

const cookieSession = require('cookie-session');

const logRoutes = require('./middleware/logRoutes');

const checkAuthentication = require('./middleware/checkAuthentication');

const {
  register,
  login,
  getMe,
  logout,
} = require('./controllers/authControllers');

const {
  listUsers,
  listUsersByRole,
  listStudentsByProfessorCourses,
  listProfessorsByStudentCourses,
  updateUser,
  deleteUser,
} = require('./controllers/userControllers');

const {
  listCourses,
  listStudentCourses,
  listProfessorCourses,
  findCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('./controllers/courseControllers');

const {
  confirmEnrollment,
  cancelEnrollment,
  listConfirmedEnrollments,
  isFull,
} = require('./controllers/enrollmentControllers');

const {
  listStudentAssignments,
  listProfessorAssignments,
  findAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  listAssignmentCompletionStatus,
} = require('./controllers/assignmentControllers');

const {
  confirmCompletion,
  cancelCompletion,
  listConfirmedCompletions,
} = require('./controllers/assignmentCompletionsControllers');

const app = express();

const PORT = process.env.PORT || 8080;

const pathToFrontend =
  process.env.NODE_ENV === 'production'
    ? '../frontend/dist'
    : '../frontend/dist';

// ====================================
// Middleware
// ====================================

app.use(logRoutes);

app.use(
  cookieSession({
    name: 'session',
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000,
  }),
);

app.use(express.json());

app.use(express.static(path.join(__dirname, pathToFrontend)));

// ====================================
// Auth routes (public)
// ====================================

app.post('/api/auth/register', register);

app.post('/api/auth/login', login);

app.get('/api/auth/me', getMe);

app.delete('/api/auth/logout', logout);

// ====================================
// User routes
// ====================================

app.get('/api/users', listUsers);

app.post('/api/users/role', listUsersByRole);

app.get(
  '/api/users/:user_id/students',
  checkAuthentication,
  listStudentsByProfessorCourses,
);

app.get(
  '/api/users/:user_id/professors',
  checkAuthentication,
  listProfessorsByStudentCourses,
);

app.patch('/api/users/:user_id', checkAuthentication, updateUser);

app.delete('/api/users/:user_id', checkAuthentication, deleteUser);

app.get(
  '/api/users/:user_id/enrollments',
  checkAuthentication,
  listConfirmedEnrollments,
);

// ====================================
// Assignment routes
// ====================================

// ====================================
// Assignment routes
// ====================================

app.get(
  '/api/assignments/students/:user_id',
  checkAuthentication,
  listStudentAssignments,
);

app.get(
  '/api/assignments/professors/:user_id',
  checkAuthentication,
  listProfessorAssignments,
);

app.get('/api/assignments/:assignment_id', checkAuthentication, findAssignment);

app.post('/api/assignments', checkAuthentication, createAssignment);

app.patch(
  '/api/assignments/:assignment_id',
  checkAuthentication,
  updateAssignment,
);

app.delete(
  '/api/assignments/:assignment_id',
  checkAuthentication,
  deleteAssignment,
);

app.get(
  '/api/assignments/:assignment_id/status',
  checkAuthentication,
  listAssignmentCompletionStatus,
);

app.post(
  '/api/assignments/:assignment_id/complete',
  checkAuthentication,
  confirmCompletion,
);

app.delete(
  '/api/assignments/:assignment_id/complete',
  checkAuthentication,
  cancelCompletion,
);

app.get(
  '/api/users/:user_id/completions',
  checkAuthentication,
  listConfirmedCompletions,
);

// ====================================
// Courses routes
// ====================================

app.get('/api/courses', listCourses);

app.get(
  '/api/courses/students/:user_id',
  checkAuthentication,
  listStudentCourses,
);

app.get(
  '/api/courses/professors/:user_id',
  checkAuthentication,
  listProfessorCourses,
);

app.get('/api/courses/:course_id', findCourse);

app.post('/api/courses', checkAuthentication, createCourse);

app.patch('/api/courses/:course_id', checkAuthentication, updateCourse);

app.delete('/api/courses/:course_id', checkAuthentication, deleteCourse);

app.post(
  '/api/courses/:course_id/enroll',
  checkAuthentication,
  isFull,
  confirmEnrollment,
);

app.delete(
  '/api/courses/:course_id/enroll',
  checkAuthentication,
  cancelEnrollment,
);

// Fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, pathToFrontend, 'index.html'));
});

// ====================================
// Global Error Handling
// ====================================

const handleError = (err, req, res, next) => {
  console.error(err);

  res.status(500).send({
    message: 'Internal Server Error',
  });
};

app.use(handleError);
// ====================================
// Listen
// ====================================

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
