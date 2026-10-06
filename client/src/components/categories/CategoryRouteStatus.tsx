import { Link } from 'react-router-dom';
import { getApiErrorMessage } from '../../lib/apiError';
import type { SelectedCategoryState } from '../../hooks/useSelectedCategory';

type CategoryRouteStatusProps = Exclude<SelectedCategoryState, { status: 'ready' }>;

export default function CategoryRouteStatus(props: CategoryRouteStatusProps) {
  if (props.status === 'loading') {
    return (
      <main className="category-page" aria-busy="true">
        <p role="status">Loading category...</p>
      </main>
    );
  }

  if (props.status === 'error') {
    return (
      <main className="category-page">
        <p className="category-alert" role="alert">
          {getApiErrorMessage(props.error)}
        </p>
        <p>
          <Link to="/categories">Back to categories</Link>
        </p>
      </main>
    );
  }

  if (props.status === 'invalid') {
    return (
      <main className="category-page">
        <h1>Invalid category</h1>
        <p>This category link is not valid.</p>
        <p>
          <Link to="/categories">Back to categories</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="category-page">
      <h1>Category not found</h1>
      <p>This category does not exist.</p>
      <p>
        <Link to="/categories">Back to categories</Link>
      </p>
    </main>
  );
}
