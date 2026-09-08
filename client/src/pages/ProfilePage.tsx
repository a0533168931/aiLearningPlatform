import { useAuth } from '../hooks/useAuth';
import '../styles/app-pages.css';

export default function ProfilePage() {
  const { user } = useAuth();

  if (user == null) {
    return (
      <main className="app-page">
        <h1>Profile</h1>
        <p className="app-alert" role="alert">
          You need to sign in to view your profile.
        </p>
      </main>
    );
  }

  return (
    <main className="app-page">
      <h1>Profile</h1>
      <p className="app-lede">
        Your account details. Profile editing is not available.
      </p>
      <dl className="app-dl">
        <div>
          <dt>Name</dt>
          <dd>{user.name}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{user.role}</dd>
        </div>
        <div>
          <dt>Member since</dt>
          <dd>
            <time dateTime={user.createdAt}>
              {new Date(user.createdAt).toLocaleString()}
            </time>
          </dd>
        </div>
      </dl>
    </main>
  );
}
