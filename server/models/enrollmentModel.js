const pool = require('../db/pool');

module.exports.enroll = async (course_id, student_id) => {
  const query = `
    INSERT INTO enrollments (course_id, student_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *
  `;

  const { rows } = await pool.query(query, [course_id, student_id]);

  return rows[0] || null;
};

module.exports.unenroll = async (course_id, student_id) => {
  const query = `
    DELETE FROM enrollments
    WHERE course_id = $1
      AND student_id = $2
    RETURNING *
  `;

  const { rows } = await pool.query(query, [course_id, student_id]);

  return rows[0] || null;
};

module.exports.enrollmentsByStudent = async (student_id) => {
  const query = `
    SELECT
      courses.*,
      users.username,
      (
        SELECT COUNT(enrollment_id)
        FROM enrollments
        WHERE enrollments.course_id = courses.course_id
      ) AS enrollment_count
    FROM enrollments
    JOIN courses
      ON enrollments.course_id = courses.course_id
    JOIN users
      ON courses.professor_id = users.user_id
    WHERE enrollments.student_id = $1
    ORDER BY courses.course_id
  `;

  const { rows } = await pool.query(query, [student_id]);

  return rows;
};

module.exports.getCapacityInfo = async (course_id) => {
  const query = `
    SELECT
      max_capacity,
      (
        SELECT COUNT(enrollment_id)
        FROM enrollments
        WHERE enrollments.course_id = courses.course_id
      ) AS enrollment_count
    FROM courses
    LEFT JOIN enrollments
      ON courses.course_id = enrollments.course_id
    WHERE courses.course_id = $1
    GROUP BY courses.course_id
  `;

  const { rows } = await pool.query(query, [course_id]);

  if (rows.length === 0) return false;

  return (
    parseInt(rows[0].enrollment_count || 0) < parseInt(rows[0].max_capacity)
  );
};
