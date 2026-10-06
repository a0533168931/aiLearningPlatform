import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePrompt } from '../../hooks/usePrompts';
import { getApiErrorMessage, isApiStatus } from '../../lib/apiError';
import { parsePositiveId } from '../../lib/routeId';
import '../../styles/app-pages.css';

export default function PromptDetailsPage() {
  const { promptId: rawPromptId } = useParams();
  const promptId = parsePositiveId(rawPromptId);
  const { user } = useAuth();
  const promptQuery = usePrompt(promptId);

  const belongsToCurrentUser =
    promptQuery.data != null &&
    user?.id != null &&
    promptQuery.data.userId === user.id;

  const hideAsUnavailable =
    promptId === null ||
    isApiStatus(promptQuery.error, 404) ||
    isApiStatus(promptQuery.error, 403) ||
    (promptQuery.isSuccess && !belongsToCurrentUser);

  if (promptId !== null && promptQuery.isPending) {
    return (
      <main className="app-page">
        <h1>Prompt</h1>
        <p className="app-muted" role="status" aria-busy="true">
          Loading prompt...
        </p>
      </main>
    );
  }

  if (
    promptQuery.isError &&
    !isApiStatus(promptQuery.error, 404) &&
    !isApiStatus(promptQuery.error, 403)
  ) {
    return (
      <main className="app-page">
        <h1>Prompt</h1>
        <p className="app-alert" role="alert">
          {getApiErrorMessage(promptQuery.error)}
        </p>
        <div className="app-actions">
          <Link className="app-btn secondary" to="/history">
            Back to history
          </Link>
        </div>
      </main>
    );
  }

  if (hideAsUnavailable || promptQuery.data == null) {
    return (
      <main className="app-page">
        <h1>Prompt unavailable</h1>
        <p className="app-muted">
          This prompt was not found or is not available in your history.
        </p>
        <div className="app-actions">
          <Link className="app-btn secondary" to="/history">
            Back to history
          </Link>
        </div>
      </main>
    );
  }

  const prompt = promptQuery.data;

  return (
    <main className="app-page">
      <p className="app-meta">
        <Link to="/history">History</Link>
      </p>
      <h1>Prompt details</h1>
      <p className="app-lede">
        {prompt.category?.name || 'Category'}
        {prompt.subCategory?.name ? ` · ${prompt.subCategory.name}` : ''}
      </p>
      <p className="app-meta">
        <time dateTime={prompt.createdAt}>
          {new Date(prompt.createdAt).toLocaleString()}
        </time>
      </p>

      <section className="app-card app-history-card" aria-labelledby="prompt-question">
        <h2 id="prompt-question">Your question</h2>
        <p className="app-history-prompt">{prompt.prompt}</p>
      </section>

      <section
        className="app-card app-history-card"
        style={{ marginTop: 16 }}
        aria-labelledby="prompt-answer"
      >
        <h2 id="prompt-answer">AI response</h2>
        <p className="app-history-response">{prompt.response}</p>
      </section>

      <div className="app-actions">
        <Link className="app-btn secondary" to="/history">
          Back to history
        </Link>
        {prompt.categoryId > 0 && (
          <Link
            className="app-btn secondary"
            to={`/categories/${prompt.categoryId}/ask`}
          >
            Ask again in this category
          </Link>
        )}
      </div>
    </main>
  );
}
