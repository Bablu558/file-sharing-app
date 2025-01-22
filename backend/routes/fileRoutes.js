

const express = require('express');
const multer = require('multer');
const File = require('../models/File');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Multer file upload configuration with file type validation
const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'application/pdf', 
            'image/png',        
            'image/jpeg',       
            'image/jpg',        
            'video/mp4',       
            'audio/mpeg',       
            'audio/wav',        
            'audio/ogg',        
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only PDF, image, video, and audio files are allowed.'));
        }
        cb(null, true);
    },
});

// File upload route
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
      console.log('File received:', req.file);  // Debugging file data
      console.log('User:', req.user);  // Debugging user data

      const filename = req.file.filename;
      const fileUrl = `/uploads/${filename}`;

      const file = new File({
          filename,
          fileUrl,
          user: req.user.id,  
      });

      await file.save();  // Save to MongoDB
      const io = req.app.get('io');
      io.emit('fileUploaded', file);
      res.status(201).json(file);
  } catch (error) {
      console.error('Error saving file:', error);
      res.status(500).json({ message: 'File upload failed' });
  }
});

// Route to fetch all uploaded files
router.get('/', verifyToken, async (req, res) => {
  try {
    const files = await File.find(); // Fetch all files from MongoDB
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files' });
  }
});

module.exports = router;
