import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3000';
let token = null;

async function login() {
  console.log('🔐 Logging in...');
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@hospital.com',
      password: 'admin123'
    })
  });
  
  const data = await response.json();
  if (data.success && data.token) {
    token = data.token;
    console.log('✅ Login successful');
    return true;
  } else {
    console.error('❌ Login failed:', data);
    return false;
  }
}

async function addDoctor(doctorData) {
  const response = await fetch(`${API_BASE_URL}/api/v1/doctors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(doctorData)
  });
  return response.json();
}

async function addPatient(patientData) {
  const response = await fetch(`${API_BASE_URL}/api/v1/patients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(patientData)
  });
  return response.json();
}

async function addAppointment(appointmentData) {
  const response = await fetch(`${API_BASE_URL}/api/v1/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(appointmentData)
  });
  return response.json();
}

async function addMedication(medicationData) {
  const response = await fetch(`${API_BASE_URL}/api/v1/medications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(medicationData)
  });
  return response.json();
}

async function seedDoctors() {
  console.log('\n👨‍⚕️ Seeding Doctors...');
  
  const doctors = [
    {
      name: 'Dr. John Smith',
      specialization: 'Cardiology',
      experience: 15,
      email: 'john.smith@hospital.com',
      phone: '+1 (555) 123-4567',
      availability: 'Mon-Fri 9AM-5PM',
      qualification: 'MD, FACC',
      consultationFee: 150
    },
    {
      name: 'Dr. Sarah Johnson',
      specialization: 'Pediatrics',
      experience: 12,
      email: 'sarah.johnson@hospital.com',
      phone: '+1 (555) 234-5678',
      availability: 'Mon-Thu 10AM-6PM',
      qualification: 'MD, FAAP',
      consultationFee: 120
    },
    {
      name: 'Dr. Michael Chen',
      specialization: 'Neurology',
      experience: 18,
      email: 'michael.chen@hospital.com',
      phone: '+1 (555) 345-6789',
      availability: 'Tue-Sat 8AM-4PM',
      qualification: 'MD, PhD, FAAN',
      consultationFee: 200
    },
    {
      name: 'Dr. Emily Williams',
      specialization: 'Orthopedics',
      experience: 10,
      email: 'emily.williams@hospital.com',
      phone: '+1 (555) 456-7890',
      availability: 'Mon-Fri 8AM-5PM',
      qualification: 'MD, FAAOS',
      consultationFee: 160
    },
    {
      name: 'Dr. Robert Brown',
      specialization: 'Dermatology',
      experience: 14,
      email: 'robert.brown@hospital.com',
      phone: '+1 (555) 567-8901',
      availability: 'Mon-Wed 9AM-5PM, Thu-Fri 1PM-5PM',
      qualification: 'MD, FAAD',
      consultationFee: 140
    },
    {
      name: 'Dr. Lisa Garcia',
      specialization: 'Obstetrics & Gynecology',
      experience: 11,
      email: 'lisa.garcia@hospital.com',
      phone: '+1 (555) 678-9012',
      availability: 'Mon-Fri 9AM-5PM',
      qualification: 'MD, FACOG',
      consultationFee: 170
    }
  ];
  
  for (const doctor of doctors) {
    const result = await addDoctor(doctor);
    if (result.success) {
      console.log(`  ✅ Added: ${doctor.name}`);
    } else {
      console.log(`  ⚠️ ${doctor.name} may already exist`);
    }
  }
}

async function seedPatients() {
  console.log('\n👥 Seeding Patients...');
  
  const patients = [
    {
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      bloodType: 'A+',
      phone: '+1 (555) 111-2222',
      email: 'john.doe@email.com',
      address: '123 Main St, New York, NY 10001',
      medicalHistory: 'Hypertension, High cholesterol',
      allergies: 'Penicillin'
    },
    {
      name: 'Jane Smith',
      age: 32,
      gender: 'Female',
      bloodType: 'O-',
      phone: '+1 (555) 222-3333',
      email: 'jane.smith@email.com',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      medicalHistory: 'Asthma',
      allergies: 'None'
    },
    {
      name: 'Robert Johnson',
      age: 58,
      gender: 'Male',
      bloodType: 'B+',
      phone: '+1 (555) 333-4444',
      email: 'robert.johnson@email.com',
      address: '789 Pine Rd, Chicago, IL 60601',
      medicalHistory: 'Diabetes Type 2, Arthritis',
      allergies: 'Sulfa drugs'
    },
    {
      name: 'Maria Martinez',
      age: 28,
      gender: 'Female',
      bloodType: 'AB+',
      phone: '+1 (555) 444-5555',
      email: 'maria.martinez@email.com',
      address: '321 Elm St, Houston, TX 77001',
      medicalHistory: 'None',
      allergies: 'Latex'
    },
    {
      name: 'James Wilson',
      age: 67,
      gender: 'Male',
      bloodType: 'A-',
      phone: '+1 (555) 555-6666',
      email: 'james.wilson@email.com',
      address: '654 Maple Dr, Phoenix, AZ 85001',
      medicalHistory: 'Heart disease, COPD',
      allergies: 'Codeine'
    },
    {
      name: 'Patricia Brown',
      age: 42,
      gender: 'Female',
      bloodType: 'O+',
      phone: '+1 (555) 666-7777',
      email: 'patricia.brown@email.com',
      address: '987 Cedar Ln, Philadelphia, PA 19101',
      medicalHistory: 'Migraines',
      allergies: 'None'
    },
    {
      name: 'Michael Davis',
      age: 35,
      gender: 'Male',
      bloodType: 'B-',
      phone: '+1 (555) 777-8888',
      email: 'michael.davis@email.com',
      address: '147 Birch St, San Antonio, TX 78201',
      medicalHistory: 'Anxiety',
      allergies: 'Peanuts'
    },
    {
      name: 'Jennifer Miller',
      age: 51,
      gender: 'Female',
      bloodType: 'AB-',
      phone: '+1 (555) 888-9999',
      email: 'jennifer.miller@email.com',
      address: '258 Spruce Ave, San Diego, CA 92101',
      medicalHistory: 'Thyroid disorder',
      allergies: 'Iodine'
    }
  ];
  
  for (const patient of patients) {
    const result = await addPatient(patient);
    if (result.success) {
      console.log(`  ✅ Added: ${patient.name}`);
    } else {
      console.log(`  ⚠️ ${patient.name} may already exist`);
    }
  }
}

async function seedAppointments() {
  console.log('\n📅 Seeding Appointments...');
  
  const appointments = [
    {
      patientName: 'John Doe',
      doctorName: 'Dr. John Smith',
      date: '2024-01-25',
      time: '10:00 AM',
      reason: 'Chest pain and shortness of breath',
      status: 'scheduled',
      type: 'Consultation'
    },
    {
      patientName: 'Jane Smith',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-01-26',
      time: '2:00 PM',
      reason: "Child's annual checkup and vaccinations",
      status: 'scheduled',
      type: 'Checkup'
    },
    {
      patientName: 'Robert Johnson',
      doctorName: 'Dr. Michael Chen',
      date: '2024-01-27',
      time: '11:30 AM',
      reason: 'Severe headaches and memory issues',
      status: 'scheduled',
      type: 'Neurology Consultation'
    },
    {
      patientName: 'Maria Martinez',
      doctorName: 'Dr. Emily Williams',
      date: '2024-01-28',
      time: '9:00 AM',
      reason: 'Knee pain after running',
      status: 'confirmed',
      type: 'Follow-up'
    },
    {
      patientName: 'James Wilson',
      doctorName: 'Dr. Robert Brown',
      date: '2024-01-29',
      time: '3:30 PM',
      reason: 'Skin rash and itching',
      status: 'scheduled',
      type: 'Consultation'
    },
    {
      patientName: 'Patricia Brown',
      doctorName: 'Dr. Lisa Garcia',
      date: '2024-01-30',
      time: '1:00 PM',
      reason: 'Annual women\'s health exam',
      status: 'scheduled',
      type: 'Wellness Visit'
    },
    {
      patientName: 'Michael Davis',
      doctorName: 'Dr. John Smith',
      date: '2024-01-31',
      time: '4:00 PM',
      reason: 'Follow-up on blood pressure medication',
      status: 'confirmed',
      type: 'Follow-up'
    },
    {
      patientName: 'Jennifer Miller',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-02-01',
      time: '10:30 AM',
      reason: 'Flu symptoms and fever',
      status: 'scheduled',
      type: 'Urgent Care'
    }
  ];
  
  for (const appointment of appointments) {
    const result = await addAppointment(appointment);
    if (result.success) {
      console.log(`  ✅ Added: ${appointment.patientName} -> ${appointment.doctorName} on ${appointment.date}`);
    } else {
      console.log(`  ⚠️ Appointment for ${appointment.patientName} may already exist`);
    }
  }
}

async function seedMedications() {
  console.log('\n💊 Seeding Medications...');
  
  const medications = [
    {
      name: 'Lisinopril',
      dosage: '10mg',
      quantity: 500,
      price: 25.99,
      manufacturer: 'Pfizer',
      expiryDate: '2025-12-31',
      prescriptionRequired: true,
      category: 'Cardiovascular'
    },
    {
      name: 'Metformin',
      dosage: '500mg',
      quantity: 1000,
      price: 15.50,
      manufacturer: 'Merck',
      expiryDate: '2025-10-15',
      prescriptionRequired: true,
      category: 'Diabetes'
    },
    {
      name: 'Amoxicillin',
      dosage: '250mg',
      quantity: 750,
      price: 12.99,
      manufacturer: 'GlaxoSmithKline',
      expiryDate: '2025-08-20',
      prescriptionRequired: true,
      category: 'Antibiotic'
    },
    {
      name: 'Ibuprofen',
      dosage: '200mg',
      quantity: 2000,
      price: 8.99,
      manufacturer: 'Johnson & Johnson',
      expiryDate: '2026-01-15',
      prescriptionRequired: false,
      category: 'Pain Relief'
    },
    {
      name: 'Atorvastatin',
      dosage: '20mg',
      quantity: 400,
      price: 35.99,
      manufacturer: 'Pfizer',
      expiryDate: '2025-11-30',
      prescriptionRequired: true,
      category: 'Cholesterol'
    },
    {
      name: 'Albuterol Inhaler',
      dosage: '90mcg',
      quantity: 150,
      price: 45.99,
      manufacturer: 'GSK',
      expiryDate: '2025-09-10',
      prescriptionRequired: true,
      category: 'Respiratory'
    },
    {
      name: 'Paracetamol',
      dosage: '500mg',
      quantity: 3000,
      price: 5.99,
      manufacturer: 'Various',
      expiryDate: '2026-03-20',
      prescriptionRequired: false,
      category: 'Pain Relief'
    },
    {
      name: 'Omeprazole',
      dosage: '20mg',
      quantity: 600,
      price: 18.99,
      manufacturer: 'AstraZeneca',
      expiryDate: '2025-07-25',
      prescriptionRequired: true,
      category: 'Gastrointestinal'
    },
    {
      name: 'Levothyroxine',
      dosage: '100mcg',
      quantity: 300,
      price: 22.50,
      manufacturer: 'AbbVie',
      expiryDate: '2025-12-05',
      prescriptionRequired: true,
      category: 'Thyroid'
    },
    {
      name: 'Vitamin D3',
      dosage: '1000 IU',
      quantity: 1500,
      price: 12.99,
      manufacturer: 'Nature Made',
      expiryDate: '2026-06-01',
      prescriptionRequired: false,
      category: 'Supplements'
    }
  ];
  
  for (const medication of medications) {
    const result = await addMedication(medication);
    if (result.success) {
      console.log(`  ✅ Added: ${medication.name} (${medication.dosage})`);
    } else {
      console.log(`  ⚠️ ${medication.name} may already exist`);
    }
  }
}

async function seedAll() {
  console.log('🌱 Starting database seeding...\n');
  
  const loggedIn = await login();
  if (!loggedIn) {
    console.error('Failed to login. Seeding aborted.');
    return;
  }
  
  await seedDoctors();
  await seedPatients();
  await seedAppointments();
  await seedMedications();
  
  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log('  - Doctors: 6 added');
  console.log('  - Patients: 8 added');
  console.log('  - Appointments: 8 added');
  console.log('  - Medications: 10 added');
  console.log('\n✅ You can now view this data in your web application!');
}

// Run the seeding
seedAll().catch(console.error);
