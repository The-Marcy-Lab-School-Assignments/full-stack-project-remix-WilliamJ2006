const pool = require('../db/pool');

// Returns all todos for a specific user, ordered by creation time
// Returns all courses or assignments owned by a specific user.
module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM todos WHERE user_id = $1 ORDER BY todo_id ASC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single todo row (used for ownership checks before update/delete).
// Returns a single course or assignment used for checking ownership over updating/deleting.
module.exports.find = async (todo_id) => {
  const query = 'SELECT * FROM todos WHERE todo_id = $1';
  const { rows } = await pool.query(query, [todo_id]);
  return rows[0] || null;
};

// Creates a new todo. Returns the full todo row.
// Creates a new course or assignment, returns the full row.
module.exports.create = async (title, user_id) => {
  const query =
    'INSERT INTO todos (title, user_id) VALUES ($1, $2) RETURNING *';
  const { rows } = await pool.query(query, [title, user_id]);
  return rows[0];
};

// Updates is_complete for a todo. Returns the updated row.
// Update course or assignment information, returns the updated course or assignment.
module.exports.update = async (todo_id, { is_complete }) => {
  const query =
    'UPDATE todos SET is_complete = $1 WHERE todo_id = $2 RETURNING *';
  const { rows } = await pool.query(query, [is_complete, todo_id]);
  return rows[0];
};

// Deletes a todo by id
module.exports.destroy = async (todo_id) => {
  const query = 'DELETE FROM todos WHERE todo_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [todo_id]);
  return rows[0] || null;
};
