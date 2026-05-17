import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import RegisterForm from '../components/RegisterForm';
import BackgroundVideo from '../components/BackgroundVideo';

const RegisterPage = ({ loggedIn, checkLoggedIn }) => {
  return (
    <main className="registerPage">
      <BackgroundVideo
        intro="/videos/home-intro.mp4"
        loop="/videos/home-loop.mp4"
      />
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
