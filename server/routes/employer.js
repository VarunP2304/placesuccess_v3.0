import express from 'express';
import { db } from '../config/database.js';

const router = express.Router();

// List jobs
router.get('/jobs', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM jobs ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    console.error('List jobs error', e);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// Create job
router.post('/jobs', async (req, res) => {
  try {
    const { title, location, type, category, description, positions, package_range, deadline } = req.body;
    await db.query(
      'INSERT INTO jobs (title, location, type, category, description, positions, package_range, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, location, type, category, description, positions || 1, package_range, deadline]
    );
    res.status(201).json({ message: 'Job created' });
  } catch (e) {
    console.error('Create job error', e);
    res.status(500).json({ message: 'Failed to create job' });
  }
});

// Update job
router.put('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = ['title','location','type','category','status','description','positions','package_range','deadline','applicants','shortlisted'];
    const updates = [];
    const values = [];
    for (const f of fields) {
      if (req.body[f] !== undefined) { updates.push(`${f} = ?`); values.push(req.body[f]); }
    }
    if (!updates.length) return res.status(400).json({ message: 'No fields to update' });
    values.push(id);
    await db.query(`UPDATE jobs SET ${updates.join(', ')} WHERE id = ?`, values);
    res.json({ message: 'Job updated' });
  } catch (e) {
    console.error('Update job error', e);
    res.status(500).json({ message: 'Failed to update job' });
  }
});

// Close job
router.post('/jobs/:id/close', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE jobs SET status = "Closed" WHERE id = ?', [id]);
    res.json({ message: 'Job closed' });
  } catch (e) {
    console.error('Close job error', e);
    res.status(500).json({ message: 'Failed to close job' });
  }
});

export default router;

