import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

// Navbar Component
const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') !== null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(token !== null);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);  // Update state immediately on logout
        window.location.href = "/";  // Redirect to home after logout
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Button component={Link} to="/" color="inherit">Home</Button>
                    {isAuthenticated && (
                        <>
                            <Button component={Link} to="/upload" color="inherit">Upload</Button>
                            <Button component={Link} to="/files" color="inherit">Files</Button>
                        </>
                    )}
                </Box>

                {isAuthenticated ? (
                    <Button onClick={handleLogout} color="inherit">Logout</Button>
                ) : (
                    <>
                        <Button component={Link} to="/login" color="inherit">Login</Button>
                        <Button component={Link} to="/register" color="inherit">Register</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Navbar />  {/* Add Navbar to the top of all routes */}
            <Container sx={{ marginTop: 4 }}>
                <Routes>
                    <Route path="/" element={<FileUpload />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/upload" element={<ProtectedRoute><FileUpload /></ProtectedRoute>} />
                    <Route path="/files" element={<ProtectedRoute><FileList /></ProtectedRoute>} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
