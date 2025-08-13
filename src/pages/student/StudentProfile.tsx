import StudentDataEntryForm from "@/components/student/StudentDataEntryForm";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const StudentProfile = () => {
    // A hardcoded USN for demonstration. In a real app, this would come from auth context.
    const userUsn = "1CR21CS100";

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>My Student Profile</CardTitle>
                    <CardDescription>
                        Update your profile with your latest academic and professional details.
                        Your USN is <strong>{userUsn}</strong>.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <StudentDataEntryForm usn={userUsn} />
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentProfile;