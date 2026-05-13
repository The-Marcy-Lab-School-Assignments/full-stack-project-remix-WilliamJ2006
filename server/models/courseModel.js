const pool = require('../db/pool');

module.exports.list = async () => {
  const query = 'SELECT courses.* FROM courses ORDER BY course_id';
  const { rows } = await pool.query(query);
  return rows;
};
