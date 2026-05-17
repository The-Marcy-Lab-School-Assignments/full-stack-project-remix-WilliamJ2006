const enrollmentModel = require('../models/enrollmentModel');

const confirmEnrollment = async (req, res, next) => {
  try {
    if (req.session.user.role !== 'student') {
      return res.status(403).send({
        message: 'Only students can enroll in courses.',
      });
    }

    const courseId = req.params.course_id;

    const confirmation = await enrollmentModel.enroll(
      courseId,
      req.session.user.user_id,
    );

    if (!confirmation) {
      return res.status(200).send(true);
    }

    res.status(201).send(true);
  } catch (err) {
    next(err);
  }
};

const cancelEnrollment = async (req, res, next) => {
  try {
    if (req.session.user.role !== 'student') {
      return res.status(403).send({
        message: 'Only students can unenroll from courses.',
      });
    }

    const courseId = req.params.course_id;

    await enrollmentModel.unenroll(courseId, req.session.user.user_id);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const listConfirmedEnrollments = async (req, res, next) => {
  try {
    if (req.session.user.role !== 'student') {
      return res.status(403).send({
        message: 'Only students have enrollments.',
      });
    }

    const userId = Number(req.params.user_id);

    if (userId !== req.session.user.user_id) {
      return res.status(403).send({
        message: 'You can only view your own enrollments.',
      });
    }

    const enrollments = await enrollmentModel.enrollmentsByStudent(userId);

    res.send(enrollments);
  } catch (err) {
    next(err);
  }
};

const isFull = async (req, res, next) => {
  try {
    const courseId = req.params.course_id;

    const check = await enrollmentModel.getCapacityInfo(courseId);

    if (!check) {
      return res.status(400).send({
        error: 'Course is full',
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  confirmEnrollment,
  cancelEnrollment,
  listConfirmedEnrollments,
  isFull,
};
