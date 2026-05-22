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

  // Function to render doctors data
  const renderDoctors = (data) => {
    const doctors = data.data || [];
    if (doctors.length === 0) return <p>No doctors found</p>;
    
    return (
      <div className="data-grid">
        {doctors.map(doctor => (
          <div key={doctor.id} className="data-card">
            <div className="data-card-header">
              <h4>👨‍⚕️ {doctor.name}</h4>
            </div>
            <div className="data-card-body">
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <p><strong>Experience:</strong> {doctor.experience} years</p>
              <p><strong>Qualification:</strong> {doctor.qualification}</p>
              <p><strong>Fee:</strong> ${doctor.consultationFee}</p>
              <p><strong>Availability:</strong> {doctor.availability}</p>
              <p><strong>Email:</strong> {doctor.email}</p>
              <p><strong>Phone:</strong> {doctor.phone}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Function to render patients data
  const renderPatients = (data) => {
    const patients = data.data || [];
    if (patients.length === 0) return <p>No patients found</p>;
    
    return (
      <div className="data-grid">
        {patients.map(patient => (
          <div key={patient.id} className="data-card">
            <div className="data-card-header">
              <h4>👤 {patient.name}</h4>
            </div>
            <div className="data-card-body">
              <p><strong>Age:</strong> {patient.age}</p>
              <p><strong>Gender:</strong> {patient.gender}</p>
              <p><strong>Blood Type:</strong> {patient.bloodType}</p>
              <p><strong>Phone:</strong> {patient.phone}</p>
              <p><strong>Email:</strong> {patient.email}</p>
              <p><strong>Address:</strong> {patient.address}</p>
              <p><strong>Medical History:</strong> {patient.medicalHistory}</p>
              <p><strong>Allergies:</strong> {patient.allergies}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Function to render appointments data
  const renderAppointments = (data) => {
    const appointments = data.data || [];
    if (appointments.length === 0) return <p>No appointments found</p>;
    
    return (
      <div className="data-grid">
        {appointments.map(appointment => (
          <div key={appointment.id} className="data-card">
            <div className="data-card-header">
              <h4>📅 Appointment #{appointment.id}</h4>
            </div>
            <div className="data-card-body">
              <p><strong>Patient:</strong> {appointment.patientName}</p>
              <p><strong>Doctor:</strong> {appointment.doctorName}</p>
              <p><strong>Date:</strong> {appointment.date}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
              <p><strong>Reason:</strong> {appointment.reason}</p>
              <p><strong>Status:</strong> <span className="status-badge">{appointment.status}</span></p>
              <p><strong>Type:</strong> {appointment.type}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Function to render medications data
  const renderMedications = (data) => {
    const medications = data.data || [];
    if (medications.length === 0) return <p>No medications found</p>;
    
    return (
      <div className="data-grid">
        {medications.map(med => (
          <div key={med.id} className="data-card">
            <div className="data-card-header">
              <h4>💊 {med.name}</h4>
            </div>
            <div className="data-card-body">
              <p><strong>Dosage:</strong> {med.dosage}</p>
              <p><strong>Quantity:</strong> {med.quantity}</p>
              <p><strong>Price:</strong> ${med.price}</p>
              <p><strong>Manufacturer:</strong> {med.manufacturer}</p>
              <p><strong>Expiry Date:</strong> {med.expiryDate}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (!moduleData) return null;
    
    if (moduleData.error) {
      return <div className="error-message">Error: {moduleData.error}</div>;
    }
    
    switch(activeModule) {
      case 'Doctors':
        return renderDoctors(moduleData);
      case 'Patients':
        return renderPatients(moduleData);
      case 'Appointments':
        return renderAppointments(moduleData);
      case 'Medications':
        return renderMedications(moduleData);
      default:
        return <pre>{JSON.stringify(moduleData, null, 2)}</pre>;
    }
  };

  return (
    <div className="dashboard">
      <div className="header">
        <div>
          <h1>🏥 Hospital Management System</h1>
          <p className="welcome-text">Welcome, Administrator</p>
        </div>
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
          <h2>👨‍⚕️</h2>
          <h3>Doctors</h3>
          <p>Manage doctor profiles and schedules</p>
          <button>Access</button>
        </div>
        
        <div className="module-card" onClick={() => loadModule('Patients', api.getPatients)}>
          <h2>👥</h2>
          <h3>Patients</h3>
          <p>Track patient information and history</p>
          <button>Access</button>
        </div>
        
        <div className="module-card" onClick={() => loadModule('Appointments', api.getAppointments)}>
          <h2>📅</h2>
          <h3>Appointments</h3>
          <p>Schedule and manage appointments</p>
          <button>Access</button>
        </div>
        
        <div className="module-card" onClick={() => loadModule('Medications', api.getMedications)}>
          <h2>💊</h2>
          <h3>Medications</h3>
          <p>Manage medications and prescriptions</p>
          <button>Access</button>
        </div>
      </div>
      
      {loading && <div className="loading">Loading...</div>}
      
      {moduleData && !loading && (
        <div className="module-data">
          <div className="module-data-header">
            <h3>{activeModule}</h3>
            <button className="close-btn" onClick={() => setModuleData(null)}>✕ Close</button>
          </div>
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
