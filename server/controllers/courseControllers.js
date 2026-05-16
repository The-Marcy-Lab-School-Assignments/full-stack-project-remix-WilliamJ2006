const courseModel = require('../models/courseModel');

const listCourses = async (req, res, next) => {
  try {
    const courses = await courseModel.list(req.session.user.user_id);

    res.send(courses);
  } catch (err) {
    next(err);
  }
};

const listStudentCourses = async (req, res, next) => {
  try {
    const user_id = Number(req.params.user_id);

    const courses = await courseModel.listByStudent(user_id);

    res.send(courses);
  } catch (err) {
    next(err);
  }
};

const listProfessorCourses = async (req, res, next) => {
  try {
    const user_id = Number(req.params.user_id);

    const courses = await courseModel.listByProfessor(user_id);

    res.send(courses);
  } catch (err) {
    next(err);
  }
};

const findCourse = async (req, res, next) => {
  try {
    const course_id = Number(req.params.course_id);

    const course = await courseModel.find(course_id);

    if (!course) {
      return res.status(404).send({
        message: 'Course not found.',
      });
    }

    res.send(course);
  } catch (err) {
    next(err);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { course_name, description, max_capacity } = req.body;

    const course = await courseModel.create(
      course_name,
      description,
      max_capacity,
      req.session.user.user_id,
    );

    res.status(201).send(course);
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course_id = Number(req.params.course_id);

    const existing = await courseModel.find(course_id);

    if (!existing) {
      return res.status(404).send({
        message: 'Course not found.',
      });
    }

    if (existing.professor_id !== req.session.user.user_id) {
      return res.status(403).send({
        message: 'You can only update your own courses.',
      });
    }

    const { course_name, description, max_capacity } = req.body;

    const updatedCourse = await courseModel.update(
      course_id,
      course_name,
      description,
      max_capacity,
    );

    res.send(updatedCourse);
  } catch (err) {
    next(err);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const course_id = Number(req.params.course_id);

    const existing = await courseModel.find(course_id);

    if (!existing) {
      return res.status(404).send({
        message: 'Course not found.',
      });
    }

    if (existing.professor_id !== req.session.user.user_id) {
      return res.status(403).send({
        message: 'You can only delete your own courses.',
      });
    }

    const deletedCourse = await courseModel.destroy(course_id);

    res.send(deletedCourse);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listCourses,
  listStudentCourses,
  listProfessorCourses,
  findCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
