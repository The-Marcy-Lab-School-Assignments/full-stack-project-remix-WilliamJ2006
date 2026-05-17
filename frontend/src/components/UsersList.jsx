import { useState, useEffect } from 'react';

import {
  fetchUsersByRole,
  fetchUsersByEnrollments,
  fetchUsersByCourses,
} from '../adapters/user-adapters';

import '../css/UserList.css';

function UsersList({ user, onUsersClick }) {
  const [users, setUsers] = useState([]);
  const [filterRelated, setFilterRelated] = useState(false);

  const getUsers = async () => {
    let response;

    if (filterRelated) {
      response =
        user.role === 'professor'
          ? await fetchUsersByEnrollments(user.user_id)
          : await fetchUsersByCourses(user.user_id);
    } else {
      const role =
        user.role === 'professor'
          ? 'student'
          : 'professor';

      response =
        await fetchUsersByRole(role);
    }

    const { data, error } = response;

    if (error) {
      return console.error(error);
    }

    setUsers(
      Array.isArray(data) ? data : [],
    );
  };

  useEffect(() => {
    getUsers();
  }, [filterRelated]);

  return (
    <main className="usersPage">
      <header className="usersHeader">
        <h1 className="usersTitle">
          {user.role === 'professor'
            ? 'Students'
            : 'Professors'}
        </h1>

        <nav className="usersControls">
          <button
            onClick={() =>
              setFilterRelated(
                (prev) => !prev,
              )
            }
          >
            {filterRelated
              ? 'Show All'
              : user.role ===
                    'professor'
                ? 'My Students'
                : 'My Professors'}
          </button>
        </nav>
      </header>

      <section
        className="usersGrid"
        key={users
          .map((user) => user.user_id)
          .join('-')}
      >
        {users.length === 0 ? (
          <h2>
            No{' '}
            {user.role ===
            'professor'
              ? 'students'
              : 'professors'}{' '}
            found.
          </h2>
        ) : (
          users.map((user, index) => (
            <article
              className="userCard"
              key={user.user_id}
              style={{
                ['--i']: index,
              }}
            >
              <p className="party">
                party
              </p>

              <h2 className="userName">
                {user.username}
              </h2>

              {filterRelated &&
                user.course_name && (
                  <p className="userCourse">
                    {user.course_name}
                  </p>
                )}
            </article>
          ))
        )}
      </section>

      <footer className="usersFooter">
        <button
          className="returnButton"
          onClick={onUsersClick}
        >
          Return
        </button>
      </footer>
    </main>
  );
}

export default UsersList;