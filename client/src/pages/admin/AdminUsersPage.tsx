import { useState } from 'react';
import { usePromptHistory } from '../../hooks/usePrompts';
import { useUsers } from '../../hooks/useUsers';
import { getApiErrorMessage } from '../../lib/apiError';
import type { User } from '../../types/user';
import '../../styles/app-pages.css';

export default function AdminUsersPage() {
  const usersQuery = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const historyQuery = usePromptHistory(selectedUser?.id);
  const users = usersQuery.data ?? [];
  const history = historyQuery.data ?? [];

  return (
    <main className="app-page app-page-wide">
      <h1>Users</h1>
      <p className="app-lede">
        All registered accounts. Select a user to view their saved questions.
        Editing, deleting, and role changes are not available.
      </p>

      {usersQuery.error && (
        <p className="app-alert" role="alert">
          {getApiErrorMessage(usersQuery.error)}
        </p>
      )}

      <div className="app-admin-grid">
        <section className="app-card" style={{ padding: 18 }}>
          <h2>All users</h2>
          {usersQuery.isPending && (
            <p className="app-muted" role="status" aria-busy="true">
              Loading users...
            </p>
          )}
          {usersQuery.isSuccess && users.length === 0 && (
            <p className="app-muted" role="status">
              No users found.
            </p>
          )}
          {usersQuery.isSuccess && users.length > 0 && (
            <div className="app-table-wrap">
              <table className="app-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr
                      key={item.id}
                      className={`selectable${selectedUser?.id === item.id ? ' selected' : ''}`}
                      onClick={() => setSelectedUser(item)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setSelectedUser(item);
                        }
                      }}
                      tabIndex={0}
                    >
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.role}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="app-card" style={{ padding: 18 }}>
          <h2>User history</h2>
          {selectedUser == null && (
            <p className="app-muted">Select a user to view their history.</p>
          )}
          {selectedUser != null && (
            <p className="app-meta">
              {selectedUser.name} ({selectedUser.email})
            </p>
          )}
          {selectedUser != null && historyQuery.isPending && (
            <p className="app-muted" role="status" aria-busy="true">
              Loading history...
            </p>
          )}
          {selectedUser != null && historyQuery.error && (
            <p className="app-alert" role="alert">
              {getApiErrorMessage(historyQuery.error)}
            </p>
          )}
          {selectedUser != null &&
            historyQuery.isSuccess &&
            history.length === 0 && (
              <p className="app-muted" role="status">
                No history found.
              </p>
            )}
          {selectedUser != null &&
            historyQuery.isSuccess &&
            history.length > 0 && (
              <div className="app-history-list">
                {history.map((item) => (
                  <article key={item.id} className="app-card app-history-card">
                    <header>
                      <strong>
                        {item.category?.name || 'Category'}
                        {item.subCategory?.name
                          ? ` · ${item.subCategory.name}`
                          : ''}
                      </strong>
                      <time dateTime={item.createdAt}>
                        {new Date(item.createdAt).toLocaleString()}
                      </time>
                    </header>
                    <p className="app-history-prompt">{item.prompt}</p>
                    <p className="app-history-excerpt">{item.response}</p>
                  </article>
                ))}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}
