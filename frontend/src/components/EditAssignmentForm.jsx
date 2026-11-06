import '../css/EditAssignmentForm.css';

function EditAssignmentForm({ handleEdit, showEdit }) {
  return (
    <main className="editAssignmentPage">
      <form className="assignmentForm" onSubmit={handleEdit}>
        <h2>Edit Assignment</h2>

        <input
          name="title"
          type="text"
          placeholder={showEdit[2] ? showEdit[2] : 'Title'}
        />

        <input
          name="description"
          type="text"
          placeholder={showEdit[3] ? showEdit[3] : 'Description'}
        />

        <input name="due_date" type="date" />

        <button type="submit">Save Changes</button>
      </form>
    </main>
  );
}

export default EditAssignmentForm;
