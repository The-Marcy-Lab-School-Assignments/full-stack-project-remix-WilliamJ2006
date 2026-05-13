import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import BackgroundVideo from '../components/BackgroundVideo';
import { useNavigate } from 'react-router-dom';

function DashboardPage({ loggedIn, checkLoggedIn }) {
  return (
    <main>
      <BackgroundVideo />
      <nav>
        <NavBar
          page="dashboard"
          loggedIn={loggedIn}
          checkLoggedIn={checkLoggedIn}
        />
      </nav>
    </main>
  );
}

export default DashboardPage;
