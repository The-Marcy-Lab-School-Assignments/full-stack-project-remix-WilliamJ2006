function CreateCourse({ onCreate }) {
  return (
    <form className="courseForm" onSubmit={onCreate}>
      <h2>Create Course</h2>
      <input
        name="course_name"
        type="text"
        placeholder="Course Name"
        required
      />

      <input
        name="description"
        type="text"
        placeholder="Description"
        required
      />

      <input
        name="max_capacity"
        type="number"
        placeholder="Max Capacity"
        required
      />

      <button type="submit">Create</button>
    </form>
  );
}

export default CreateCourse;
