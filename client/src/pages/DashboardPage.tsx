import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCategories } from '../hooks/useCategories';
import { usePromptHistory } from '../hooks/usePrompts';
import { getApiErrorMessage } from '../lib/apiError';
import '../styles/app-pages.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const categoriesQuery = useCategories();
  const historyQuery = usePromptHistory(user?.id);
  const categories = categoriesQuery.data ?? [];
  const history = historyQuery.data ?? [];
  const recent = history.slice(0, 5);
  const uniqueCategoryCount = new Set(history.map((item) => item.categoryId)).size;

  return (
    <main className="app-page">
      <h1>Welcome{user?.name ? `, ${user.name}` : ''}</h1>
      <p className="app-lede">
        Continue from a recent question, explore a topic, or ask the AI tutor.
      </p>

      <div className="app-actions">
        <Button className="app-btn" component={Link} to="/categories" variant="contained">
          Explore Categories
        </Button>
        <Button
          className="app-btn secondary"
          component={Link}
          to="/categories"
          variant="text"
        >
          Ask AI
        </Button>
        <Button
          className="app-btn secondary"
          component={Link}
          to="/history"
          variant="text"
        >
          Full history
        </Button>
      </div>

      <section className="app-stats" aria-label="Your learning snapshot">
        <div className="app-stat">
          <span className="app-stat-label">Questions asked</span>
          <span className="app-stat-value">
            {historyQuery.isPending ? '—' : history.length}
          </span>
        </div>
        <div className="app-stat">
          <span className="app-stat-label">Topics explored</span>
          <span className="app-stat-value">
            {historyQuery.isPending ? '—' : uniqueCategoryCount}
          </span>
        </div>
        <div className="app-stat">
          <span className="app-stat-label">Categories</span>
          <span className="app-stat-value">
            {categoriesQuery.isPending ? '—' : categories.length}
          </span>
        </div>
      </section>

      {(categoriesQuery.error || historyQuery.error) && (
        <Alert severity="error" className="app-alert">
          {getApiErrorMessage(categoriesQuery.error ?? historyQuery.error)}
        </Alert>
      )}

      <h2>Recent questions</h2>
      {historyQuery.isPending && (
        <p className="app-muted mui-status" role="status" aria-busy="true">
          <CircularProgress size={16} />
          Loading recent questions...
        </p>
      )}
      {historyQuery.isSuccess && recent.length === 0 && (
        <p className="app-muted" role="status">
          You have not asked a question yet. Choose a category to get started.
        </p>
      )}
      {historyQuery.isSuccess && recent.length > 0 && (
        <section className="app-history-list" aria-label="Recent questions">
          {recent.map((item) => (
            <Link
              key={item.id}
              className="app-card app-history-card"
              to={`/history/${item.id}`}
            >
              <header>
                <strong>
                  {item.category?.name || 'Category'}
                  {item.subCategory?.name ? ` · ${item.subCategory.name}` : ''}
                </strong>
                <time dateTime={item.createdAt}>
                  {new Date(item.createdAt).toLocaleString()}
                </time>
              </header>
              <p className="app-history-prompt">{item.prompt}</p>
              <span className="app-card-action">Open prompt</span>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
