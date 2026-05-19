import express from 'express';
import { logger } from '../config/logger.js';
import { authenticate } from '../middlewares/auth.js';
import { triageSymptoms, predictHealthRisk, generateConsultationSummary } from '../services/aiService.js';

const router = express.Router();

// AI Symptom Triage
router.post('/triage', authenticate, async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Symptoms array is required',
      });
    }

    const triageResult = await triageSymptoms(symptoms);

    logger.info('AI triage completed', { symptomsCount: symptoms.length });

    res.status(200).json({
      success: true,
      message: 'Symptom triage completed',
      data: triageResult,
    });
  } catch (error) {
    logger.error('AI triage error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'AI triage failed',
    });
  }
});

// Predict Health Risk
router.post('/predict-risk', authenticate, async (req, res) => {
  try {
    const { age, bloodPressure, bloodSugar, cholesterol, bmi } = req.body;

    const riskPrediction = await predictHealthRisk({
      age,
      bloodPressure,
      bloodSugar,
      cholesterol,
      bmi,
    });

    logger.info('Health risk prediction completed', { age });

    res.status(200).json({
      success: true,
      message: 'Health risk prediction completed',
      data: riskPrediction,
    });
  } catch (error) {
    logger.error('Risk prediction error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Risk prediction failed',
    });
  }
});

// Generate Consultation Summary
router.post('/summary', authenticate, async (req, res) => {
  try {
    const { chiefsComplaint, diagnosis, treatment, medications } = req.body;

    const summary = await generateConsultationSummary({
      chiefsComplaint,
      diagnosis,
      treatment,
      medications,
    });

    logger.info('Consultation summary generated');

    res.status(200).json({
      success: true,
      message: 'Consultation summary generated',
      data: summary,
    });
  } catch (error) {
    logger.error('Summary generation error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Summary generation failed',
    });
  }
});

export default router;