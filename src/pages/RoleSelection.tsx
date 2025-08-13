import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Shield, UserCog } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      key: "student",
      title: "Student",
      description: "Access your profile and placement information.",
      icon: GraduationCap,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      key: "placement_dept",
      title: "Placement Department",
      description: "Manage placement drives and reports.",
      icon: Shield,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      key: "admin",
      title: "System Admin",
      description: "System-wide configuration and controls.",
      icon: UserCog,
      color: "bg-blue-600 hover:bg-blue-700",
    },
  ] as const;

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((r) => {
          const Icon = r.icon;
          return (
            <Card key={r.key} className="shadow-md">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    <Icon size={24} />
                  </span>
                  <CardTitle className="text-blue-700 dark:text-blue-300">{r.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{r.description}</p>
                <Button
                  className={`${r.color} text-white w-full`}
                  onClick={() => navigate(`/login?role=${r.key}`)}
                >
                  Continue as {r.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelection;

