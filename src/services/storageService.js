import AWS from 'aws-sdk';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'eu-west-1',
});

// Multer storage configuration
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// Upload file to S3
export const uploadFileToS3 = async (file, folder = 'documents') => {
  try {
    const key = `${folder}/${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'private',
    };

    const result = await s3.upload(params).promise();
    logger.info('File uploaded to S3', { key, url: result.Location });
    return {
      key,
      url: result.Location,
      bucket: process.env.AWS_S3_BUCKET,
      size: file.size,
    };
  } catch (error) {
    logger.error('S3 upload error', { error: error.message });
    throw error;
  }
};

// Download file from S3
export const downloadFileFromS3 = async (key) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };

    const result = await s3.getObject(params).promise();
    logger.info('File downloaded from S3', { key });
    return result;
  } catch (error) {
    logger.error('S3 download error', { error: error.message });
    throw error;
  }
};

// Delete file from S3
export const deleteFileFromS3 = async (key) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };

    await s3.deleteObject(params).promise();
    logger.info('File deleted from S3', { key });
  } catch (error) {
    logger.error('S3 delete error', { error: error.message });
    throw error;
  }
};

// Get S3 URL
export const getS3Url = (key) => {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

// Generate presigned URL
export const generatePresignedUrl = (key, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Expires: expiresIn,
    };

    const url = s3.getSignedUrl('getObject', params);
    logger.info('Presigned URL generated', { key });
    return url;
  } catch (error) {
    logger.error('Presigned URL generation error', { error: error.message });
    throw error;
  }
};

export default {
  upload,
  uploadFileToS3,
  downloadFileFromS3,
  deleteFileFromS3,
  getS3Url,
  generatePresignedUrl,
};