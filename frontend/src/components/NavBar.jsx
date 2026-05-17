import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function NavBar({ page, loggedIn, user }) {
  if (loggedIn) {
    return (
      <ul style={{ position: 'absolute' }} className="navBar">
        <li>
          <h1 style={{ color: 'black' }} className="logo">
            {user?.username} - {user?.role}
          </h1>
        </li>
      </ul>
    );
  }
  return (
    <ul className="navBar">
      <li>
        <h1 className="logo">{page === 'login' ? 'Login' : 'Register'}</h1>
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
