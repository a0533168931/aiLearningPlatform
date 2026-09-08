import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePromptHistory } from '../../hooks/usePrompts';
import type { CategoryOutletContext } from '../../hooks/useSelectedCategory';
import { getApiErrorMessage } from '../../lib/apiError';

export default function CategoryHistoryPage() {
  const { category } = useOutletContext<CategoryOutletContext>();
  const { user } = useAuth();
  const historyQuery = usePromptHistory(user?.id);
  const categoryHistory = (historyQuery.data ?? []).filter(
    (item) => item.categoryId === category.id
  );

  return (
    <main className="category-content">
      <h2>History</h2>
      <p className="category-copy">
        Your saved questions in {category.name}. Newest requests appear first.
      </p>

      {!user?.id && (
        <p className="category-alert" role="alert">
          You need to sign in before viewing your learning history.
        </p>
      )}

      {user?.id && historyQuery.isPending && (
        <p role="status" className="category-muted" aria-busy="true">
          Loading history...
        </p>
      )}

      {user?.id && historyQuery.error && (
        <p className="category-alert" role="alert">
          {getApiErrorMessage(historyQuery.error)}
        </p>
      )}

      {user?.id && historyQuery.isSuccess && categoryHistory.length === 0 && (
        <p role="status" className="category-muted">
          No questions in this category yet.
        </p>
      )}

      {user?.id && historyQuery.isSuccess && categoryHistory.length > 0 && (
        <section className="category-history-list" aria-label={`${category.name} history`}>
          {categoryHistory.map((item) => (
            <Link
              key={item.id}
              className="category-history-card"
              to={`/history/${item.id}`}
            >
              <header>
                <strong>{item.subCategory?.name || 'Subcategory'}</strong>
                <time dateTime={item.createdAt}>
                  {new Date(item.createdAt).toLocaleString()}
                </time>
              </header>
              <p className="category-history-prompt">{item.prompt}</p>
              <p className="category-history-response">{item.response}</p>
              <span className="category-card-action">View details</span>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
