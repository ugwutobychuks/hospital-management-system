import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user?.firstName}! 👋</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-600">Total Patients</p>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-600">Appointments</p>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-600">Bills</p>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-600">Status</p>
            <p className="text-3xl font-bold text-green-600">✓</p>
          </div>
        </div>
      </div>
    </div>
  );
}