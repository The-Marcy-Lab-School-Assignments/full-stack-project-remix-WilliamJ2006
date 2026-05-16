import '../css/EditCoursesForm.css';

function EditCourseForm({ handleEdit, showEdit }) {
  return (
    <main className="editCoursePage">
      <form className="courseForm" onSubmit={handleEdit}>
        <h2>Edit Course</h2>
        <input
          name="course_name"
          type="text"
          placeholder={showEdit[2] ? showEdit[2] : 'Course Name'}
        />

        <input
          name="description"
          type="text"
          placeholder={showEdit[3] ? showEdit[3] : 'Description'}
        />

        <input
          name="max_capacity"
          type="number"
          placeholder={showEdit[4] ? showEdit[4] : 'Max Capacity'}
        />

        <button type="submit">Save Changes</button>
      </form>
    </main>
  );
}

export default EditCourseForm;
