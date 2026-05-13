const bcrypt = require('bcrypt');
const pool = require('../db/pool');

const SALT_ROUNDS = 8;

module.exports.list = async () => {
  const { rows } = await pool.query(
    `SELECT user_id, username, email, role FROM users ORDER BY user_id`,
  );
  return rows;
};

module.exports.find = async (user_id) => {
  const { rows } = await pool.query(
    `SELECT user_id, username, email, role FROM users WHERE user_id = $1`,
    [user_id],
  );
  return rows[0] || null;
};

module.exports.findByUsername = async (username) => {
  const { rows } = await pool.query(
    `SELECT user_id, username, email, role FROM users WHERE username = $1`,
    [username],
  );
  return rows[0] || null;
};

module.exports.findByEmail = async (email) => {
  const { rows } = await pool.query(
    `SELECT user_id, username, email, role FROM users WHERE email = $1`,
    [email],
  );
  return rows[0] || null;
};

module.exports.create = async (username, password, email, role) => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const query = `INSERT INTO users (username, password_hash, email, role) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email, role`;
  const { rows } = await pool.query(query, [
    username.trim(),
    passwordHash,
    email.trim(),
    role,
  ]);
  return rows[0];
};

module.exports.validatePassword = async (username, password) => {
  const { rows } = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  const user = rows[0];
  if (!user) return null;

  const compare = await bcrypt.compare(password, user.password_hash);
  if (!compare) return null;

  return {
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
};

module.exports.update = async (user_id, password, email) => {
  let passwordHash = null;
  if (password) passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const query = `UPDATE users SET password_hash = COALESCE($1, password_hash), email = COALESCE($2, email) WHERE user_id = $3 RETURNING user_id, username, email, role`;
  const { rows } = await pool.query(query, [passwordHash, email, user_id]);
  return rows[0] || null;
};

module.exports.delete = async (user_id) => {
  const query = `DELETE FROM users WHERE user_id = $1 RETURNING user_id, username, email, role`;
  const { rows } = await pool.query(query, [user_id]);
  return rows[0] || null;
};
