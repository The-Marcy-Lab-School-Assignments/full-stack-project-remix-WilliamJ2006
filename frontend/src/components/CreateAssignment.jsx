function CreateAssignment({ onCreate, professorCourses }) {
  return (
    <form className="assignmentForm" onSubmit={onCreate}>
      <h2>Create Assignment</h2>

      <input name="title" type="text" placeholder="Title" required />

      <input
        name="description"
        type="text"
        placeholder="Description"
        required
      />

      <input name="due_date" type="date" required />

      <select name="course_id" required defaultValue="">
        <option value="" disabled>
          Select Course
        </option>

        {professorCourses.map((course) => (
          <option key={course.course_id} value={course.course_id}>
            {course.course_name}
          </option>
        ))}
      </select>

      <button type="submit">Create Assignment</button>
    </form>
  );
}

export default CreateAssignment;
