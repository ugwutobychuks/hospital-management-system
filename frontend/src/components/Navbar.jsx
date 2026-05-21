import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded">
                <span className="font-bold">HMS</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline">Hospital Management</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
                <Link to="/patients" className="text-gray-600 hover:text-blue-600">Patients</Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.firstName}</span>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-800">Logout</button>
              </>
            ) : (
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}