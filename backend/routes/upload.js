const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Uses Cloudinary (free tier) for storage instead of the local disk — Render's disk is
// wiped on every restart/redeploy, so anything written to it disappears unpredictably.
// Configure with either CLOUDINARY_URL, or the three CLOUDINARY_* vars below.
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB — plenty for a phone photo, keeps uploads fast
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, WEBP, or GIF images are allowed.'));
    }
    cb(null, true);
  },
});

// POST /api/upload - admin: upload a rooster photo to Cloudinary, returns its permanent URL
router.post('/', requireAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No image file received.' });

    if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({
        error: 'Image storage is not configured on the server. Set CLOUDINARY_URL (or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET) in the backend environment.',
      });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'ghilbert-transport', resource_type: 'image' },
      (uploadErr, result) => {
        if (uploadErr) {
          return res.status(502).json({ error: 'Image upload failed. Please try again.' });
        }
        res.status(201).json({ url: result.secure_url });
      }
    );
    stream.end(req.file.buffer);
  });
});

module.exports = router;