import { useEffect, useState } from "react";
import { categoryApi, promptApi } from "../services/api";
import "../styles/LearningFlow.css";

export default function LearningFlow() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Latest AI response displayed in the lesson area
  const latestAiMessage = [...messages]
    .filter((item) => item.kind === "ai")
    .pop();

  // Load categories and user learning history
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryApi.getAll();
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const loadHistory = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");

        if (!storedUser?.id) return;

        const history = await promptApi.getHistory(storedUser.id);

        const formattedMessages = history.flatMap((item) => [
          {
            id: `${item.id}-user`,
            kind: "user",
            text: item.prompt,
            createdAt: item.createdAt,
          },
          {
            id: `${item.id}-ai`,
            kind: "ai",
            text: item.response,
            createdAt: item.createdAt,
          },
        ]);

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to load learning history", error);
      }
    };

    loadCategories();
    loadHistory();
  }, []);

  // Load subcategories for the selected category
  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setPrompt("");

    try {
      const data = await categoryApi.getSubcategories(category.id);
      setSubcategories(data);
    } catch (error) {
      console.error(error);
      setSubcategories([]);
    }
  };

  // Select a subcategory for the learning session
  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setPrompt("");
    setError("");
  };

  // Send user prompt and save the AI response
  const handleSendPrompt = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError("Please type your question before sending.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!storedUser?.id) {
      setError("You need to register before using the learning flow.");
      return;
    }

    try {
      setSending(true);
      setError("");

      const result = await promptApi.create({
        userId: storedUser.id,
        categoryId: selectedCategory.id,
        subCategoryId: selectedSubcategory.id,
        prompt: prompt.trim(),
      });

      const aiText = result.response || "No answer was returned from the server.";

      setMessages((prev) => [
        ...prev,
        {
          id: `${result.id || Date.now()}-user`,
          kind: "user",
          text: prompt.trim(),
          createdAt: result.createdAt || new Date().toISOString(),
        },
        {
          id: `${result.id || Date.now()}-ai`,
          kind: "ai",
          text: aiText,
          createdAt: result.createdAt || new Date().toISOString(),
        },
      ]);

      setPrompt("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while generating the answer."
      );
    } finally {
      setSending(false);
    }
  };

  // Reset the current learning flow
  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSubcategories([]);
    setPrompt("");
    setMessages([]);
    setShowHistory(false);
  };

  return (
    <main className="learning-flow">
      <h1>Learning Platform</h1>

      {loading ? (
        <p>Loading data...</p>
      ) : !selectedCategory ? (
        <section>
          <h2>Select a category to study</h2>

          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section>
          <button onClick={handleBackToCategories}>← Back</button>

          <h2>{selectedCategory.name}</h2>

          <div className="subcategory-list">
            {subcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => handleSubcategoryClick(subcategory)}
              >
                {subcategory.name}
              </button>
            ))}
          </div>

          {selectedSubcategory && (
            <section className="prompt-section">
              <h3>The user asks for a lesson on a specific topic</h3>

              <form onSubmit={handleSendPrompt}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to learn, for example: explain JavaScript functions..."
                  rows={6}
                  className="prompt-textarea"
                />

                <div className="prompt-actions">
                  <button type="submit" disabled={sending}>
                    {sending ? "Sending..." : "Send request to AI"}
                  </button>
                  <span className="prompt-info">
                    Your request is sent to the server and the AI generates a lesson for you.
                  </span>
                </div>
              </form>

              {error && <p className="error-message">{error}</p>}

              {latestAiMessage && (
                <article className="ai-response">
                  <h4>Latest AI response</h4>
                  <p>{latestAiMessage.text}</p>
                </article>
              )}

              <section className="history-section">
                <button
                  type="button"
                  className="history-toggle"
                  onClick={() => setShowHistory((prev) => !prev)}
                >
                  {showHistory ? "Hide history" : "Show history"}
                </button>

                {showHistory && (
                  <>
                    {messages.length === 0 ? (
                      <p className="empty-history">There are no requests in your history yet.</p>
                    ) : (
                      <div className="history-list">
                        {messages.map((item) => (
                          <article
                            key={item.id}
                            className={`history-card ${item.kind === "user" ? "user" : "ai"}`}
                          >
                            <strong>{item.kind === "user" ? "You:" : "AI:"}</strong>
                            <p>{item.text}</p>
                          </article>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </section>
            </section>
          )}
        </section>
      )}
    </main>
  );
}