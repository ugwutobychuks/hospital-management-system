import express from 'express';
const router = express.Router();

let patients = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
    name: 'Maria Martinez',
    age: 28,
    gender: 'Female',
    bloodType: 'AB+',
    phone: '+1 (555) 444-5555',
    email: 'maria.martinez@email.com',
    address: '321 Elm St, Houston, TX 77001',
    medicalHistory: 'None',
    allergies: 'Latex'
  }
];

// GET all patients (no auth required for testing)
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      data: patients,
      total: patients.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single patient
router.get('/:id', async (req, res) => {
  try {
    const patient = patients.find(p => p.id === parseInt(req.params.id));
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create patient
router.post('/', async (req, res) => {
  try {
    const newPatient = {
      id: patients.length + 1,
      ...req.body
    };
    patients.push(newPatient);
    res.json({ success: true, data: newPatient, message: 'Patient created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
