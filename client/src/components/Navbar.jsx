import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  if (!user?.id) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>Learning System</h2>
        </div>

        <ul className="navbar-links">
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/categories">Categories</NavLink>
          </li>
          <li>
            <NavLink to="/ask">Ask</NavLink>
          </li>
          <li>
            <NavLink to="/history">History</NavLink>
          </li>
          <li>
            <NavLink to="/profile">Profile</NavLink>
          </li>
          {user.role === "ADMIN" && (
            <li>
              <NavLink to="/admin">Admin</NavLink>
            </li>
          )}
        </ul>

        <div className="navbar-user">
          <span className="user-info">
            {user.name} ({user.role})
          </span>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
