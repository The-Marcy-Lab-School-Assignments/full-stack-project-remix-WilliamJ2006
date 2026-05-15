const userModel = require('../models/userModel');

const listUsers = async (req, res, next) => {
  try {
    const users = await userModel.list();
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const listUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const users = await userModel.listByRole(role);
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const listStudentsByProfessorCourses = async (req, res, next) => {
  try {
    const userId = Number(req.params.user_id);
    const students = await userModel.listUserByEnrollments(userId);
    res.send(students);
  } catch (err) {
    next(err);
  }
};

const listProfessorsByStudentCourses = async (req, res, next) => {
  try {
    const userId = Number(req.params.user_id);
    const professors = await userModel.listUsersByCourses(userId);
    res.send(professors);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.user_id);
    if (userId !== req.session.user.user_id) {
      return res.status(403).send({
        message: 'You can only update your own account.',
      });
    }

    const { password, email } = req.body;

    if (!password && !email)
      return res.status(404).send({
        message: 'Please fill out atleast one field',
      });
      
    const user = await userModel.update(userId, password, email);

    if (!user) {
      return res.status(404).send({
        message: 'User not found',
      });
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.user_id);

    if (userId !== req.session.user.user_id) {
      return res.status(403).send({
        message: 'You can only delete your own account.',
      });
    }

    const user = await userModel.delete(userId);

    if (!user) {
      return res.status(404).send({
        message: 'User not found',
      });
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listUsers,
  listUsersByRole,
  listStudentsByProfessorCourses,
  listProfessorsByStudentCourses,
  updateUser,
  deleteUser,
};
