import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define a type for the user object we expect after login
interface User {
    role: 'student' | 'admin' | 'placement_dept' | 'employer';
    name: string;
    usn?: string;
    username?: string;
}

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const selectedRole = params.get('role') as User['role'] | null;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const title = useMemo(() => {
        if (selectedRole === 'student') return 'Student Login';
        if (selectedRole === 'placement_dept') return 'Placement Department Login';
        if (selectedRole === 'admin') return 'System Admin Login';
        if (selectedRole === 'employer') return 'Employer Login';
        return 'PlaceSuccess ERP Login';
    }, [selectedRole]);

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            toast.error("Please enter both username and password.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await login({ username, password });
            toast.success(response.message);

            const user: User = response.user;

            // Persist minimal user context for role-aware UI
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userName', user.name || '');
            if (user.usn) localStorage.setItem('userUsn', user.usn);
            if (user.username) localStorage.setItem('username', user.username);

            if (user.role === 'student') {
                navigate('/student/profile');
            } else if (user.role === 'placement_dept' || user.role === 'admin') {
                navigate('/placement/dashboard');
            } else {
                navigate('/employer/jobs');
            }

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Login failed. An unknown error occurred.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50 dark:bg-gray-900" onKeyPress={handleKeyPress}>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-blue-600 dark:text-blue-400">{title}</CardTitle>
                    <CardDescription>
                        Enter your credentials to access your dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username / USN</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder={selectedRole === 'student' ? 'e.g., 4SF21CS001' : 'e.g., FA001 or SA001'}
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toUpperCase())}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleLogin}
                        disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;
