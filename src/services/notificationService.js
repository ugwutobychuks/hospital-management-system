import twilio from 'twilio';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import { logger } from '../config/logger.js';
import dotenv from 'dotenv';

dotenv.config();

// Twilio Setup
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Firebase Setup
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (process.env.FIREBASE_PROJECT_ID) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
}

// Email Setup
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Send SMS
export const sendSMS = async (phoneNumber, message) => {
  try {
    const response = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    logger.info('SMS sent successfully', { phoneNumber, messageSid: response.sid });
    return response;
  } catch (error) {
    logger.error('SMS sending error', { phoneNumber, error: error.message });
    throw error;
  }
};

// Send Email
export const sendEmail = async (to, subject, html) => {
  try {
    const response = await emailTransporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
    logger.info('Email sent successfully', { to, subject });
    return response;
  } catch (error) {
    logger.error('Email sending error', { to, error: error.message });
    throw error;
  }
};

// Send Push Notification
export const sendPushNotification = async (deviceToken, title, body, data = {}) => {
  try {
    if (!process.env.FIREBASE_PROJECT_ID) {
      logger.warn('Firebase not configured, skipping push notification');
      return null;
    }

    const message = {
      notification: {
        title,
        body,
      },
      data,
      token: deviceToken,
    };

    const response = await admin.messaging().send(message);
    logger.info('Push notification sent', { deviceToken, title });
    return response;
  } catch (error) {
    logger.error('Push notification error', { error: error.message });
    throw error;
  }
};

// Send Appointment Reminder
export const sendAppointmentReminder = async (patient, doctor, appointmentDate, phone, email) => {
  const appointmentDateFormatted = new Date(appointmentDate).toLocaleString('en-NG', {
    timeZone: 'Africa/Lagos',
  });

  const smsMessage = `Hello ${patient.firstName}, you have an appointment with Dr. ${doctor.firstName} ${doctor.lastName} on ${appointmentDateFormatted}. Reply CONFIRM to confirm your attendance.`;

  const emailSubject = 'Appointment Reminder';
  const emailBody = `
    <h2>Appointment Reminder</h2>
    <p>Dear ${patient.firstName} ${patient.lastName},</p>
    <p>This is a reminder that you have an appointment scheduled with <strong>Dr. ${doctor.firstName} ${doctor.lastName}</strong></p>
    <p><strong>Date & Time:</strong> ${appointmentDateFormatted}</p>
    <p>Please arrive 10 minutes early. If you need to reschedule, please contact us.</p>
    <p>Best regards,<br/>Hospital Management System</p>
  `;

  try {
    if (phone) {
      await sendSMS(phone, smsMessage);
    }
    if (email) {
      await sendEmail(email, emailSubject, emailBody);
    }
    logger.info('Appointment reminder sent', { patientId: patient.id });
  } catch (error) {
    logger.error('Failed to send appointment reminder', { error: error.message });
  }
};

// Send Lab Result Notification
export const sendLabResultNotification = async (patient, testName, result, phone, email) => {
  const smsMessage = `Hello ${patient.firstName}, your lab test (${testName}) results are ready. Please contact the hospital to collect your report.`;

  const emailSubject = 'Lab Test Results Ready';
  const emailBody = `
    <h2>Lab Test Results</h2>
    <p>Dear ${patient.firstName} ${patient.lastName},</p>
    <p>Your lab test <strong>${testName}</strong> has been completed.</p>
    <p>Results: ${JSON.stringify(result)}</p>
    <p>Please visit the hospital or login to your account to view detailed results.</p>
    <p>Best regards,<br/>Laboratory Department</p>
  `;

  try {
    if (phone) {
      await sendSMS(phone, smsMessage);
    }
    if (email) {
      await sendEmail(email, emailSubject, emailBody);
    }
  } catch (error) {
    logger.error('Failed to send lab result notification', { error: error.message });
  }
};

// Send Prescription Ready Notification
export const sendPrescriptionReadyNotification = async (patient, pharmacy, phone, email) => {
  const smsMessage = `Hello ${patient.firstName}, your prescription from Dr. ${pharmacy.doctorName} is ready for pickup. Visit ${pharmacy.name} to collect.`;

  const emailSubject = 'Prescription Ready for Pickup';
  const emailBody = `
    <h2>Prescription Ready</h2>
    <p>Dear ${patient.firstName} ${patient.lastName},</p>
    <p>Your prescription is now ready for pickup at <strong>${pharmacy.name}</strong></p>
    <p>Please bring your prescription ID and valid ID for verification.</p>
    <p>Best regards,<br/>Pharmacy Department</p>
  `;

  try {
    if (phone) {
      await sendSMS(phone, smsMessage);
    }
    if (email) {
      await sendEmail(email, emailSubject, emailBody);
    }
  } catch (error) {
    logger.error('Failed to send prescription notification', { error: error.message });
  }
};

export default {
  sendSMS,
  sendEmail,
  sendPushNotification,
  sendAppointmentReminder,
  sendLabResultNotification,
  sendPrescriptionReadyNotification,
};