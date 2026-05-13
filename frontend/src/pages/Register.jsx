import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = ({ loggedIn, checkLoggedIn }) => {
  return (
    <main>
      <nav>
        <NavBar
          page="register"
          loggedIn={loggedIn}
          checkLoggedIn={checkLoggedIn}
        />
      </nav>
      <RegisterForm checkLoggedIn={checkLoggedIn} />
    </main>
  );
};

export default RegisterPage;
