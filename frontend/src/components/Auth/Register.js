
import React, { useState, useEffect } from 'react';
import { registerUser } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom'; 
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Box,
    CircularProgress,
} from '@mui/material';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/upload');
        }
    }, [navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        try {
            const userData = { username, email, password };
            const response = await registerUser(userData);
            if (response.data.message === 'User registered successfully') {
                alert('Registration successful!');
                navigate('/login');
            }
        } catch (error) {
            setLoading(false);
            setErrorMessage(error.response?.data?.message || 'Server error');
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Paper elevation={6} sx={{ padding: 3, width: '100%', maxWidth: '400px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h5" gutterBottom>Register</Typography>
                    {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                    <form onSubmit={handleRegister} style={{ width: '100%', marginTop: '16px' }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Register'}
                        </Button>
                    </form>
                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                        Already have an account? <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>Login</Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
