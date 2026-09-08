import { Link, NavLink, Outlet } from 'react-router-dom';
import CategoryRouteStatus from '../components/categories/CategoryRouteStatus';
import {
  useSelectedCategory,
  type CategoryOutletContext,
} from '../hooks/useSelectedCategory';

export default function CategoryLayout() {
  const selected = useSelectedCategory();

  if (selected.status !== 'ready') {
    return <CategoryRouteStatus {...selected} />;
  }

  const { category } = selected;
  const basePath = `/categories/${category.id}`;
  const outletContext: CategoryOutletContext = { category };

  return (
    <div className="category-shell">
      <header className="category-header">
        <p className="category-kicker">
          <Link to="/categories">Categories</Link>
        </p>
        <h1>{category.name}</h1>
      </header>
      <nav className="section-nav" aria-label="Category">
        <NavLink to={basePath} end>
          Overview
        </NavLink>
        <NavLink to={`${basePath}/subcategories`}>Subcategories</NavLink>
        <NavLink to={`${basePath}/ask`}>Ask</NavLink>
        <NavLink to={`${basePath}/history`}>History</NavLink>
      </nav>
      <Outlet context={outletContext} />
    </div>
  );
}
