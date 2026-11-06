const assignmentModel = require('../models/assignmentModel');
const courseModel = require('../models/courseModel');

const listStudentAssignments = async (req, res, next) => {
  try {
    if (req.session.user.role !== 'student') {
      return res.status(403).send({
        message: 'Only students can view student assignments.',
      });
    }

    const user_id = Number(req.params.user_id);

    if (user_id !== req.session.user.user_id) {
      return res.status(403).send({
        message: 'You can only view your own assignments.',
      });
    }

    const assignments = await assignmentModel.listByStudent(user_id);

    res.send(assignments);
  } catch (err) {
    next(err);
  }
};

const listProfessorAssignments = async (req, res, next) => {
  try {
    if (req.session.user.role !== 'professor') {
      return res.status(403).send({
        message: 'Only professors can view professor assignments.',
      });
    }

    const user_id = Number(req.params.user_id);

    if (user_id !== req.session.user.user_id) {
      return res.status(403).send({
        message: 'You can only view your own assignments.',
      });
    }

    const assignments = await assignmentModel.listByProfessor(user_id);

    res.send(assignments);
  } catch (err) {
    next(err);
  }
};

const findAssignment = async (req, res, next) => {
  try {
    const assignment_id = Number(req.params.assignment_id);

    const assignment = await assignmentModel.find(assignment_id);

    if (!assignment) {
      return res.status(404).send({
        message: 'Assignment not found.',
      });
    }

    res.send(assignment);
  } catch (err) {
    next(err);
  }
};

const createAssignment = async (req, res, next) => {
  try {
    if (req.session.user.role !== 'professor') {
      return res.status(403).send({
        message: 'Only professors can create assignments.',
      });
    }

    const { title, description, due_date, course_id } = req.body;

    const course = await courseModel.find(course_id);

    if (!course) {
      return res.status(404).send({
        message: 'Course not found.',
      });
    }

    if (course.professor_id !== req.session.user.user_id) {
      return res.status(403).send({
        message: 'You can only create assignments for your own courses.',
      });
    }

    const assignment = await assignmentModel.create(
      title,
      description,
      due_date,
      course_id,
    );

    res.status(201).send(assignment);
  } catch (err) {
    next(err);
  }
};

const updateAssignment = async (req, res, next) => {
  try {
    if (req.session.user.role !== 'professor') {
      return res.status(403).send({
        message: 'Only professors can update assignments.',
      });
    }

    const assignment_id = Number(req.params.assignment_id);

    const existing = await assignmentModel.find(assignment_id);

    if (!existing) {
      return res.status(404).send({
        message: 'Assignment not found.',
      });
    }

    if (existing.professor_id !== req.session.user.user_id) {
      return res.status(403).send({
        message: 'You can only update assignments for your own courses.',
      });
    }

    const { title, description, due_date } = req.body;

    const updatedAssignment = await assignmentModel.update(
      assignment_id,
      title,
      description,
      due_date,
    );

    res.send(updatedAssignment);
  } catch (err) {
    next(err);
  }
};

const deleteAssignment = async (req, res, next) => {
  try {
    if (req.session.user.role !== 'professor') {
      return res.status(403).send({
        message: 'Only professors can delete assignments.',
      });
    }

    const assignment_id = Number(req.params.assignment_id);

    const existing = await assignmentModel.find(assignment_id);

    if (!existing) {
      return res.status(404).send({
        message: 'Assignment not found.',
      });
    }

    if (existing.professor_id !== req.session.user.user_id) {
      return res.status(403).send({
        message: 'You can only delete assignments for your own courses.',
      });
    }

    const deletedAssignment = await assignmentModel.destroy(assignment_id);

    res.send(deletedAssignment);
  } catch (err) {
    next(err);
  }
};

const listAssignmentCompletionStatus = async (req, res, next) => {
  try {
    if (req.session.user.role !== 'professor') {
      return res.status(403).send({
        message: 'Only professors can view assignment completion status.',
      });
    }

    const assignment_id = Number(req.params.assignment_id);

    const assignment = await assignmentModel.find(assignment_id);

    if (!assignment) {
      return res.status(404).send({
        message: 'Assignment not found.',
      });
    }

    if (assignment.professor_id !== req.session.user.user_id) {
      return res.status(403).send({
        message:
          'You can only view completion status for your own assignments.',
      });
    }

    const completionStatus =
      await assignmentModel.listCompletionStatus(assignment_id);

    res.send(completionStatus);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listStudentAssignments,
  listProfessorAssignments,
  findAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  listAssignmentCompletionStatus,
};
