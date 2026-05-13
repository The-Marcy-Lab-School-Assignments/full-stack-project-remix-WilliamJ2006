import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logoutUser } from '../fetch-helpers';

function NavBar({ page, loggedIn, checkLoggedIn }) {
  if (loggedIn) {
    const handleClick = async () => {
      const { error } = await logoutUser();
      if (error) return console.error(error);
      await checkLoggedIn();
    };
    return (
      <ul className="navBar">
        <li>
          <h1 className="logo">Assignment Tracker - length</h1>
        </li>
        <ul className="navLinks">
          <li>
            <button>Home</button>
          </li>
          <li>
            <button>Assignments</button>
          </li>
          <li>
            <button>Instructors</button>
          </li>
          <li>
            <button onClick={handleClick}>Main Menu</button>
          </li>
        </ul>
      </ul>
    );
  }
  return (
    <ul className="navBar">
      <li>
        <h1 className="logo">{page === 'login' ? 'Login' : 'Register'} Page</h1>
      </li>
      <ul className="navLinks">
        <li>
          <Link to={page === 'login' ? '/register' : '/'}>
            {page === 'login' ? 'Register' : 'Login'}
          </Link>
        </li>
      </ul>
    </ul>
  );
}

export default NavBar;
