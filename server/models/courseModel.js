const pool = require('../db/pool');

module.exports.list = async (user_id) => {
  const query = `
    SELECT
      courses.*,

      COUNT(enrollments.student_id) AS enrollment_count,

      EXISTS (
        SELECT 1
        FROM enrollments user_enrollments
        WHERE user_enrollments.course_id = courses.course_id
          AND user_enrollments.student_id = $1
      ) AS is_enrolled

    FROM courses

    LEFT JOIN enrollments
      ON courses.course_id = enrollments.course_id

    GROUP BY courses.course_id

    ORDER BY courses.course_id
  `;

  const { rows } = await pool.query(query, [user_id]);

  return rows;
};

module.exports.listByStudent = async (student_id) => {
  const { rows } = await pool.query(
    `
    SELECT
      courses.*,
      COUNT(enrollments.student_id) AS enrollment_count
    FROM enrollments
    JOIN courses
      ON enrollments.course_id = courses.course_id
    LEFT JOIN enrollments AS all_enrollments
      ON courses.course_id = all_enrollments.course_id
    WHERE enrollments.student_id = $1
    GROUP BY courses.course_id
    ORDER BY courses.course_id
    `,
    [student_id],
  );

  return rows;
};

module.exports.listByProfessor = async (professor_id) => {
  const { rows } = await pool.query(
    `
    SELECT
      courses.*,
      COUNT(enrollments.student_id) AS enrollment_count
    FROM courses
    LEFT JOIN enrollments
      ON courses.course_id = enrollments.course_id
    WHERE courses.professor_id = $1
    GROUP BY courses.course_id
    ORDER BY courses.course_id
    `,
    [professor_id],
  );

  return rows;
};

module.exports.create = async (
  course_name,
  description,
  max_capacity,
  professor_id,
) => {
  const query = `INSERT INTO courses (
      professor_id,
      course_name,
      description,
      max_capacity
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *`;
  const { rows } = await pool.query(query, [
    professor_id,
    course_name,
    description,
    max_capacity,
  ]);
  return rows[0];
};

module.exports.update = async (
  course_name,
  description,
  max_capacity,
  professor_id,
) => {
  const query = `INSERT INTO courses (
      professor_id,
      course_name,
      description,
      max_capacity
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *`;
  const { rows } = await pool.query(query, [
    professor_id,
    course_name,
    description,
    max_capacity,
  ]);
  return rows[0];
};

module.exports.find = async (course_id) => {
  const query = `SELECT * FROM courses WHERE course_id = $1`;
  const { rows } = await pool.query(query, [course_id]);
  return rows[0] || null;
};

module.exports.update = async (
  course_id,
  course_name,
  description,
  max_capacity,
) => {
  const query = `
    UPDATE courses
    SET
      course_name = COALESCE($1, course_name),
      description = COALESCE($2, description),
      max_capacity = COALESCE($3, max_capacity)
    WHERE course_id = $4
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    course_name,
    description,
    max_capacity,
    course_id,
  ]);

  return rows[0] || null;
};

module.exports.destroy = async (course_id) => {
  const query = `DELETE FROM courses WHERE course_id = $1 RETURNING *`;
  const { rows } = await pool.query(query, [course_id]);
  return rows[0] || null;
};
