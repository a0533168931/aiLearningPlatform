import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function UnauthorizedPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="status-page">
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <p>
        <Link to="/dashboard">Back to dashboard</Link>
      </p>
    </main>
  );
}
