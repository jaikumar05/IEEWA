"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const formatDate = (dateString: string) => {
  if (!dateString) return "—";
  
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  } catch {
    return dateString;
  }
};

function DetailItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-medium">{value || "—"}</p>
    </div>
  );
}

export default function CandidateDetail() {
  const router = useRouter();
  const params = useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const stored = localStorage.getItem("candidview_candidates");
    
    if (stored) {
      try {
        const candidates = JSON.parse(stored);
        const found = candidates.find((c: Candidate) => c.id === id);
        setCandidate(found || null);
      } catch (error) {
        console.error("Error loading candidate:", error);
      }
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">Candidate not found</p>
        <Button onClick={() => router.push("/")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button onClick={() => router.push("/")} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-teal-500">{candidate.srNo}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem label="Initial Name" value={candidate.initialName} />
              <DetailItem label="Name" value={candidate.name} />
              <DetailItem label="Father/Husband Name" value={candidate.fatherHusbandName} />
              <DetailItem label="Age" value={candidate.age} />
              <DetailItem label="Date of Birth" value={formatDate(candidate.dob)} />
              <DetailItem label="Address" value={candidate.address} />
              <DetailItem label="City" value={candidate.city} />
              <DetailItem label="Mobile No" value={candidate.mobileNo} />
              <DetailItem label="Email" value={candidate.emailId} />
              <DetailItem label="Employer" value={candidate.employer} />
              <DetailItem label="Designation" value={candidate.designation} />
              <DetailItem label="Sr No" value={candidate.srNo} />
              <DetailItem label="Sec No" value={candidate.secNo} />
              <DetailItem label="Persna No" value={candidate.persnaNo} />
              <DetailItem label="PF No" value={candidate.pfNo} />
              <DetailItem label="PPO No" value={candidate.ppoNo} />
              <DetailItem label="Date of Retirement" value={formatDate(candidate.dor)} />
              <DetailItem label="PF Trust Name" value={candidate.pfTrustName} />
              <DetailItem label="EPFO Trust Name" value={candidate.epfoTrustName} />
              <DetailItem label="NCR" value={candidate.ncr} />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}