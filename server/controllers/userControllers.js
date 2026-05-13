const userModel = require('../models/userModel');

const listUsers = async (req, res, next) => {
  try {
    const users = await userModel.list();
    res.send(users);
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
    const user = await userModel.update(userId, password, email);
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.user_id);
    if (userId !== req.session.user.user_id) {
      return res
        .status(403)
        .send({ message: 'You can only delete your own account.' });
    }
    const user = await userModel.delete(userId);
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { listUsers, updateUser, deleteUser };
