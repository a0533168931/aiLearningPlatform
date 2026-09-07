import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = user != null && typeof user.id === 'number';

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/register" replace />;
}
