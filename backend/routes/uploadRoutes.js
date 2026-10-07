import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const router = express.Router();

router.post('/', protect, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const localUrl = `/uploads/${req.file.filename}`;

    // If Cloudinary credentials configured and valid, attempt Cloudinary upload
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'demo' &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== 'demo'
    ) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'lms_uploads',
          resource_type: 'auto',
        });
        // Remove local file after cloud upload
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(200).json({
          success: true,
          url: uploadResult.secure_url,
          filename: req.file.originalname,
        });
      } catch (cloudErr) {
        console.warn('Cloudinary upload skipped, falling back to local storage:', cloudErr.message);
      }
    }

    // Local file fallback
    const fullUrl = `${req.protocol}://${req.get('host')}${localUrl}`;
    res.status(200).json({
      success: true,
      url: fullUrl,
      filename: req.file.originalname,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
