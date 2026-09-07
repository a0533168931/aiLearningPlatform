import { NavLink, Outlet, useParams } from 'react-router-dom';

export default function CategoryLayout() {
  const { categoryId } = useParams();

  return (
    <div>
      <nav className="section-nav" aria-label="Category">
        <NavLink to={`/categories/${categoryId}`} end>
          Overview
        </NavLink>
        <NavLink to={`/categories/${categoryId}/subcategories`}>
          Subcategories
        </NavLink>
        <NavLink to={`/categories/${categoryId}/ask`}>Ask</NavLink>
        <NavLink to={`/categories/${categoryId}/history`}>History</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
