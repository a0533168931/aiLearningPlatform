import { Link, useOutletContext } from 'react-router-dom';
import type { CategoryOutletContext } from '../../hooks/useSelectedCategory';
import { useSubcategories } from '../../hooks/useSubcategories';
import { getApiErrorMessage } from '../../lib/apiError';

export default function CategorySubcategoriesPage() {
  const { category } = useOutletContext<CategoryOutletContext>();
  const subcategoriesQuery = useSubcategories(category.id);
  const subcategories = subcategoriesQuery.data ?? [];

  return (
    <main className="category-content">
      <h2>Subcategories</h2>
      <p className="category-copy">
        Topics inside {category.name}. Choose one to continue toward Ask AI.
      </p>

      {subcategoriesQuery.isPending && (
        <p role="status" className="category-muted" aria-busy="true">
          Loading subcategories...
        </p>
      )}

      {subcategoriesQuery.error && (
        <p className="category-alert" role="alert">
          {getApiErrorMessage(subcategoriesQuery.error)}
        </p>
      )}

      {subcategoriesQuery.isSuccess && subcategories.length === 0 && (
        <p role="status" className="category-muted">
          There are no subcategories in this category yet.
        </p>
      )}

      {subcategoriesQuery.isSuccess && subcategories.length > 0 && (
        <section className="category-grid" aria-label="Subcategories">
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              className="subcategory-card"
              to={`/categories/${category.id}/ask?subcategoryId=${subcategory.id}`}
            >
              <h2>{subcategory.name}</h2>
              <span className="subcategory-card-action">Ask AI</span>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
