import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/home.css';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const startLearningTo = isAuthenticated ? '/dashboard' : '/register';

  return (
    <div className="home-page">
      <header className="home-header">
        <Link className="home-brand" to="/">
          AI Learning Platform
        </Link>
        <div className="home-header-actions">
          {isAuthenticated ? (
            <Link className="home-btn home-btn-primary" to="/dashboard">
              Dashboard
            </Link>
          ) : (
            <>
              <Link className="home-btn home-btn-secondary" to="/login">
                Login
              </Link>
              <Link className="home-btn home-btn-primary" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="home-main">
        <section className="home-hero">
          <h1>AI Learning Platform</h1>
          <p className="home-lead">
            Learn with an AI tutor that answers your questions in context. Choose a
            topic, ask what you want to understand, and keep a history of every
            lesson so you can return to it anytime.
          </p>
          <div className="home-actions">
            <Link className="home-btn home-btn-primary" to={startLearningTo}>
              Start Learning
            </Link>
            <Link className="home-btn home-btn-secondary" to="/login">
              Login
            </Link>
            <Link className="home-btn home-btn-secondary" to="/register">
              Register
            </Link>
          </div>
        </section>

        <section className="home-section">
          <h2>How it works</h2>
          <ol>
            <li>Create an account or sign in.</li>
            <li>Pick a category and subcategory that match what you want to learn.</li>
            <li>Ask a question. The AI tutor responds with a focused explanation.</li>
            <li>Review your saved history whenever you want to revisit a lesson.</li>
          </ol>
        </section>

        <section className="home-section">
          <h2>Why learn here</h2>
          <ul>
            <li>Questions stay tied to a real subject, not a generic chat.</li>
            <li>Every prompt and answer is saved to your learning history.</li>
            <li>You can continue from any device after you sign in.</li>
            <li>Admins can organize categories so the catalog stays useful.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
