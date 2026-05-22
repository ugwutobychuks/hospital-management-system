import express from 'express';
const router = express.Router();

let medications = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
    name: 'Amoxicillin',
    dosage: '250mg',
    quantity: 750,
    price: 12.99,
    manufacturer: 'GlaxoSmithKline',
    expiryDate: '2025-08-20',
    prescriptionRequired: true,
    category: 'Antibiotic'
  }
];

let nextId = 4;

router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      data: medications
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newMedication = { id: nextId++, ...req.body };
    medications.push(newMedication);
    res.json({ success: true, data: newMedication, message: 'Medication added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
