import { NavLink, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AdminLayout() {
  return (
    <>
      <Navbar />
      <nav className="section-nav" aria-label="Admin">
        <NavLink to="/admin" end>
          Overview
        </NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/categories">Categories</NavLink>
      </nav>
      <Outlet />
    </>
  );
}
