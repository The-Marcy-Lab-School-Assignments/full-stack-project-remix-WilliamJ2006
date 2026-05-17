const pool = require('../db/pool');

module.exports.complete = async (assignment_id, student_id) => {
  const query = `
    INSERT INTO assignment_completions (
      assignment_id,
      student_id
    )
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *
  `;

  const { rows } = await pool.query(query, [assignment_id, student_id]);

  return rows[0] || null;
};

module.exports.uncomplete = async (assignment_id, student_id) => {
  const query = `
    DELETE FROM assignment_completions
    WHERE assignment_id = $1
      AND student_id = $2
    RETURNING *
  `;

  const { rows } = await pool.query(query, [assignment_id, student_id]);

  return rows[0] || null;
};

module.exports.completionsByStudent = async (student_id) => {
  const query = `
    SELECT
      assignments.*,
      courses.course_name

    FROM assignment_completions

    JOIN assignments
      ON assignment_completions.assignment_id =
         assignments.assignment_id

    JOIN courses
      ON assignments.course_id = courses.course_id

    WHERE assignment_completions.student_id = $1

    ORDER BY assignments.due_date
  `;

  const { rows } = await pool.query(query, [student_id]);

  return rows;
};

module.exports.verifyEnrollment = async (assignment_id, student_id) => {
  const query = `
    SELECT 1

    FROM assignments

    JOIN courses
      ON assignments.course_id = courses.course_id

    JOIN enrollments
      ON courses.course_id = enrollments.course_id

    WHERE assignments.assignment_id = $1
      AND enrollments.student_id = $2
  `;

  const { rows } = await pool.query(query, [assignment_id, student_id]);

  return rows[0] || null;
};
