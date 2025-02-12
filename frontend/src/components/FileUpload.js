
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../services/api';
import { io } from 'socket.io-client';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Input,
    CircularProgress,
    styled
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const DragDropBox = styled(Box)(({ theme, isDragging }) => ({
    border: '2px dashed #1976d2',
    borderRadius: '8px',
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: isDragging ? '#e3f2fd' : '#fafafa',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
}));

const FileUpload = ({ setFiles }) => {
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check if the user is logged in
    const isAuthenticated = localStorage.getItem('token') !== null;

    // Redirect to login page if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); // Redirect to login page if user is not authenticated
        }
    }, [isAuthenticated, navigate]);

    const socket = io('https://file-sharing-app-1-ds6j.onrender.com');

    socket.on('fileUploaded', (newFile) => {
        if (typeof setFiles === 'function') {
            setFiles((prevFiles) => [...prevFiles, newFile]);
        } else {
            console.error('setFiles is not a function');
        }
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
            if (!validTypes.includes(selectedFile.type)) {
                setErrorMessage('Invalid file type. Please upload a PDF, image, video, or audio file.');
            } else {
                setFile(selectedFile);
                setErrorMessage('');
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) {
            const selectedFile = e.dataTransfer.files[0];
            const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
            if (!validTypes.includes(selectedFile.type)) {
                setErrorMessage('Invalid file type. Please upload a PDF, image, video, or audio file.');
            } else {
                setFile(selectedFile);
                setErrorMessage('');
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);

        try {
            await uploadFile(formData, token);
            alert('File uploaded successfully');
            navigate('/files');
        } catch (error) {
            console.error('Error uploading file', error);
            setErrorMessage(error.response ? error.response.data.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#e0f7fa' }}>
            <Card sx={{ width: '100%', maxWidth: 500 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Upload File
                    </Typography>
                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                    <form onSubmit={handleSubmit}>
                        <DragDropBox
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            isDragging={isDragging}
                        >
                            <CloudUploadIcon sx={{ fontSize: 50, color: '#1976d2' }} />
                            <Typography variant="body1">
                                Drag and drop a file here or click to select
                            </Typography>
                            <Input type="file" onChange={handleFileChange} sx={{ display: 'none' }} id="file-input" />
                            <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                                <Button variant="contained" component="span" sx={{ mt: 2 }}>
                                    Choose File
                                </Button>
                            </label>
                            {file && <Typography variant="body2">Selected: {file.name}</Typography>}
                        </DragDropBox>
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Upload'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default FileUpload;

