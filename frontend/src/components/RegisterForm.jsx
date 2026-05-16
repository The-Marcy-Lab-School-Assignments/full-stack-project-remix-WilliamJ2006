import { createUser } from '../adapters/auth-adapters';

const ROLES = ['student', 'professor'];

const RegisterForm = ({ checkLoggedIn }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const values = {
      username: form.elements.username.value,
      email: form.elements.email.value,
      role: form.elements.role.value,
      password: form.elements.password.value,
    };
    const { data, error } = await createUser(
      values.username,
      values.email,
      values.role,
      values.password,
    );
    if (error) return console.error(error);
    await checkLoggedIn();
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Register your account</h2>

      <label htmlFor="username-input">Username</label>
      <input id="username-input" name="username" type="text" required />

      <label htmlFor="email-input">Email</label>
      <input id="email-input" name="email" type="email" required />

      <label htmlFor="password-input">Password</label>
      <input id="password-input" name="password" type="password" required />

      <label htmlFor="role-select">Role</label>
      <select id="role-select" name="role" required>
        <option value="">-- select --</option>
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      <button type="submit">Register Account</button>
    </form>
  );
};

export default RegisterForm;
