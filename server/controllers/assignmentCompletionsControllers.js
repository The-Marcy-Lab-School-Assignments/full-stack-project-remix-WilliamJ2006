const assignmentCompletionModel = require('../models/assignmentCompletionsModel');

const assignmentModel = require('../models/assignmentModel');

const confirmCompletion = async (req, res, next) => {
  try {
    if (req.session.user.role !== 'student') {
      return res.status(403).send({
        message: 'Only students can complete assignments.',
      });
    }

    const assignment_id = Number(req.params.assignment_id);

    const assignment = await assignmentModel.find(assignment_id);

    if (!assignment) {
      return res.status(404).send({
        message: 'Assignment not found.',
      });
    }

    const enrolled = await assignmentCompletionModel.verifyEnrollment(
      assignment_id,
      req.session.user.user_id,
    );

    if (!enrolled) {
      return res.status(403).send({
        message: 'You can only complete assignments for enrolled courses.',
      });
    }

    const completion = await assignmentCompletionModel.complete(
      assignment_id,
      req.session.user.user_id,
    );

    if (!completion) {
      return res.status(200).send(true);
    }

    res.status(201).send(true);
  } catch (err) {
    next(err);
  }
};

const cancelCompletion = async (req, res, next) => {
  try {
    if (req.session.user.role !== 'student') {
      return res.status(403).send({
        message: 'Only students can uncomplete assignments.',
      });
    }

    const assignment_id = Number(req.params.assignment_id);

    await assignmentCompletionModel.uncomplete(
      assignment_id,
      req.session.user.user_id,
    );

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const listConfirmedCompletions = async (req, res, next) => {
  try {
    if (req.session.user.role !== 'student') {
      return res.status(403).send({
        message: 'Only students have assignment completions.',
      });
    }

    const user_id = Number(req.params.user_id);

    if (user_id !== req.session.user.user_id) {
      return res.status(403).send({
        message: 'You can only view your own completions.',
      });
    }

    const completions =
      await assignmentCompletionModel.completionsByStudent(user_id);

    res.send(completions);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  confirmCompletion,
  cancelCompletion,
  listConfirmedCompletions,
};
