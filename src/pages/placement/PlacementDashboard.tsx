import StatCard from "@/components/dashboard/StatCard";
import PlacementAnalytics from "@/components/placement/PlacementAnalytics";
import { Users, Briefcase, Target, BarChart } from "lucide-react";

const PlacementDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Students"
                    value="545"
                    icon={<Users className="h-4 w-4" />}
                    description="+20.1% from last year"
                />
                <StatCard
                    title="Students Placed"
                    value="486"
                    icon={<Briefcase className="h-4 w-4" />}
                    description="89.17% placement rate"
                />
                <StatCard
                    title="Highest Package"
                    value="43.98 LPA"
                    icon={<Target className="h-4 w-4" />}
                    description="Offered by Belc"
                />
                <StatCard
                    title="Average Package"
                    value="~8.5 LPA"
                    icon={<BarChart className="h-4 w-4" />}
                    description="Calculated from placed students"
                />
            </div>
            <div>
                <PlacementAnalytics />
            </div>
        </div>
    );
};

export default PlacementDashboard;