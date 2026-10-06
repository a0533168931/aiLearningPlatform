import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePromptHistory } from '../hooks/usePrompts';
import { getApiErrorMessage } from '../lib/apiError';
import '../styles/app-pages.css';

export default function HistoryPage() {
  const { user } = useAuth();
  const historyQuery = usePromptHistory(user?.id);
  const history = historyQuery.data ?? [];

  return (
    <main className="app-page">
      <h1>Learning History</h1>
      <p className="app-lede">
        Newest questions appear first. Open an item to read the full AI answer.
      </p>

      {!user?.id && (
        <p className="app-alert" role="alert">
          You need to sign in before viewing your learning history.
        </p>
      )}

      {user?.id && historyQuery.isPending && (
        <p className="app-muted" role="status" aria-busy="true">
          Loading history...
        </p>
      )}

      {user?.id && historyQuery.error && (
        <p className="app-alert" role="alert">
          {getApiErrorMessage(historyQuery.error)}
        </p>
      )}

      {user?.id && historyQuery.isSuccess && history.length === 0 && (
        <p className="app-muted" role="status">
          You do not have any learning history yet.
        </p>
      )}

      {user?.id && historyQuery.isSuccess && history.length > 0 && (
        <section className="app-history-list" aria-label="Learning history">
          {history.map((item) => (
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
              <p className="app-history-excerpt">{item.response}</p>
              <span className="app-card-action">View details</span>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
