import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

function LoginPage({ loggedIn, checkLoggedIn }) {
    return (
      <main>
        <nav>
            <NavBar page='login' loggedIn={loggedIn} checkLoggedIn={checkLoggedIn} />
        </nav>
        <LoginForm checkLoggedIn={checkLoggedIn} />
      </main>
    )
}

export default LoginPage;