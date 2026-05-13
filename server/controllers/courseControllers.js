const courseModel = require('../models/courseModel');

const listCourses = async (req, res, next) => {
  try {
    const courses = await courseModel.list();
    res.send(courses);
  } catch (err) {
    next(err);
  }
};

module.exports = { listCourses };
