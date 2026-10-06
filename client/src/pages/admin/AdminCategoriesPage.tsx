import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeleteCategory } from '../../hooks/useAdminCategories';
import { useCategories } from '../../hooks/useCategories';
import { getApiErrorMessage } from '../../lib/apiError';
import '../../styles/app-pages.css';

export default function AdminCategoriesPage() {
  const categoriesQuery = useCategories();
  const deleteCategory = useDeleteCategory();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const categories = categoriesQuery.data ?? [];

  const handleDelete = async (id: number) => {
    setFeedback(null);
    try {
      const message = await deleteCategory.mutateAsync(id);
      setPendingId(null);
      setFeedback(message);
    } catch {
      setPendingId(null);
    }
  };

  return (
    <main className="app-page">
      <h1>Categories</h1>
      <p className="app-lede">
        Create and rename topics. A category or subcategory cannot be deleted
        while related prompts still exist.
      </p>

      <div className="app-actions">
        <Link className="app-btn" to="/admin/categories/new">
          New category
        </Link>
      </div>

      {categoriesQuery.isPending && (
        <p className="app-muted" role="status" aria-busy="true">
          Loading categories...
        </p>
      )}

      {categoriesQuery.error && (
        <p className="app-alert" role="alert">
          {getApiErrorMessage(categoriesQuery.error)}
        </p>
      )}

      {deleteCategory.error && (
        <p className="app-alert" role="alert">
          {getApiErrorMessage(deleteCategory.error)}
        </p>
      )}

      {feedback && (
        <p className="app-success" role="status">
          {feedback}
        </p>
      )}

      {categoriesQuery.isSuccess && categories.length === 0 && (
        <p className="app-muted" role="status">
          No categories yet.
        </p>
      )}

      {categoriesQuery.isSuccess && categories.length > 0 && (
        <div className="app-table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>
                    <div className="app-row-actions">
                      <Link
                        className="app-btn secondary"
                        to={`/admin/categories/${category.id}/edit`}
                      >
                        Edit
                      </Link>
                      {pendingId === category.id ? (
                        <>
                          <button
                            className="app-btn danger"
                            type="button"
                            disabled={deleteCategory.isPending}
                            onClick={() => void handleDelete(category.id)}
                          >
                            {deleteCategory.isPending ? 'Deleting...' : 'Confirm delete'}
                          </button>
                          <button
                            className="app-btn secondary"
                            type="button"
                            disabled={deleteCategory.isPending}
                            onClick={() => setPendingId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="app-btn danger"
                          type="button"
                          onClick={() => {
                            setFeedback(null);
                            deleteCategory.reset();
                            setPendingId(category.id);
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
