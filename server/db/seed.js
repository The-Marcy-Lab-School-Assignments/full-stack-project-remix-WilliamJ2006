const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  await pool.query('DROP TABLE IF EXISTS assignment_completions');
  await pool.query('DROP TABLE IF EXISTS assignments');
  await pool.query('DROP TABLE IF EXISTS enrollments');
  await pool.query('DROP TABLE IF EXISTS courses');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT NOT NULL UNIQUE,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL CHECK (role IN ('student', 'professor')),
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE courses (
      course_id     SERIAL PRIMARY KEY,
      professor_id  INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      course_name   TEXT NOT NULL,
      description   TEXT,
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      max_capacity  INTEGER NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE enrollments (
      enrollment_id   SERIAL PRIMARY KEY,
      student_id      INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      course_id       INTEGER NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
      created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE assignments (
      assignment_id   SERIAL PRIMARY KEY,
      name            TEXT NOT NULL,
      course_id       INTEGER NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
      description     TEXT,
      due_date        DATE,
      created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE assignment_completions (
      completion_id   SERIAL PRIMARY KEY,
      assignment_id   INTEGER NOT NULL REFERENCES assignments(assignment_id) ON DELETE CASCADE,
      student_id      INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      completed_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (assignment_id, student_id)
    )
  `);

  const mitsuruHash = await bcrypt.hash('kirijo123', SALT_ROUNDS);
  const yukariHash = await bcrypt.hash('archer456', SALT_ROUNDS);
  const junpeiHash = await bcrypt.hash('ace789', SALT_ROUNDS);
  const aigisHash = await bcrypt.hash('toaster999', SALT_ROUNDS);
  const akihikoHash = await bcrypt.hash('boxing321', SALT_ROUNDS);

  const insertUserSql = `
    INSERT INTO users (username, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING user_id;
  `;

  const mitsuruResponse = await pool.query(insertUserSql, [
    'mitsuru',
    'mitsuru@gekkan.edu',
    mitsuruHash,
    'professor',
  ]);

  const yukariResponse = await pool.query(insertUserSql, [
    'yukari',
    'yukari@gekkan.edu',
    yukariHash,
    'student',
  ]);

  const junpeiResponse = await pool.query(insertUserSql, [
    'junpei',
    'junpei@gekkan.edu',
    junpeiHash,
    'student',
  ]);

  const aigisResponse = await pool.query(insertUserSql, [
    'aigis',
    'aigis@gekkan.edu',
    aigisHash,
    'student',
  ]);

  const akihikoResponse = await pool.query(insertUserSql, [
    'akihiko',
    'akihiko@gekkan.edu',
    akihikoHash,
    'professor',
  ]);

  const mitsuruId = mitsuruResponse.rows[0].user_id;
  const yukariId = yukariResponse.rows[0].user_id;
  const junpeiId = junpeiResponse.rows[0].user_id;
  const aigisId = aigisResponse.rows[0].user_id;
  const akihikoId = akihikoResponse.rows[0].user_id;

  const courseQuery = `
    INSERT INTO courses (
      professor_id,
      course_name,
      description,
      max_capacity
    )
    VALUES ($1, $2, $3, $4)
    RETURNING course_id;
  `;

  const tacticsResponse = await pool.query(courseQuery, [
    mitsuruId,
    'Shadow Tactics',
    'Strategic operations and field command fundamentals.',
    30,
  ]);

  const evokerResponse = await pool.query(courseQuery, [
    akihikoId,
    'Persona Combat Training',
    'Physical conditioning and Persona combat techniques.',
    20,
  ]);

  const tacticsCourseId = tacticsResponse.rows[0].course_id;
  const evokerCourseId = evokerResponse.rows[0].course_id;

  const enrollmentQuery = `
    INSERT INTO enrollments (student_id, course_id)
    VALUES ($1, $2);
  `;

  await pool.query(enrollmentQuery, [yukariId, tacticsCourseId]);
  await pool.query(enrollmentQuery, [junpeiId, tacticsCourseId]);
  await pool.query(enrollmentQuery, [aigisId, tacticsCourseId]);

  await pool.query(enrollmentQuery, [yukariId, evokerCourseId]);
  await pool.query(enrollmentQuery, [junpeiId, evokerCourseId]);

  const assignmentQuery = `
    INSERT INTO assignments (
      name,
      course_id,
      description,
      due_date
    )
    VALUES ($1, $2, $3, $4)
    RETURNING assignment_id;
  `;

  const assignmentOneResponse = await pool.query(assignmentQuery, [
    'Tartarus Exploration Report',
    tacticsCourseId,
    'Write a report analyzing enemy behavior patterns in Tartarus.',
    '2026-05-20',
  ]);

  const assignmentTwoResponse = await pool.query(assignmentQuery, [
    'Evoker Maintenance Quiz',
    evokerCourseId,
    'Quiz covering proper Evoker handling procedures.',
    '2026-05-24',
  ]);

  const assignmentThreeResponse = await pool.query(assignmentQuery, [
    'Full Moon Operation Plan',
    tacticsCourseId,
    'Prepare a tactical operation strategy for the upcoming Full Moon.',
    '2026-05-30',
  ]);

  const assignmentOneId = assignmentOneResponse.rows[0].assignment_id;
  const assignmentTwoId = assignmentTwoResponse.rows[0].assignment_id;
  const assignmentThreeId = assignmentThreeResponse.rows[0].assignment_id;

  const completionQuery = `
    INSERT INTO assignment_completions (
      assignment_id,
      student_id
    )
    VALUES ($1, $2);
  `;

  await pool.query(completionQuery, [assignmentOneId, yukariId]);
  await pool.query(completionQuery, [assignmentOneId, aigisId]);

  await pool.query(completionQuery, [assignmentTwoId, junpeiId]);

  await pool.query(completionQuery, [assignmentThreeId, yukariId]);

  console.log('Database seeded.');
};

seed()
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
