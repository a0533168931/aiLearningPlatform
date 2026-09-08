import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { getApiErrorMessage } from '../../lib/apiError';

export default function CategoriesPage() {
  const categoriesQuery = useCategories();
  const [search, setSearch] = useState('');
  const categories = categoriesQuery.data ?? [];
  const query = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (query === '') {
      return categories;
    }

    return categories.filter((category) => category.name.toLowerCase().includes(query));
  }, [categories, query]);

  if (categoriesQuery.isPending) {
    return (
      <main className="category-page" aria-busy="true">
        <h1>Categories</h1>
        <p role="status" className="mui-status">
          <CircularProgress size={18} />
          Loading categories...
        </p>
      </main>
    );
  }

  if (categoriesQuery.error) {
    return (
      <main className="category-page">
        <h1>Categories</h1>
        <Alert severity="error" className="category-alert">
          {getApiErrorMessage(categoriesQuery.error)}
        </Alert>
      </main>
    );
  }

  const hasSearch = query.length > 0;
  const isEmptyCatalog = categories.length === 0;
  const hasNoMatches = !isEmptyCatalog && filtered.length === 0;

  return (
    <main className="category-page">
      <h1>Categories</h1>
      <p className="category-lede">
        Browse topics and open a category to see its subcategories, ask the AI tutor,
        or review your history for that subject.
      </p>

      {!isEmptyCatalog && (
        <div className="category-search">
          <label htmlFor="category-search">Search categories</label>
          <TextField
            id="category-search"
            type="search"
            hiddenLabel
            fullWidth
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name"
            autoComplete="off"
          />
        </div>
      )}

      {isEmptyCatalog && (
        <p role="status" className="category-muted">
          No categories are available yet.
        </p>
      )}

      {hasNoMatches && (
        <p role="status" className="category-muted">
          No categories match “{search.trim()}”.
        </p>
      )}

      {!isEmptyCatalog && !hasNoMatches && (
        <>
          <p className="category-results-meta" role="status">
            {hasSearch
              ? `${filtered.length} matching ${filtered.length === 1 ? 'category' : 'categories'}`
              : `${filtered.length} ${filtered.length === 1 ? 'category' : 'categories'}`}
          </p>
          <section className="category-grid" aria-label="Categories">
            {filtered.map((category) => (
              <Link
                key={category.id}
                className="category-card"
                to={`/categories/${category.id}`}
              >
                <h2>{category.name}</h2>
                <span className="category-card-action">Open category</span>
              </Link>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
