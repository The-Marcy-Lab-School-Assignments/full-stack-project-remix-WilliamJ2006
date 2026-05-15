import { Routes, Route, useNavigate } from 'react-router-dom';
import './css/App.css';
import { useState, useEffect } from 'react';

import LoginPage from './pages/Login';
import { authUser } from './adapters/auth-adapters';

import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';

function App() {
  const [loggedIn, setLogIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const checkLoggedIn = async () => {
    const { data, error } = await authUser();
    if (error) {
      setLogIn(false);
      setUser(null);
      navigate('/');
      return;
    }
    setLogIn(true);
    setUser(data);
    navigate('/dashboard');
    console.log(data);
  };
  useEffect(() => {
    checkLoggedIn();
  }, []);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LoginPage loggedIn={loggedIn} checkLoggedIn={checkLoggedIn} />
        }
      />

      <Route
        path="/register"
        element={
          <RegisterPage loggedIn={loggedIn} checkLoggedIn={checkLoggedIn} />
        }
      />

      <Route
        path="/dashboard"
        element={
          <DashboardPage
            loggedIn={loggedIn}
            checkLoggedIn={checkLoggedIn}
            user={user}
          />
        }
      />
    </Routes>
  );
}

export default App;
