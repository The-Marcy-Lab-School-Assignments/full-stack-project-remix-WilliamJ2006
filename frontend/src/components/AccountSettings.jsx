import { useState } from 'react';

import { fetchUpdateUser, fetchDeleteUser } from '../adapters/user-adapters';

import '../css/AccountSettings.css';

function AccountSettings({ user, onSettingsClick, checkLoggedIn }) {
  const [currentMessage, setMessage] = useState('');

  const handleClick = async () => {
    const { data, error } = await fetchDeleteUser(user.user_id);
    if (data.message) setMessage(data.message);
    if (error) return console.error(error);
    await checkLoggedIn();
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const values = {
      password: form.elements.password.value,
      email: form.elements.email.value,
    };

    if (!values.password) values.password = null;
    if (!values.email) values.email = null;

    const { data, error } = await fetchUpdateUser(
      user.user_id,
      values.password,
      values.email,
    );

    if (data.message) {
      setMessage(data.message);
    }

    if (error) {
      return console.error(error);
    }

    setMessage('Successfully updated');

    form.reset();
  };

  return (
    <main className="settingsPage">
      <form onSubmit={handleSubmit} className="update-form">
        <h2>Update Your Account</h2>

        <label htmlFor="password-input">New Password</label>

        <input
          id="password-input"
          name="password"
          type="password"
          placeholder="Unchanged"
        />

        <label htmlFor="email-input">New Email</label>

        <input
          id="email-input"
          name="email"
          type="email"
          placeholder="Unchanged"
        />

        <div className="settingsActions">
          <button type="submit">Accept Changes</button>

          <p className="settingsMessage">{currentMessage}</p>
        </div>
      </form>

      <footer>
        <button className="returnButton" onClick={onSettingsClick}>
          Return
        </button>
        <button className="deleteButton" onClick={() => handleClick()}>
          Delete Account
        </button>
      </footer>
    </main>
  );
}

export default AccountSettings;
