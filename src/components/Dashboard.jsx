import React, { useState } from 'react';
import api from '../utils/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [moduleData, setModuleData] = useState(null);
  const [activeModule, setActiveModule] = useState(null);

  const loadModule = async (moduleName, apiMethod) => {
    setLoading(true);
    setActiveModule(moduleName);
    try {
      const response = await apiMethod();
      console.log(`${moduleName} response:`, response);
      setModuleData(response);
    } catch (error) {
      console.error(`Error loading ${moduleName}:`, error);
      setModuleData({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Hospital Management System</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      <div className="stats">
        <div className="stat-card">
          <h3>24</h3>
          <p>Doctors</p>
        </div>
        <div className="stat-card">
          <h3>156</h3>
          <p>Patients</p>
        </div>
        <div className="stat-card">
          <h3>42</h3>
          <p>Appointments</p>
        </div>
        <div className="stat-card">
          <h3>78</h3>
          <p>Beds Available</p>
        </div>
      </div>
      
      <div className="modules-grid">
        <div className="module-card" onClick={() => loadModule('Doctors', api.getDoctors)}>
          <h2>👨‍⚕️ Doctors</h2>
          <p>Manage doctor profiles and schedules</p>
          <button>Access</button>
        </div>
        
        <div className="module-card" onClick={() => loadModule('Patients', api.getPatients)}>
          <h2>👥 Patients</h2>
          <p>Track patient information and history</p>
          <button>Access</button>
        </div>
        
        <div className="module-card" onClick={() => loadModule('Appointments', api.getAppointments)}>
          <h2>📅 Appointments</h2>
          <p>Schedule and manage appointments</p>
          <button>Access</button>
        </div>
        
        <div className="module-card" onClick={() => loadModule('Medications', api.getMedications)}>
          <h2>💊 Medications</h2>
          <p>Manage medications and prescriptions</p>
          <button>Coming Soon</button>
        </div>
      </div>
      
      {loading && <div className="loading">Loading...</div>}
      
      {moduleData && !loading && (
        <div className="module-data">
          <h3>{activeModule} Data</h3>
          <pre>{JSON.stringify(moduleData, null, 2)}</pre>
          <button onClick={() => setModuleData(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
