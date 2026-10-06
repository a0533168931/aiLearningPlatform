import { useNavigate } from 'react-router-dom';
import NameForm from '../../components/admin/NameForm';
import { useCreateCategory } from '../../hooks/useAdminCategories';
import '../../styles/app-pages.css';

export default function AdminCategoryNewPage() {
  const navigate = useNavigate();
  const createCategory = useCreateCategory();

  return (
    <main className="app-page">
      <h1>New category</h1>
      <p className="app-lede">
        Names may contain letters and spaces only (2–100 characters).
      </p>
      <NameForm
        idPrefix="new-category"
        submitLabel="Create category"
        pendingLabel="Creating..."
        isPending={createCategory.isPending}
        error={createCategory.error}
        onSubmitName={async (name) => {
          const created = await createCategory.mutateAsync({ name });
          void navigate(`/admin/categories/${created.id}/edit`, { replace: true });
        }}
      />
    </main>
  );
}
