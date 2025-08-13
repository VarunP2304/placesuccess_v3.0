import express from 'express';
import multer from 'multer';
import path from 'path';
import { db } from '../config/database.js';

const router = express.Router();

// --- Multer Setup for File Uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/uploads/');
  },
  filename: function (req, file, cb) {
    const usn = req.params.usn || 'student';
    const uniqueSuffix = Date.now();
    cb(null, `${usn}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// --- ROUTES ---

// GET student profile
router.get('/profile/:usn', async (req, res) => {
    try {
        const { usn } = req.params;
        const [rows] = await db.query('SELECT * FROM students WHERE usn = ?', [usn]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student profile:', error);
        res.status(500).json({ message: 'Database query failed' });
    }
});

// UPDATE student profile
router.put('/profile/:usn', upload.single('resume'), async (req, res) => {
    try {
        const { usn } = req.params;
        const {
            permanent_address,
            contact_no,
            tenth_marks,
            twelfth_marks,
            project_count
        } = req.body;

        // Construct the URL to the uploaded file if it exists
        const resume_url = req.file ? `/uploads/${req.file.filename}` : undefined;

        const fieldsToUpdate = {
            permanent_address,
            contact_no,
            tenth_marks: parseFloat(tenth_marks),
            twelfth_marks: parseFloat(twelfth_marks),
            project_count: parseInt(project_count, 10),
            resume_url
        };

        // Filter out undefined values so we only update provided fields
        const definedFields = Object.entries(fieldsToUpdate).filter(([_, v]) => v !== undefined && v !== null && !isNaN(v));
        
        if (definedFields.length === 0) {
            return res.status(400).json({ message: 'No valid fields provided for update.' });
        }
        
        const setClause = definedFields.map(([key]) => `${key} = ?`).join(', ');
        const values = definedFields.map(([_, val]) => val);
        values.push(usn);
        
        const sql = `UPDATE students SET ${setClause} WHERE usn = ?`;

        await db.query(sql, values);

        console.log('Updated Profile for', usn);
        res.status(200).json({ message: 'Profile updated successfully!' });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

export default router;