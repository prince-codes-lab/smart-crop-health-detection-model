const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Image = require('../models/Image');

const router = express.Router();

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Image upload route
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { farmerId, healthStatus, recommendation } = req.body;

    // Validate farmerId
    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({ error: 'Invalid farmerId format' });
    }

    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Create and save image document
    const image = new Image({
      imageUrl: `/uploads/${req.file.filename}`,
      healthStatus,
      recommendation,
      farmerId: mongoose.Types.ObjectId(farmerId),
      timestamp: new Date()
    });

    await image.save();

    res.status(201).json({
      message: 'Image uploaded and saved successfully',
      image
    });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Server error during image upload' });
  }
});

// Analyze image route
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const { farmerId, healthStatus, recommendation } = req.body;

    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({ error: 'Invalid farmerId format' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // 🔮 Simulate ML analysis (replace with real model later)
    const mockHealthStatus = 'Diseased';
    const mockRecommendation = 'Apply organic pesticide and monitor for fungal spread';

    // Save result to database
    const image = new Image({
      imageUrl: `/uploads/${req.file.filename}`,
      healthStatus: mockHealthStatus,
      recommendation: mockRecommendation,
      farmerId: new mongoose.Types.ObjectId(farmerId),
      timestamp: new Date()
    });

    await image.save();

    res.status(200).json({
      message: 'Image analyzed successfully',
      healthStatus: mockHealthStatus,
      recommendation: mockRecommendation,
      image
    });
  } catch (err) {
    console.error('Image analysis error:', err);
    res.status(500).json({ error: 'Server error during image analysis' });
  }
});


module.exports = router;
