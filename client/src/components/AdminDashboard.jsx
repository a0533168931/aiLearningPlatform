import { useEffect, useState } from "react";
import { promptApi, userApi } from "../services/api";
import "../styles/AdminDashboard.css";

// Admin dashboard for viewing users and their learning history
export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");

  // Load all registered users when the component mounts
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await userApi.getAll();
        const usersList = Array.isArray(data) ? data : data?.data || [];

        setUsers(usersList);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load users."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Load learning history for the selected user
  const handleUserClick = async (user) => {
    try {
      setSelectedUserId(user.id);
      setHistoryLoading(true);
      setError("");

      const data = await promptApi.getHistory(user.id);

      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

      setHistory(sorted);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load user history."
      );

      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <main className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <p className="admin-description">
        View all registered users and their learning history.
      </p>

      {error && (
        <p className="admin-error">
          {error}
        </p>
      )}

      <section className="admin-layout">

        {/* Users list */}
        <article className="admin-card">
          <h2>All Users</h2>

          {loading ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() =>
                        handleUserClick(user)
                      }
                      className={
                        selectedUserId === user.id
                          ? "selected-row"
                          : ""
                      }
                    >
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        {/* Selected user history */}
        <article className="admin-card">
          <h2>User History</h2>

          {!selectedUserId ? (
            <p>
              Click a user to view their
              learning history.
            </p>
          ) : historyLoading ? (
            <p>Loading history...</p>
          ) : history.length === 0 ? (
            <p>No history found.</p>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <article
                  key={item.id}
                  className="history-card"
                >
                  <div className="history-header">
                    <strong>
                      {item.category?.name ||
                        "Category"}
                    </strong>

                    <span>
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </span>
                  </div>

                  <p className="history-prompt">
                    {item.prompt}
                  </p>

                  <div className="history-response">
                    {item.response}
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>

      </section>
    </main>
  );
}