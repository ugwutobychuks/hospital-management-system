import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    beds: 0,
  });

  useEffect(() => {
    // Animate counters on mount
    animateCounter('doctorCount', 24);
    animateCounter('patientCount', 156);
    animateCounter('appointmentCount', 42);
    animateCounter('bedCount', 78);
  }, []);

  const animateCounter = (elementId, target, duration = 1000) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    let current = 0;
    const increment = target / (duration / 16);

    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(counter);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>🏥 Hospital Management System</h1>
        </div>
        <div className="nav-user">
          <span>Welcome, {user?.firstName || 'User'}</span>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="header">
          <h2>System Dashboard</h2>
          <p>Overview of Hospital Operations</p>
        </div>

        <div className="stats-section">
          <h3>System Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👨‍⚕️</div>
              <div className="stat-number" id="doctorCount">
                0
              </div>
              <div className="stat-label">Doctors</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏥</div>
              <div className="stat-number" id="patientCount">
                0
              </div>
              <div className="stat-label">Patients</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-number" id="appointmentCount">
                0
              </div>
              <div className="stat-label">Appointments</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🛏️</div>
              <div className="stat-number" id="bedCount">
                0
              </div>
              <div className="stat-label">Beds Available</div>
            </div>
          </div>
        </div>

        <div className="modules-section">
          <h3>Available Modules</h3>
          <div className="modules-grid">
            <div className="module-card">
              <div className="module-icon">👨‍⚕️</div>
              <h4>Doctors</h4>
              <p>Manage doctor profiles and schedules</p>
              <button className="btn btn-primary">Access</button>
            </div>
            <div className="module-card">
              <div className="module-icon">🏥</div>
              <h4>Patients</h4>
              <p>Track patient information and history</p>
              <button className="btn btn-primary">Access</button>
            </div>
            <div className="module-card">
              <div className="module-icon">📋</div>
              <h4>Appointments</h4>
              <p>Schedule and manage appointments</p>
              <button className="btn btn-primary">Access</button>
            </div>
            <div className="module-card">
              <div className="module-icon">💊</div>
              <h4>Medications</h4>
              <p>Manage medications and prescriptions</p>
              <button className="btn btn-primary">Coming Soon</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;