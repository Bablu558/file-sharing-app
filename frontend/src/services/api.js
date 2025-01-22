// frontend/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = async (userData) => {
    try {
        return await axios.post(`${API_URL}/users/register`, userData, {
            headers: {
                'Content-Type': 'application/json',  
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const loginUser = async (userData) => {
    return await axios.post(`${API_URL}/users/login`, userData, {
        headers: {
            'Content-Type': 'application/json',  
        }
    });
};

export const uploadFile = async (fileData, token) => {
    return await axios.post(`${API_URL}/files/upload`, fileData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    });
};

export const getFiles = async (token) => {
    return await axios.get(`${API_URL}/files`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
};
