// src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Or your backend port

const api = axios.create({
    baseURL: API_URL,
});

// --- Auth Endpoints ---
export const login = async (credentials: { username: string, password: string }) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        console.error("Login error details:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
};


// --- Student Endpoints ---
export const getStudentProfile = async (usn: string) => {
    const response = await api.get(`/student/profile/${usn}`);
    return response.data;
};

export const updateStudentProfile = async (usn: string, data: FormData) => {
    const response = await api.put(`/student/profile/${usn}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// --- Placement Report Endpoints ---
export const getBranchSummary = async () => {
    const response = await api.get('/placement/reports/branch-summary');
    return response.data;
}

export const getCgpaCorrelation = async () => {
    const response = await api.get('/placement/reports/cgpa-correlation');
    return response.data;
}