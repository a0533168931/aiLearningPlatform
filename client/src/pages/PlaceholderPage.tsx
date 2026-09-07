import { useLocation, useParams } from 'react-router-dom';

export default function PlaceholderPage() {
  const { pathname } = useLocation();
  const params = useParams();
  const paramEntries = Object.entries(params);

  return (
    <main className="status-page">
      <h1>Coming soon</h1>
      <p>{pathname}</p>
      {paramEntries.length > 0 && (
        <ul>
          {paramEntries.map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
