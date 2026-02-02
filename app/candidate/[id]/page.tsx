"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import type { Candidate } from "@/app/page";

const STORAGE_KEY = "candidview_candidates";

function formatReadableDate(value: string): string {
  if (!value) return "";
  // If already looks readable, return as is
  if (/[a-zA-Z]/.test(value)) return value;

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function CandidateDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [candidate, setCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const all = JSON.parse(stored) as Candidate[];
      const found = all.find((c) => c.id === id) || null;
      setCandidate(found);
    } catch {
      setCandidate(null);
    }
  }, [id]);

  const orderedFields = useMemo((): { key: keyof Candidate; label: string; isDate?: boolean }[] => {
    return [
      { key: "srNo", label: "Sr No" },
      { key: "secNo", label: "Sec No" },
      { key: "initialName", label: "Initial Name" },
      { key: "name", label: "Name" },
      { key: "fatherHusbandName", label: "Father / Husband Name" },
      { key: "age", label: "Age" },
      { key: "address", label: "Address" },
      { key: "city", label: "City" },
      { key: "employer", label: "Employer" },
      { key: "designation", label: "Designation" },
      { key: "persnaNo", label: "Persna No" },
      { key: "pfNo", label: "PF No" },
      { key: "ppoNo", label: "PPO No" },
      { key: "dor", label: "D O R", isDate: true },
      { key: "pfTrustName", label: "PF Trust Name" },
      { key: "epfoTrustName", label: "EPFO Trust Name" },
      { key: "mobileNo", label: "Mob. No" },
      { key: "emailId", label: "Mail ID" },
      { key: "dob", label: "DOB", isDate: true },
      { key: "ncr", label: "NCR" },
      { key: "itgiIdNo", label: "ITGI ID No" },
    ];
  }, []);

  const handleDelete = () => {
    if (!candidate) return;
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const all = JSON.parse(stored) as Candidate[];
      const updated = all.filter((c) => c.id !== candidate.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      router.push("/");
    } catch {
      // ignore
    }
  };

  const handleEdit = () => {
    // Edit happens on Home page dialog, so navigate back.
    router.push("/");
  };

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Candidate Details</h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-10 text-gray-600">Candidate not found.</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Candidate Details</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {orderedFields.map(({ key, label, isDate }) => {
              const raw = candidate[key] ?? "";
              const value = isDate ? formatReadableDate(String(raw || "")) : String(raw || "");
              if (!value.trim()) return null;

              return (
                <div key={String(key)}>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-lg font-semibold text-gray-900 break-words">{value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
