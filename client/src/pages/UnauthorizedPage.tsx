import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function UnauthorizedPage() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = user != null && typeof user.id === 'number';

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
