import { logoutUser } from '../adapters/auth-adapters';

function DashboardButtons({
  loggedIn,
  checkLoggedIn,
  user,
  onUsersClick,
  onSettingsClick,
  onCoursesClick,
  onAssignmentsClick,
}) {
  const handleClick = async () => {
    const { error } = await logoutUser();
    if (error) {
      return console.error(error);
    }
    await checkLoggedIn();
  };
  if (loggedIn) {
    return (
      <ul className="dashboardButtons">
        <li>
          <button onClick={onCoursesClick}>
            <span>Courses</span>
          </button>
        </li>

        <li>
          <button onClick={onAssignmentsClick}>
            <span>Assignments</span>
          </button>
        </li>

        <li>
          <button onClick={onUsersClick}>
            <span>{user.role === 'professor' ? 'Students' : 'Professors'}</span>
          </button>
        </li>

        <li>
          <button onClick={onSettingsClick}>
            <span>Settings</span>
          </button>
        </li>

        <li>
          <button onClick={handleClick}>
            <span>Main Menu</span>
          </button>
        </li>
      </ul>
    );
  }
}

export default DashboardButtons;
