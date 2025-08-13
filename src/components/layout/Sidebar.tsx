import { NavLink, useNavigate } from "react-router-dom";
import { Home, BarChart2, User, LogOut, Briefcase } from 'lucide-react';
import { logout } from '../../services/api';

const Sidebar = () => {
    const navigate = useNavigate();
    // Role from persisted auth context
    const userRole = (localStorage.getItem('userRole') || 'placement_dept') as 'student' | 'placement_dept' | 'admin' | 'employer';

    const handleLogout = async () => {
        try {
            // Call logout API
            await logout();
            
            // Clear any stored user data (tokens, session, etc.)
            localStorage.removeItem('userToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            localStorage.removeItem('userUsn');
            localStorage.removeItem('username');
            
            // Navigate back to role selection page
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
            // Still clear local data and redirect even if API fails
            localStorage.clear();
            navigate('/', { replace: true });
        }
    };

    const placementLinks = [
        { to: "/placement/dashboard", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
        { to: "/placement/reports", icon: <BarChart2 className="h-5 w-5" />, label: "Reports" },
        { to: "/placement/reports/available", icon: <BarChart2 className="h-5 w-5" />, label: "Available Reports" },
    ];

    const studentLinks = [
        { to: "/student/profile", icon: <User className="h-5 w-5" />, label: "My Profile" },
    ];

    const employerLinks = [
        { to: "/employer/jobs", icon: <Briefcase className="h-5 w-5" />, label: "Job Postings" },
    ];

    const adminLinks = placementLinks; // for now, same as placement

    const linkMap: Record<string, { to: string; icon: JSX.Element; label: string }[]> = {
        student: studentLinks,
        employer: employerLinks,
        placement_dept: placementLinks,
        admin: adminLinks,
    };

    const navLinks = linkMap[userRole] || placementLinks;

    return (
        <aside className="w-64 bg-white border-r flex flex-col">
            <div className="h-16 flex items-center justify-center border-b">
                <h1 className="text-xl font-bold text-primary">PlaceSuccess</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t">
                <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-2 rounded-lg w-full text-left text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
