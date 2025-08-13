import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from 'react';
import { getJobs, closeJob } from '@/services/jobs';

const jobs = [
  {
    id: 1,
    title: "UX Designer",
    location: "Bangalore",
    type: "Full-time",
    category: "Design",
    status: "Active",
    description:
      "Join our design team to create exceptional user experiences for our products.",
    requirements: [
      "Bachelor's degree in Design or related field",
      "Portfolio demonstrating UX projects",
      "3+ years of experience",
      "Proficiency in design tools",
    ],
    selection: ["Portfolio Review", "Design Challenge", "Panel Interview"],
    details: { positions: 2, package: "16-20 LPA", deadline: "2025-06-01", applicants: 40, shortlisted: 8 },
  },
  {
    id: 2,
    title: "Product Manager",
    location: "Bangalore",
    type: "Full-time",
    category: "Product",
    status: "Active",
    description:
      "We're seeking Product Managers to drive the vision, strategy, and execution of our products.",
    requirements: [
      "MBA/MSC with technical background",
      "5+ years of relevant experience",
      "Excellent communication skills",
    ],
    selection: ["Resume Shortlist", "Case Study", "Panel Interview"],
    details: { positions: 3, package: "20-26 LPA", deadline: "2025-06-15", applicants: 55, shortlisted: 12 },
  },
];

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex items-center justify-between text-sm py-1">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const EmployerJobs = () =e {
  const [data, setData] = useState<any[]>(jobs);

useEffect(() =e {
    (async() =e {
  try {
    const remote = await getJobs();
    setData(remote);
  } catch(_) {
    setData(jobs);
  }
})();
  }, []);

const onClose = async (id: number) =e {
  try { await closeJob(id); } catch (_) { }
setData(prev =e prev.map(j =e j.id === id ? { ...j, status: 'Closed' } : j));
  };

return (
    cdiv className = "space-y-6"e
{
  data.map((job) =e(
    <Card key={job.id}>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <CardTitle>{job.title}</CardTitle>
            <Badge>{job.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {job.category} • {job.type} • {job.location}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit</Button>
          <Button>View Applicants</Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h4 className="font-semibold">Job Description</h4>
          <p className="text-sm text-muted-foreground">{job.description}</p>
          <h4 className="font-semibold mt-4">Requirements</h4>
          <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
            {job.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <h4 className="font-semibold mt-4">Selection Process</h4>
          <div className="flex flex-wrap gap-2">
            {job.selection.map((s, i) => (
              <span key={s} className="px-3 py-1 rounded-full border bg-white text-sm">
                {i + 1}. {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <Card className="border bg-white">
            <CardContent className="p-4 space-y-2">
              <h4 className="font-semibold mb-2">Job Details</h4>
              <Stat label="Positions" value={job.details.positions} />
              <Stat label="Package" value={job.details.package} />
              <Stat label="Deadline" value={job.details.deadline} />
              <Stat label="Applicants" value={job.details.applicants} />
              <Stat label="Shortlisted" value={job.details.shortlisted} />
              cButton className="w-full mt-4" variant="outline" onClick={() =e onClose(job.id)}eClose Jobc/Buttone
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  ))
}
    </div >
  );
};

export default EmployerJobs;

