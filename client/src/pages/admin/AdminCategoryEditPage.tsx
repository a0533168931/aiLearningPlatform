import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NameForm from '../../components/admin/NameForm';
import {
  useCreateSubcategory,
  useDeleteSubcategory,
  useUpdateCategory,
  useUpdateSubcategory,
} from '../../hooks/useAdminCategories';
import { useCategories } from '../../hooks/useCategories';
import { useSubcategories } from '../../hooks/useSubcategories';
import { getApiErrorMessage } from '../../lib/apiError';
import { parsePositiveId } from '../../lib/routeId';
import '../../styles/app-pages.css';

export default function AdminCategoryEditPage() {
  const { categoryId: rawCategoryId } = useParams();
  const categoryId = parsePositiveId(rawCategoryId);
  const categoriesQuery = useCategories();
  const category = (categoriesQuery.data ?? []).find((item) => item.id === categoryId);
  const subcategoriesQuery = useSubcategories(categoryId);
  const updateCategory = useUpdateCategory();
  const createSubcategory = useCreateSubcategory();
  const updateSubcategory = useUpdateSubcategory();
  const deleteSubcategory = useDeleteSubcategory();
  const [editingSubId, setEditingSubId] = useState<number | null>(null);
  const [pendingSubId, setPendingSubId] = useState<number | null>(null);
  const [categorySaved, setCategorySaved] = useState(false);
  const [subFeedback, setSubFeedback] = useState<string | null>(null);
  const [subFormKey, setSubFormKey] = useState(0);
  const subcategories = subcategoriesQuery.data ?? [];

  if (categoryId === null) {
    return (
      <main className="app-page">
        <h1>Category unavailable</h1>
        <p className="app-muted">This category id is not valid.</p>
      </main>
    );
  }

  if (categoriesQuery.isPending) {
    return (
      <main className="app-page">
        <h1>Edit category</h1>
        <p className="app-muted" role="status" aria-busy="true">
          Loading category...
        </p>
      </main>
    );
  }

  if (categoriesQuery.error) {
    return (
      <main className="app-page">
        <h1>Edit category</h1>
        <p className="app-alert" role="alert">
          {getApiErrorMessage(categoriesQuery.error)}
        </p>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="app-page">
        <h1>Category unavailable</h1>
        <p className="app-muted">This category was not found.</p>
        <div className="app-actions">
          <Link className="app-btn secondary" to="/admin/categories">
            Back to categories
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="app-page">
      <h1>Edit {category.name}</h1>
      <p className="app-lede">
        Rename this topic or manage its subcategories.
      </p>

      <section className="app-card" style={{ padding: 20, marginBottom: 28 }}>
        <h2>Category name</h2>
        {categorySaved && !updateCategory.isPending && !updateCategory.error && (
          <p className="app-success" role="status">
            Category updated.
          </p>
        )}
        <NameForm
          idPrefix="edit-category"
          defaultName={category.name}
          submitLabel="Save name"
          pendingLabel="Saving..."
          isPending={updateCategory.isPending}
          error={updateCategory.error}
          onSubmitName={async (name) => {
            setCategorySaved(false);
            await updateCategory.mutateAsync({
              id: category.id,
              input: { name },
            });
            setCategorySaved(true);
          }}
        />
      </section>

      <section>
        <h2>Subcategories</h2>
        {subcategoriesQuery.isPending && (
          <p className="app-muted" role="status" aria-busy="true">
            Loading subcategories...
          </p>
        )}
        {subcategoriesQuery.error && (
          <p className="app-alert" role="alert">
            {getApiErrorMessage(subcategoriesQuery.error)}
          </p>
        )}
        {deleteSubcategory.error && (
          <p className="app-alert" role="alert">
            {getApiErrorMessage(deleteSubcategory.error)}
          </p>
        )}
        {subFeedback && (
          <p className="app-success" role="status">
            {subFeedback}
          </p>
        )}

        {subcategoriesQuery.isSuccess && subcategories.length === 0 && (
          <p className="app-muted" role="status">
            No subcategories yet.
          </p>
        )}

        <div className="app-sub-list">
          {subcategories.map((item) => (
            <div key={item.id} className="app-sub-item">
              {editingSubId === item.id ? (
                <NameForm
                  idPrefix={`sub-${item.id}`}
                  defaultName={item.name}
                  submitLabel="Save"
                  pendingLabel="Saving..."
                  isPending={updateSubcategory.isPending}
                  error={updateSubcategory.error}
                  onSubmitName={async (name) => {
                    await updateSubcategory.mutateAsync({
                      id: item.id,
                      input: { name },
                    });
                    setEditingSubId(null);
                    setSubFeedback('Subcategory updated.');
                  }}
                />
              ) : (
                <strong>{item.name}</strong>
              )}
              <div className="app-row-actions">
                {editingSubId === item.id ? (
                  <button
                    className="app-btn secondary"
                    type="button"
                    onClick={() => setEditingSubId(null)}
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    className="app-btn secondary"
                    type="button"
                    onClick={() => {
                      setPendingSubId(null);
                      setEditingSubId(item.id);
                      updateSubcategory.reset();
                    }}
                  >
                    Rename
                  </button>
                )}
                {pendingSubId === item.id ? (
                  <>
                    <button
                      className="app-btn danger"
                      type="button"
                      disabled={deleteSubcategory.isPending}
                      onClick={async () => {
                        setSubFeedback(null);
                        try {
                          const message = await deleteSubcategory.mutateAsync(item.id);
                          setPendingSubId(null);
                          setSubFeedback(message);
                        } catch {
                          setPendingSubId(null);
                        }
                      }}
                    >
                      {deleteSubcategory.isPending ? 'Deleting...' : 'Confirm delete'}
                    </button>
                    <button
                      className="app-btn secondary"
                      type="button"
                      disabled={deleteSubcategory.isPending}
                      onClick={() => setPendingSubId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="app-btn danger"
                    type="button"
                    onClick={() => {
                      deleteSubcategory.reset();
                      setEditingSubId(null);
                      setPendingSubId(item.id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="app-card" style={{ padding: 20, marginTop: 20 }}>
          <h3>Add subcategory</h3>
          <NameForm
            key={subFormKey}
            idPrefix="new-subcategory"
            submitLabel="Add subcategory"
            pendingLabel="Adding..."
            isPending={createSubcategory.isPending}
            error={createSubcategory.error}
            onSubmitName={async (name) => {
              await createSubcategory.mutateAsync({
                categoryId: category.id,
                name,
              });
              setSubFormKey((value) => value + 1);
              setSubFeedback('Subcategory created.');
            }}
          />
        </div>
      </section>

      <div className="app-actions">
        <Link className="app-btn secondary" to="/admin/categories">
          Back to categories
        </Link>
      </div>
    </main>
  );
}
