import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import BackgroundVideo from '../components/BackgroundVideo';
import DashboardButtons from '../components/DashboardButtons';
import UsersList from '../components/UsersList';
import AccountSettings from '../components/AccountSettings';
import { useNavigate } from 'react-router-dom';

function DashboardPage({ loggedIn, checkLoggedIn, user }) {
  const [showUsers, setShowUsers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const onUsersClick = () => setShowUsers(!showUsers);
  const onSettingsClick = () => setShowSettings(!showSettings);
  if (showUsers) {
    return <UsersList user={user} onUsersClick={onUsersClick} />;
  }
  if (showSettings) {
    return (
      <AccountSettings
        user={user}
        onSettingsClick={onSettingsClick}
        checkLoggedIn={checkLoggedIn}
      />
    );
  }
  return (
    <main>
      <BackgroundVideo />
      <nav>
        <NavBar page="dashboard" loggedIn={loggedIn} user={user} />
      </nav>
      <section>
        <DashboardButtons
          checkLoggedIn={checkLoggedIn}
          user={user}
          loggedIn={loggedIn}
          onUsersClick={onUsersClick}
          onSettingsClick={onSettingsClick}
        />
      </section>
    </main>
  );
}

export default DashboardPage;
