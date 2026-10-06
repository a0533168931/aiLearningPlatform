import { Link, useOutletContext, useSearchParams } from 'react-router-dom';
import type { CategoryOutletContext } from '../../hooks/useSelectedCategory';
import { useSubcategories } from '../../hooks/useSubcategories';
import { getApiErrorMessage } from '../../lib/apiError';

export default function CategorySubcategoriesPage() {
  const { category } = useOutletContext<CategoryOutletContext>();
  const [searchParams] = useSearchParams();
  const choosingForAsk = searchParams.get('flow') === 'ask';
  const subcategoriesQuery = useSubcategories(category.id);
  const subcategories = (subcategoriesQuery.data ?? []).filter(
    (item) => item.categoryId === category.id
  );

  return (
    <main className="category-content">
      <h2>Subcategories</h2>
      <p className="category-copy">
        {choosingForAsk
          ? `Choose a subcategory in ${category.name}, then write your question.`
          : `Topics inside ${category.name}. Choose one to continue toward Ask AI.`}
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
