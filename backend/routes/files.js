
const express = require('express');
const multer = require('multer');  
const path = require('path');
const File = require('../models/File');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });

// Upload a file route
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
    try {
        const { filename, path: filePath, size } = req.file;  
        const fileUrl = `http://localhost:5000/${filePath}`;  

        const newFile = new File({
            filename,
            fileUrl,
            user: req.user.id,  
            size,
        });

        await newFile.save();
        res.json({ message: 'File uploaded successfully', file: newFile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading file' });
    }
});

// Get all files route
router.get('/', verifyToken, async (req, res) => {
    try {
        const files = await File.find();
        res.json({ files });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
