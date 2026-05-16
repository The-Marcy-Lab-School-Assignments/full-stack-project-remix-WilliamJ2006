import { loginUser } from '../adapters/auth-adapters';

const LoginForm = ({ checkLoggedIn }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const values = {
      username: form.elements.username.value,
      password: form.elements.password.value,
    };
    const { data, error } = await loginUser(values.username, values.password);
    if (error) return console.error(error);
    await checkLoggedIn();
    form.reset();
  };
  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login to your account</h2>

      <label htmlFor="username-input">Username</label>
      <input id="username-input" name="username" type="text" required />

      <label htmlFor="password-input">Password</label>
      <input id="password-input" name="password" type="password" required />

      <button type="submit">Log In</button>
    </form>
  );
};

export default LoginForm;
