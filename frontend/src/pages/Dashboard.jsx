import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import BackgroundVideo from '../components/BackgroundVideo';
import DashboardButtons from '../components/DashboardButtons';
import UsersList from '../components/UsersList';
import AccountSettings from '../components/AccountSettings';
import Courses from '../components/Courses';
import Assignments from '../components/Assignments';
import { useNavigate } from 'react-router-dom';

function DashboardPage({ loggedIn, checkLoggedIn, user }) {
  const [showUsers, setShowUsers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [showAssignments, setShowAssignments] = useState(false);
  const onUsersClick = () => setShowUsers(!showUsers);
  const onSettingsClick = () => setShowSettings(!showSettings);
  const onCoursesClick = () => setShowCourses(!showCourses);
  const onAssignmentsClick = () => setShowAssignments(!showAssignments);
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
  if (showCourses) {
    return <Courses user={user} onCoursesClick={onCoursesClick} />;
  }
  if (showAssignments) {
    return <Assignments user={user} onAssignmentsClick={onAssignmentsClick} />;
  }
  return (
    <main>
      <BackgroundVideo
        intro="/videos/menu-intro.mp4"
        loop="/videos/menu-loop.mp4"
      />
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
          onCoursesClick={onCoursesClick}
          onAssignmentsClick={onAssignmentsClick}
        />
      </section>
    </main>
  );
}

export default DashboardPage;
