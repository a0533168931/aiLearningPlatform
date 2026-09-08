import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useUsers } from '../../hooks/useUsers';
import { getApiErrorMessage } from '../../lib/apiError';
import '../../styles/app-pages.css';

export default function AdminHomePage() {
  const usersQuery = useUsers();
  const categoriesQuery = useCategories();
  const userCount = usersQuery.data?.length ?? 0;
  const categoryCount = categoriesQuery.data?.length ?? 0;

  return (
    <main className="app-page">
      <h1>Admin</h1>
      <p className="app-lede">
        Manage learners and the category catalog. User roles cannot be changed
        from this app.
      </p>

      {(usersQuery.error || categoriesQuery.error) && (
        <p className="app-alert" role="alert">
          {getApiErrorMessage(usersQuery.error ?? categoriesQuery.error)}
        </p>
      )}

      <section className="app-stats" aria-label="Admin snapshot">
        <div className="app-stat">
          <span className="app-stat-label">Users</span>
          <span className="app-stat-value">
            {usersQuery.isPending ? '—' : userCount}
          </span>
        </div>
        <div className="app-stat">
          <span className="app-stat-label">Categories</span>
          <span className="app-stat-value">
            {categoriesQuery.isPending ? '—' : categoryCount}
          </span>
        </div>
      </section>

      <div className="app-actions">
        <Link className="app-btn" to="/admin/users">
          View users
        </Link>
        <Link className="app-btn secondary" to="/admin/categories">
          Manage categories
        </Link>
      </div>
    </main>
  );
}
