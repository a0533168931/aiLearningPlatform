import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/", { replace: true });
  };

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
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/dashboard"); }}>
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/history"); }}>
              History
            </a>
          </li>
          {user.role === "ADMIN" && (
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/admin"); }}>
                Admin
              </a>
            </li>
          )}
        </ul>

        <div className="navbar-user">
          <span className="user-info">
            {user.name} ({user.role})
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
