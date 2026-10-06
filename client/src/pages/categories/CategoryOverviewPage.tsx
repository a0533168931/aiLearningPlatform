import { Link, useOutletContext } from 'react-router-dom';
import type { CategoryOutletContext } from '../../hooks/useSelectedCategory';
import { useSubcategories } from '../../hooks/useSubcategories';
import { getApiErrorMessage } from '../../lib/apiError';

export default function CategoryOverviewPage() {
  const { category } = useOutletContext<CategoryOutletContext>();
  const subcategoriesQuery = useSubcategories(category.id);
  const basePath = `/categories/${category.id}`;
  const subcategoryCount = subcategoriesQuery.data?.length;

  return (
    <main className="category-content">
      <h2>Overview</h2>
      <p className="category-copy">
        Explore this topic, pick a subcategory, or continue to Ask AI and your
        saved questions for {category.name}.
      </p>

      {subcategoriesQuery.isPending && (
        <p role="status" className="category-muted">
          Loading subcategories...
        </p>
      )}

      {subcategoriesQuery.error && (
        <p className="category-alert" role="alert">
          {getApiErrorMessage(subcategoriesQuery.error)}
        </p>
      )}

      {subcategoriesQuery.isSuccess && (
        <p className="category-copy">
          {subcategoryCount === 0
            ? 'There are no subcategories in this topic yet.'
            : `${subcategoryCount} ${subcategoryCount === 1 ? 'subcategory' : 'subcategories'} available.`}
        </p>
      )}

      <div className="category-actions">
        <Link className="category-action" to={`${basePath}/subcategories`}>
          Browse subcategories
        </Link>
        <Link className="category-action secondary" to={`${basePath}/ask`}>
          Ask AI
        </Link>
        <Link className="category-action secondary" to={`${basePath}/history`}>
          View history
        </Link>
      </div>
    </main>
  );
}
