"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

type Candidate = {
  id: string;
  name: string;
  designation: string;
  emailId: string;
  mobileNo: string;
  employer: string;
  city: string;
  srNo: string;
  secNo: string;
  initialName: string;
  fatherHusbandName: string;
  age: string;
  address: string;
  persnaNo: string;
  pfNo: string;
  ppoNo: string;
  dor: string;
  pfTrustName: string;
  epfoTrustName: string;
  dob: string;
  ncr: string;
};

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("candidview_candidates");
    if (stored) {
      try {
        const candidates: Candidate[] = JSON.parse(stored);
        const found = candidates.find(c => c.id === params.id);
        setCandidate(found || null);
      } catch {
        setCandidate(null);
      }
    }
  }, [params.id]);

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Candidate Not Found</h1>
          <Button onClick={() => router.push("/")} className="bg-teal-500 hover:bg-teal-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/")} 
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-teal-500">{candidate.name}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Complete Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Sr No" value={candidate.srNo} />
            <DetailItem label="Sec No" value={candidate.secNo} />
            <DetailItem label="Initial Name" value={candidate.initialName} />
            <DetailItem label="Name" value={candidate.name} />
            <DetailItem label="Father/Husband Name" value={candidate.fatherHusbandName} />
            <DetailItem label="Age" value={candidate.age} />
            <DetailItem label="Date of Birth" value={candidate.dob} />
            <DetailItem label="Address" value={candidate.address} />
            <DetailItem label="City" value={candidate.city} />
            <DetailItem label="Mobile No" value={candidate.mobileNo} />
            <DetailItem label="Email" value={candidate.emailId} />
            <DetailItem label="Employer" value={candidate.employer} />
            <DetailItem label="Designation" value={candidate.designation} />
            <DetailItem label="Personal No" value={candidate.persnaNo} />
            <DetailItem label="PF No" value={candidate.pfNo} />
            <DetailItem label="PPO No" value={candidate.ppoNo} />
            <DetailItem label="Date of Retirement" value={candidate.dor} />
            <DetailItem label="PF Trust Name" value={candidate.pfTrustName} />
            <DetailItem label="EPFO Trust Name" value={candidate.epfoTrustName} />
            <DetailItem label="NCR" value={candidate.ncr} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-semibold mt-1">{value || "—"}</p>
    </div>
  );
}