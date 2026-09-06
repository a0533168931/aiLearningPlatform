import { NavLink, Outlet } from 'react-router-dom';

export default function AdminCategoriesLayout() {
  return (
    <div>
      <nav className="section-nav" aria-label="Admin categories">
        <NavLink to="/admin/categories" end>
          All categories
        </NavLink>
        <NavLink to="/admin/categories/new">New category</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
