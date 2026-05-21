import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-2xl mt-4">Page not found</p>
        <Link to="/dashboard" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}