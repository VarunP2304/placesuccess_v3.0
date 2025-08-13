// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import IndexPage from './pages/Index';
import RoleSelection from './pages/RoleSelection';
import StudentProfile from './pages/student/StudentProfile';
import PlacementDashboard from './pages/placement/PlacementDashboard';
import PlacementReports from './pages/placement/PlacementReports';
import { Toaster } from './components/ui/sonner';
import EmployerJobs from './pages/employer/EmployerJobs';
import AvailableReports from './pages/placement/AvailableReports';

function App() {
    return (
        <Router>
            <Toaster richColors />
            <Routes>
                {/* Show role selection at root, login on /login */}
                <Route path="/" element={<RoleSelection />} />
                <Route path="/login" element={<IndexPage />} />
                <Route element={<Layout />}> 
                    <Route path="/student/profile" element={<StudentProfile />} />
                    <Route path="/placement/dashboard" element={<PlacementDashboard />} />
                    <Route path="/placement/reports" element={<PlacementReports />} />
                    <Route path="/placement/reports/available" element={<AvailableReports />} />
                    <Route path="/employer/jobs" element={<EmployerJobs />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
