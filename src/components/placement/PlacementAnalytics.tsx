import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Label } from 'recharts';
import { getBranchSummary, getCgpaCorrelation } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        if (payload[0].name === 'Students Placed') {
            const avgPackage = parseFloat(payload[0].payload.avgPackage) || 0;
            return (
                <div className="bg-background border p-2 rounded-md">
                    <p className="font-bold">{`${label}`}</p>
                    <p className="text-primary">{`Placed: ${payload[0].value}`}</p>
                    <p className="text-muted-foreground">{`Avg Package: ${avgPackage.toFixed(2)} LPA`}</p>
                </div>
            );
        }
        // Tooltip for Scatter plot
        return (
            <div className="bg-background border p-2 rounded-md">
                <p className="font-bold">{`CGPA: ${payload[0].value}`}</p>
                <p className="text-primary">{`Package: ${payload[1].value} LPA`}</p>
            </div>
        );
    }

    return null;
};


const PlacementAnalytics = () => {
    const [branchData, setBranchData] = useState([]);
    const [correlationData, setCorrelationData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [branchRes, correlationRes] = await Promise.all([
                    getBranchSummary(),
                    getCgpaCorrelation(),
                ]);
                setBranchData(branchRes);
                setCorrelationData(correlationRes);
            } catch (error) {
                console.error("Failed to fetch report data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <p>Loading analytics data...</p>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Branch-wise Placements</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={branchData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="branch" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="placed" fill="hsl(var(--primary))" name="Students Placed" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">CGPA vs. Package (LPA)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
                            <CartesianGrid />
                            <XAxis type="number" dataKey="cgpa" name="CGPA">
                                <Label value="CGPA" offset={-15} position="insideBottom" />
                            </XAxis>
                            <YAxis type="number" dataKey="package" name="Package" unit="L">
                                <Label value="Package (LPA)" angle={-90} position="insideLeft" />
                            </YAxis>
                            <ZAxis type="number" range={[60, 400]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                            <Legend />
                            <Scatter name="Students" data={correlationData} fill="hsl(var(--primary))" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default PlacementAnalytics;