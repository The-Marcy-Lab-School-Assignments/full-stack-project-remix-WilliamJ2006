// Helper resusable fetch function
const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok)
      throw new Error(
        `Fetch failed. ${response.status} ${response.statusText}`,
      );
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Fetch all courses or assignments.
export const fetchAllTodos = async () => {
  return handleFetch('/api/todos');
};

//fetch post endpoint, pass in needed parameters to req body
export const createTodo = async (title) => {
  return handleFetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
};

// Fetch patch endpoint to update course or assignment
export const updateTodo = async (todo_id, updates) => {
  return handleFetch(`/api/todos/${todo_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
};

// Fetch from delete endpoint to delete course or assignment
export const deleteTodo = async (todo_id) => {
  return handleFetch(`/api/todos/${todo_id}`, { method: 'DELETE' });
};
