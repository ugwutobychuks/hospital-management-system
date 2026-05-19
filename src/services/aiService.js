import { logger } from '../config/logger.js';
import dotenv from 'dotenv';

dotenv.config();

// AI Symptom Triage
export const triageSymptoms = async (symptoms) => {
  try {
    // Simulated AI symptom triage
    // In production, integrate with OpenAI, Azure Cognitive Services, or similar

    const symptomMap = {
      fever: { severity: 'high', category: 'infection', recommendations: ['See doctor within 24 hours', 'Stay hydrated'] },
      cough: { severity: 'medium', category: 'respiratory', recommendations: ['Rest', 'Cough syrup', 'See doctor if persists'] },
      headache: { severity: 'low', category: 'neurological', recommendations: ['Rest', 'Pain reliever', 'Monitor'] },
      chest_pain: { severity: 'critical', category: 'cardiac', recommendations: ['Call emergency immediately', 'Go to nearest hospital'] },
      shortness_of_breath: { severity: 'critical', category: 'respiratory', recommendations: ['Call emergency', 'Seek immediate medical attention'] },
    };

    let maxSeverity = 'low';
    const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
    let allRecommendations = [];

    symptoms.forEach((symptom) => {
      if (symptomMap[symptom]) {
        if (severityOrder[symptomMap[symptom].severity] > severityOrder[maxSeverity]) {
          maxSeverity = symptomMap[symptom].severity;
        }
        allRecommendations.push(...symptomMap[symptom].recommendations);
      }
    });

    logger.info('Symptom triage completed', { symptoms, severity: maxSeverity });

    return {
      severity: maxSeverity,
      symptoms,
      recommendations: [...new Set(allRecommendations)],
      suggestedSpecializations: getSuggestedSpecializations(symptoms),
    };
  } catch (error) {
    logger.error('Symptom triage error', { error: error.message });
    throw error;
  }
};

// Predict Health Risk
export const predictHealthRisk = async (patientData) => {
  try {
    // Simulated predictive analytics
    // In production, use machine learning models

    const { age, bloodPressure, bloodSugar, cholesterol, bmi } = patientData;

    let riskScore = 0;
    let riskFactors = [];

    if (age > 60) {
      riskScore += 2;
      riskFactors.push('Age over 60');
    }

    if (bloodPressure > 140) {
      riskScore += 3;
      riskFactors.push('High blood pressure');
    }

    if (bloodSugar > 126) {
      riskScore += 3;
      riskFactors.push('Elevated blood sugar');
    }

    if (cholesterol > 240) {
      riskScore += 2;
      riskFactors.push('High cholesterol');
    }

    if (bmi > 30) {
      riskScore += 2;
      riskFactors.push('Obesity');
    }

    const riskLevel = riskScore < 3 ? 'low' : riskScore < 7 ? 'medium' : 'high';

    logger.info('Health risk prediction completed', { riskLevel, riskScore });

    return {
      riskLevel,
      riskScore,
      riskFactors,
      recommendations: getRiskRecommendations(riskLevel),
    };
  } catch (error) {
    logger.error('Health risk prediction error', { error: error.message });
    throw error;
  }
};

// Generate Consultation Summary
export const generateConsultationSummary = async (consultationData) => {
  try {
    const { chiefsComplaint, diagnosis, treatment, medications } = consultationData;

    const summary = `
Consultation Summary:

Chief Complaint: ${chiefsComplaint}
Diagnosis: ${diagnosis}
Treatment Plan: ${treatment}
Medications Prescribed: ${medications.join(', ')}

Recommendations:
- Follow medication schedule strictly
- Rest and avoid strenuous activities
- Return for follow-up after 7 days
- Contact doctor immediately if symptoms worsen
    `;

    logger.info('Consultation summary generated');

    return {
      summary,
      generatedAt: new Date(),
    };
  } catch (error) {
    logger.error('Consultation summary generation error', { error: error.message });
    throw error;
  }
};

// Helper function to get suggested specializations
function getSuggestedSpecializations(symptoms) {
  const specializations = [];

  const symptomToSpecialty = {
    chest_pain: 'Cardiology',
    shortness_of_breath: 'Pulmonology',
    fever: 'Internal Medicine',
    cough: 'Pulmonology',
    joint_pain: 'Orthopedics',
    skin_rash: 'Dermatology',
    eye_pain: 'Ophthalmology',
  };

  symptoms.forEach((symptom) => {
    if (symptomToSpecialty[symptom]) {
      specializations.push(symptomToSpecialty[symptom]);
    }
  });

  return [...new Set(specializations)];
}

// Helper function to get risk recommendations
function getRiskRecommendations(riskLevel) {
  const recommendations = {
    low: [
      'Maintain healthy lifestyle',
      'Regular exercise',
      'Balanced diet',
      'Annual health checkup',
    ],
    medium: [
      'Increase physical activity',
      'Reduce salt intake',
      'Monitor vital signs regularly',
      'Quarterly health checkup',
      'Medication compliance',
    ],
    high: [
      'Immediate medical consultation required',
      'Regular hospital visits',
      'Strict medication schedule',
      'Daily vital monitoring',
      'Lifestyle changes mandatory',
      'Monthly specialist review',
    ],
  };

  return recommendations[riskLevel] || [];
}

export default {
  triageSymptoms,
  predictHealthRisk,
  generateConsultationSummary,
};