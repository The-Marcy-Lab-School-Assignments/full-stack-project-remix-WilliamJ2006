const pool = require('../db/pool');

module.exports.listByStudent = async (student_id) => {
  const query = `
    SELECT
      assignments.*,
      courses.course_name,
      COUNT(all_completions.student_id) AS completion_count,
      EXISTS (
        SELECT 1
        FROM assignment_completions student_completion
        WHERE student_completion.assignment_id = assignments.assignment_id
          AND student_completion.student_id = $1
      ) AS is_completed
    FROM enrollments
    JOIN courses
      ON enrollments.course_id = courses.course_id
    JOIN assignments
      ON courses.course_id = assignments.course_id
    LEFT JOIN assignment_completions AS all_completions
      ON assignments.assignment_id = all_completions.assignment_id
    WHERE enrollments.student_id = $1
    GROUP BY
      assignments.assignment_id,
      courses.course_name
    ORDER BY assignments.due_date
  `;

  const { rows } = await pool.query(query, [student_id]);
  return rows;
};

module.exports.listByProfessor = async (professor_id) => {
  const query = `
    SELECT
      assignments.*,
      courses.course_name,
      COUNT(assignment_completions.student_id) AS completion_count
    FROM assignments
    JOIN courses
      ON assignments.course_id = courses.course_id
    LEFT JOIN assignment_completions
      ON assignments.assignment_id = assignment_completions.assignment_id
    WHERE courses.professor_id = $1
    GROUP BY
      assignments.assignment_id,
      courses.course_name
    ORDER BY assignments.due_date
  `;

  const { rows } = await pool.query(query, [professor_id]);
  return rows;
};

module.exports.find = async (assignment_id) => {
  const query = `
    SELECT
      assignments.*,
      courses.professor_id
    FROM assignments
    JOIN courses
      ON assignments.course_id = courses.course_id
    WHERE assignments.assignment_id = $1
  `;

  const { rows } = await pool.query(query, [assignment_id]);
  return rows[0] || null;
};

module.exports.create = async (title, description, due_date, course_id) => {
  const query = `
    INSERT INTO assignments (
      title,
      description,
      due_date,
      course_id
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    title,
    description,
    due_date,
    course_id,
  ]);

  return rows[0];
};

module.exports.update = async (assignment_id, title, description, due_date) => {
  const query = `
    UPDATE assignments
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      due_date = COALESCE($3, due_date)
    WHERE assignment_id = $4
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    title,
    description,
    due_date,
    assignment_id,
  ]);

  return rows[0] || null;
};

module.exports.destroy = async (assignment_id) => {
  const query = `
    DELETE FROM assignments
    WHERE assignment_id = $1
    RETURNING *
  `;

  const { rows } = await pool.query(query, [assignment_id]);
  return rows[0] || null;
};

module.exports.listCompletionStatus = async (assignment_id) => {
  const query = `
    SELECT
      users.user_id,
      users.username,
      EXISTS (
        SELECT 1
        FROM assignment_completions
        WHERE assignment_completions.assignment_id = $1
          AND assignment_completions.student_id = users.user_id
      ) AS completed
    FROM assignments
    JOIN courses
      ON assignments.course_id = courses.course_id
    JOIN enrollments
      ON courses.course_id = enrollments.course_id
    JOIN users
      ON enrollments.student_id = users.user_id
    WHERE assignments.assignment_id = $1
    ORDER BY users.username
  `;

  const { rows } = await pool.query(query, [assignment_id]);
  return rows;
};
