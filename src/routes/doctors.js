import express from 'express';
const router = express.Router();

let doctors = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
    name: 'Dr. Robert Brown',
    specialization: 'Dermatology',
    experience: 14,
    email: 'robert.brown@hospital.com',
    phone: '+1 (555) 567-8901',
    availability: 'Mon-Wed 9AM-5PM',
    qualification: 'MD, FAAD',
    consultationFee: 140
  },
  {
    id: 6,
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

// GET all doctors (no auth required for testing)
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      data: doctors,
      total: doctors.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single doctor
router.get('/:id', async (req, res) => {
  try {
    const doctor = doctors.find(d => d.id === parseInt(req.params.id));
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create doctor
router.post('/', async (req, res) => {
  try {
    const newDoctor = {
      id: doctors.length + 1,
      ...req.body
    };
    doctors.push(newDoctor);
    res.json({ success: true, data: newDoctor, message: 'Doctor created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
