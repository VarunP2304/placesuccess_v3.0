import express from 'express';
import { db } from '../config/database.js'; // We need the database to check for students

const router = express.Router();

// This should handle requests to POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log(`Login attempt received for username: ${username}`);

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        // System Admin
        if (username === 'SA001' && password === 'password123') {
            return res.status(200).json({
                message: "Login successful!",
                user: { username: 'SA001', name: 'System Admin', role: 'admin' }
            });
        }

        // Placement Department
        if (username === 'FA001' && password === 'password123') {
            return res.status(200).json({
                message: "Login successful!",
                user: { username: 'FA001', name: 'Placement Department', role: 'placement_dept' }
            });
        }

        // Employer (simple demo creds)
        if (username === 'EMP001' && password === 'password123') {
            return res.status(200).json({
                message: "Login successful!",
                user: { username: 'EMP001', name: 'Acme HR', role: 'employer' }
            });
        }

        // Student Login (username and password are the same USN)
        if (username === password) {
            const [rows] = await db.query('SELECT name, usn FROM students WHERE usn = ?', [username]);
            if (rows.length > 0) {
                return res.status(200).json({
                    message: "Login successful!",
                    user: { usn: rows[0].usn, name: rows[0].name, role: 'student' }
                });
            }
        }

        // If no match, return invalid credentials
        return res.status(401).json({ message: "Invalid credentials." });

    } catch (error) {
        console.error("Error during login authentication:", error);
        return res.status(500).json({ message: "An internal server error occurred." });
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    // In a real app, you might invalidate tokens, clear sessions, etc.
    res.status(200).json({ message: 'Logout successful' });
});

export default router;
