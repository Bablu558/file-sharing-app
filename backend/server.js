const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // CORS package
const dotenv = require('dotenv');
const socketio = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');

// Initialize dotenv for environment variables
dotenv.config();

const app = express();

// CORS configuration to allow requests from the frontend (localhost:3000)
app.use(cors({
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,  
    optionsSuccessStatus: 200  
}));

// Middleware to parse JSON request bodies
app.use(express.json()); 

// Use the routes
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);


app.use('/uploads', express.static('uploads'));


// Add this route for downloadable links
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('File download error:', err);
        res.status(500).send('Could not download the file.');
      }
    });
  });

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));


app.get('/', (req, res) => {
    res.send('File Sharing Application API');
});

// Set the port
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Socket.io setup for real-time communication
const io = socketio(server, {
    cors: {
        origin: '*', 
    },
});

app.set('io', io); // Store io instance in app for access in routes

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
