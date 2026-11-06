import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import LoginForm from '../components/LoginForm';
import BackgroundVideo from '../components/BackgroundVideo';
import { useNavigate } from 'react-router-dom';

function LoginPage({ loggedIn, checkLoggedIn }) {
  return (
    <main className="loginPage">
      <BackgroundVideo
        intro="/videos/home-intro.mp4"
        loop="/videos/home-loop.mp4"
      />
      <nav>
        <NavBar
          page="login"
          loggedIn={loggedIn}
          checkLoggedIn={checkLoggedIn}
        />
      </nav>
      <LoginForm checkLoggedIn={checkLoggedIn} />
    </main>
  );
}

export default LoginPage;
