import PlacementAnalytics from "@/components/placement/PlacementAnalytics";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const PlacementReports = () => {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Placement Analytics</CardTitle>
                    <CardDescription>
                        Visualize placement data across departments and analyze trends from the database.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PlacementAnalytics />
                </CardContent>
            </Card>
        </div>
    );
};

export default PlacementReports;