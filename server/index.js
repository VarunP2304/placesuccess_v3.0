import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import all route files
import authRoutes from './routes/auth.js'; // 
import studentRoutes from './routes/student.js';
import placementRoutes from './routes/placement.js';
import employerRoutes from './routes/employer.js';

const app = express();
const PORT = 5000; // Your desired port

// Middleware
app.use(cors());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes); // 👈 ENSURE THIS LINE IS PRESENT
app.use('/api/student', studentRoutes);
app.use('/api/placement', placementRoutes);
app.use('/api/employer', employerRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
