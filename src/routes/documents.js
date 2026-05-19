import express from 'express';
import { query } from '../config/database.js';
import { logger } from '../config/logger.js';
import { authenticate } from '../middlewares/auth.js';
import { upload, uploadFileToS3, deleteFileFromS3, generatePresignedUrl } from '../services/storageService.js';

const router = express.Router();

// Upload Medical Document
router.post('/upload', authenticate, upload.single('document'), async (req, res) => {
  try {
    const { patientId, documentType, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Upload to S3
    const fileData = await uploadFileToS3(req.file, `documents/${patientId}`);

    // Save metadata to database
    const result = await query(
      `INSERT INTO documents (patient_id, document_type, description, file_key, file_url, file_size, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [patientId, documentType, description, fileData.key, fileData.url, fileData.size]
    );

    logger.info('Medical document uploaded', { patientId, documentType, fileKey: fileData.key });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: result.rows[0],
    });
  } catch (error) {
    logger.error('Document upload error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Document upload failed',
    });
  }
});

// Get Patient Documents
router.get('/patient/:patientId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM documents WHERE patient_id = $1 ORDER BY created_at DESC`,
      [req.params.patientId]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    logger.error('Get documents error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve documents',
    });
  }
});

// Generate Download Link
router.get('/download/:documentId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM documents WHERE id = $1`,
      [req.params.documentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    const document = result.rows[0];
    const presignedUrl = generatePresignedUrl(document.file_key, 3600);

    logger.info('Download link generated', { documentId: req.params.documentId });

    res.status(200).json({
      success: true,
      data: {
        documentId: document.id,
        documentType: document.document_type,
        downloadUrl: presignedUrl,
        expiresIn: '1 hour',
      },
    });
  } catch (error) {
    logger.error('Generate download link error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to generate download link',
    });
  }
});

// Delete Document
router.delete('/:documentId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM documents WHERE id = $1`,
      [req.params.documentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    const document = result.rows[0];

    // Delete from S3
    await deleteFileFromS3(document.file_key);

    // Delete from database
    await query('DELETE FROM documents WHERE id = $1', [req.params.documentId]);

    logger.info('Document deleted', { documentId: req.params.documentId });

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    logger.error('Document deletion error', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Document deletion failed',
    });
  }
});

export default router;