import { Link, useOutletContext, useSearchParams } from 'react-router-dom';
import AiTutor from '../../components/ai/AiTutor';
import type { CategoryOutletContext } from '../../hooks/useSelectedCategory';
import { parsePositiveId } from '../../lib/routeId';

export default function CategoryAskPage() {
  const { category } = useOutletContext<CategoryOutletContext>();
  const [searchParams] = useSearchParams();
  const initialSubcategoryId = parsePositiveId(searchParams.get('subcategoryId'));
  const basePath = `/categories/${category.id}`;

  return (
    <main className="category-content">
      <h2>Ask AI</h2>
      <p className="category-copy">
        Ask a question about {category.name}. The answer is saved to your
        learning history.
      </p>
      <AiTutor
        categoryId={category.id}
        categoryName={category.name}
        initialSubcategoryId={initialSubcategoryId}
      />
      <div className="category-actions">
        <Link className="category-action secondary" to={`${basePath}/subcategories`}>
          Browse subcategories
        </Link>
        <Link className="category-action secondary" to={basePath}>
          Back to overview
        </Link>
      </div>
    </main>
  );
}
