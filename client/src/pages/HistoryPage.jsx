import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { promptApi } from "../services/api";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser = JSON.parse(localStorage.getItem("user") || "null");

        if (!storedUser?.id) {
          setError("You need to register before viewing your learning history.");
          return;
        }

        const data = await promptApi.getHistory(storedUser.id);

        const sorted = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setHistory(sorted);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load learning history.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <h1>Learning History</h1>
      <p style={{ color: "#555" }}>Newest requests appear at the top.</p>

      {loading && <p>Loading history...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && history.length === 0 && (
        <p style={{ color: "#666" }}>You do not have any learning history yet.</p>
      )}

      {!loading && !error && history.length > 0 && (
        <section style={{ display: "grid", gap: 14 }}>
          {history.map((item) => (
            <article
              key={item.id}
              style={{
                border: "1px solid #d7d7d7",
                borderRadius: 10,
                padding: 16,
                background: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <strong>{item.category?.name || "Category"}</strong>
                <span style={{ color: "#666", fontSize: 13 }}>
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>

              <p style={{ margin: "8px 0 0", fontWeight: 600 }}>{item.prompt}</p>

              <div
                style={{
                  marginTop: 10,
                  padding: 12,
                  borderRadius: 8,
                  background: "#f7f7f7",
                  whiteSpace: "pre-wrap",
                }}
              >
                {item.response}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
    </>
  );
}