
















module.exports.getCapacityInfo = async (course_id) => {
  const query = `SELECT max_capacity, 
  (
    SELECT COUNT(enrollment_id)
    FROM enrollments
    WHERE enrollment.course_id = courses.course_id
  ) AS enrollment_count 
   FROM courses
   LEFT JOIN enrollments
   ON courses.course_id = enrollments.enrollment_id
   WHERE courses.course_id = $1
   GROUP BY courses.course_id`;
  const { rows } = await pool.query(query, [course_id]);
  if (rows.length === 0) return false;
  return (
    parseInt(rows[0].enrollment_count ? rows[0].enrollment_count : 0) <
    parseInt(rows[0].max_capacity)
  );
};