import express from 'express';
const router = express.Router();

let appointments = [
  {
    id: 1,
    patientName: 'John Doe',
    doctorName: 'Dr. John Smith',
    date: '2024-01-25',
    time: '10:00 AM',
    reason: 'Chest pain and shortness of breath',
    status: 'scheduled',
    type: 'Consultation'
  },
  {
    id: 2,
    patientName: 'Jane Smith',
    doctorName: 'Dr. Sarah Johnson',
    date: '2024-01-26',
    time: '2:00 PM',
    reason: "Child's annual checkup and vaccinations",
    status: 'scheduled',
    type: 'Checkup'
  },
  {
    id: 3,
    patientName: 'Robert Johnson',
    doctorName: 'Dr. Michael Chen',
    date: '2024-01-27',
    time: '11:30 AM',
    reason: 'Severe headaches and memory issues',
    status: 'scheduled',
    type: 'Neurology Consultation'
  }
];

let nextId = 4;

router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      data: appointments,
      total: appointments.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newAppointment = { id: nextId++, ...req.body };
    appointments.push(newAppointment);
    res.json({ success: true, data: newAppointment, message: 'Appointment created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
