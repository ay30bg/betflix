import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          aria-label="Home"
        >
          <span className="nav-icon home"></span>
          <span className="nav-label">Home</span>
        </NavLink>
        <NavLink
          to="/game"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          aria-label="Game"
        >
          <span className="nav-icon game"></span>
          <span className="nav-label">Game</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          aria-label="Profile"
        >
          <span className="nav-icon profile"></span>
          <span className="nav-label">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;