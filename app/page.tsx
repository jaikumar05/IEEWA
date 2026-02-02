"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Plus,
  Download,
  Upload,
  Search,
  Mail,
  Phone,
  Building,
  MapPin,
  Edit,
  Trash2,
} from "lucide-react";

export type Candidate = {
  id: string;

  srNo: string;
  secNo: string;
  initialName: string;
  name: string;
  fatherHusbandName: string;
  age: string;
  address: string;
  city: string;
  employer: string;
  designation: string;
  persnaNo: string;
  pfNo: string;
  ppoNo: string;
  dor: string;
  pfTrustName: string;
  epfoTrustName: string;
  mobileNo: string;
  emailId: string;
  dob: string;
  ncr: string;

  itgiIdNo: string; // NEW
};

const STORAGE_KEY = "candidview_candidates";

const initialData: Candidate[] = [
  {
    id: "1",
    srNo: "1",
    secNo: "1",
    initialName: "V.H AMBWANI",
    name: "VISHAMBER",
    fatherHusbandName: "HOTCHAND AMBWANI",
    age: "65",
    address: "H.NO.TCX-N-37",
    city: "GANDHIDHAM",
    employer: "IFFCO KANDLA",
    designation: "SR.MANAGER",
    persnaNo: "102339",
    pfNo: "GJ/RAJ/0019856/000/0001110",
    ppoNo: "GJ/RAJ/00032538",
    dor: "",
    pfTrustName: "",
    epfoTrustName: "",
    mobileNo: "9428032704",
    emailId: "vhabwani@gmail.com",
    dob: "1953-03-15",
    ncr: "",
    itgiIdNo: "",
  },
];

const emptyCandidate = (): Candidate => ({
  id: "",
  srNo: "",
  secNo: "",
  initialName: "",
  name: "",
  fatherHusbandName: "",
  age: "",
  address: "",
  city: "",
  employer: "",
  designation: "",
  persnaNo: "",
  pfNo: "",
  ppoNo: "",
  dor: "",
  pfTrustName: "",
  epfoTrustName: "",
  mobileNo: "",
  emailId: "",
  dob: "",
  ncr: "",
  itgiIdNo: "",
});

function normalizeHeader(h: string) {
  return (h || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
}

function toExcelRow(c: Candidate) {
  // This object order defines the Excel column order. [web:50][web:53]
  return {
    "Sr No": c.srNo || "",
    "Sec No": c.secNo || "",
    "Initial Name": c.initialName || "",
    Name: c.name || "",
    "Father / Husband Name": c.fatherHusbandName || "",
    Age: c.age || "",
    Address: c.address || "",
    City: c.city || "",
    Employer: c.employer || "",
    Designation: c.designation || "",
    "Persna No": c.persnaNo || "",
    "PF No": c.pfNo || "",
    "PPO No": c.ppoNo || "",
    "D O R": c.dor || "",
    "PF Trust Name": c.pfTrustName || "",
    "EPFO Trust Name": c.epfoTrustName || "",
    "Mob. No": c.mobileNo || "",
    "Mail ID": c.emailId || "",
    DOB: c.dob || "",
    NCR: c.ncr || "",
    "ITGI ID No": c.itgiIdNo || "",
  };
}

function parseExcelDateLike(v: any): string {
  if (v == null) return "";
  const s = String(v).trim();
  if (!s) return "";
  // Keep as-is; your detail page formats display separately.
  return s;
}

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState<Candidate>(emptyCandidate());

  useEffect(() => {
    setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Candidate[];
          const normalized = parsed.map((c) => ({ ...emptyCandidate(), ...c }));
          setCandidates(normalized);
          setFilteredCandidates(normalized);
        } catch {
          setCandidates(initialData);
          setFilteredCandidates(initialData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        }
      } else {
        setCandidates(initialData);
        setFilteredCandidates(initialData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      }
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!searchQuery.trim()) {
        setFilteredCandidates(candidates);
        return;
      }
      const q = searchQuery.toLowerCase();
      const filtered = candidates.filter((c) => {
        return (
          (c.name || "").toLowerCase().includes(q) ||
          (c.initialName || "").toLowerCase().includes(q) ||
          (c.emailId || "").toLowerCase().includes(q) ||
          (c.designation || "").toLowerCase().includes(q) ||
          (c.city || "").toLowerCase().includes(q) ||
          (c.employer || "").toLowerCase().includes(q) ||
          (c.mobileNo || "").toLowerCase().includes(q) ||
          (c.persnaNo || "").toLowerCase().includes(q) ||
          (c.pfNo || "").toLowerCase().includes(q) ||
          (c.ppoNo || "").toLowerCase().includes(q) ||
          (c.itgiIdNo || "").toLowerCase().includes(q)
        );
      });
      setFilteredCandidates(filtered);
    }, 300);

    return () => clearTimeout(t);
  }, [searchQuery, candidates]);

  const saveToStorage = (data: Candidate[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const openDialog = (candidate?: Candidate) => {
    if (candidate) {
      setFormData({ ...emptyCandidate(), ...candidate });
      setSelectedCandidate(candidate);
    } else {
      setFormData({ ...emptyCandidate(), id: Date.now().toString() });
      setSelectedCandidate(null);
    }
    setDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Name is required!");
      return;
    }

    const existing = candidates.find((c) => c.id === formData.id);
    const updated = existing
      ? candidates.map((c) => (c.id === formData.id ? formData : c))
      : [...candidates, { ...formData, id: Date.now().toString() }];

    setCandidates(updated);
    setFilteredCandidates(updated);
    saveToStorage(updated);
    setDialogOpen(false);
    setSelectedCandidate(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      const updated = candidates.filter((c) => c.id !== id);
      setCandidates(updated);
      setFilteredCandidates(updated);
      saveToStorage(updated);
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm("⚠️ Are you sure you want to delete ALL candidates? This action cannot be undone!")) {
      if (window.confirm(`⚠️ Final confirmation: Delete ALL ${candidates.length} candidates?`)) {
        setCandidates([]);
        setFilteredCandidates([]);
        localStorage.removeItem(STORAGE_KEY);
        alert("All candidates have been deleted.");
      }
    }
  };

  const handleDownload = () => {
    try {
      const rows = candidates.map(toExcelRow);
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `candidates_export_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed. Please try in Chrome browser.");
    }
  };

  const headerKeyMap = useMemo(() => {
    // Accept common variations + your export labels
    return new Map<string, keyof Candidate>([
      ["sr no", "srNo"],
      ["srno", "srNo"],

      ["sec no", "secNo"],
      ["secno", "secNo"],

      ["initial name", "initialName"],
      ["initial", "initialName"],

      ["name", "name"],

      ["father / husband name", "fatherHusbandName"],
      ["father/husband name", "fatherHusbandName"],
      ["father husband name", "fatherHusbandName"],

      ["age", "age"],
      ["address", "address"],
      ["city", "city"],
      ["employer", "employer"],
      ["designation", "designation"],

      ["persna no", "persnaNo"],
      ["personal no", "persnaNo"],
      ["persna", "persnaNo"],

      ["pf no", "pfNo"],
      ["ppo no", "ppoNo"],

      ["d o r", "dor"],
      ["date of retirement", "dor"],
      ["dor", "dor"],

      ["pf trust name", "pfTrustName"],
      ["epfo trust name", "epfoTrustName"],

      ["mob no", "mobileNo"],
      ["mobile", "mobileNo"],
      ["mobile no", "mobileNo"],

      ["mail id", "emailId"],
      ["email", "emailId"],
      ["email id", "emailId"],

      ["dob", "dob"],
      ["date of birth", "dob"],

      ["ncr", "ncr"],

      ["itgi id no", "itgiIdNo"],
      ["itgi id", "itgiIdNo"],
    ]);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const json = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { raw: false, defval: "" });

        const imported: Candidate[] = json
          .map((row) => {
            const candidate: Candidate = { ...emptyCandidate() };

            Object.keys(row).forEach((k) => {
              const norm = normalizeHeader(k);
              const mappedKey = headerKeyMap.get(norm);
              if (!mappedKey) return;

              const value = row[k];
              if (mappedKey === "dob" || mappedKey === "dor") {
                (candidate as any)[mappedKey] = parseExcelDateLike(value);
              } else {
                (candidate as any)[mappedKey] = String(value ?? "");
              }
            });

            if (!candidate.name?.trim() && !candidate.initialName?.trim()) return null;

            candidate.id = Date.now().toString() + Math.random().toString(16).slice(2);
            return candidate;
          })
          .filter((c): c is Candidate => c !== null);

        const updated = [...candidates, ...imported];
        setCandidates(updated);
        setFilteredCandidates(updated);
        saveToStorage(updated);

        alert(`Successfully imported ${imported.length} candidates!`);
      } catch (err) {
        console.error(err);
        alert("Error importing file. Please check the file format.");
      }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-teal-500 mb-8">IEEWA</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-teal-500">IEEWA</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary">Total: {candidates.length}</Badge>

            <Button onClick={() => openDialog()} className="bg-teal-500 hover:bg-teal-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Candidate
            </Button>

            <label className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </span>
              </Button>
              <input type="file" accept=".xlsx,.xls,.csv" onChange={handleUpload} className="hidden" />
            </label>

            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>

            <Button variant="destructive" onClick={handleDeleteAll} disabled={candidates.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/candidate/${candidate.id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold">{candidate.name || candidate.initialName || "Unnamed"}</h3>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" onClick={() => openDialog(candidate)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(candidate.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {candidate.designation && <p className="text-sm font-medium text-teal-600 mb-2">{candidate.designation}</p>}

              {candidate.emailId && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{candidate.emailId}</span>
                </div>
              )}

              {candidate.mobileNo && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Phone className="h-3 w-3" />
                  <span>{candidate.mobileNo}</span>
                </div>
              )}

              {candidate.employer && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Building className="h-3 w-3" />
                  <span className="truncate">{candidate.employer}</span>
                </div>
              )}

              {candidate.city && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{candidate.city}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCandidates.length === 0 && <div className="text-center py-12 text-gray-500">No candidates found.</div>}
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedCandidate ? "Edit Candidate" : "Add New Candidate"}</DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[600px] pr-4">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Sr No</label>
                  <Input value={formData.srNo} onChange={(e) => setFormData({ ...formData, srNo: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium">Sec No</label>
                  <Input value={formData.secNo} onChange={(e) => setFormData({ ...formData, secNo: e.target.value })} />
                </div>

                <div>
                  <label className="text-sm font-medium">Initial Name</label>
                  <Input
                    value={formData.initialName}
                    onChange={(e) => setFormData({ ...formData, initialName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Name *</label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>

                <div>
                  <label className="text-sm font-medium">Father / Husband Name</label>
                  <Input
                    value={formData.fatherHusbandName}
                    onChange={(e) => setFormData({ ...formData, fatherHusbandName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Age</label>
                  <Input value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                </div>

                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>

                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                </div>

                <div>
                  <label className="text-sm font-medium">Employer</label>
                  <Input value={formData.employer} onChange={(e) => setFormData({ ...formData, employer: e.target.value })} />
                </div>

                <div>
                  <label className="text-sm font-medium">Designation</label>
                  <Input
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Persna No</label>
                  <Input value={formData.persnaNo} onChange={(e) => setFormData({ ...formData, persnaNo: e.target.value })} />
                </div>

                <div>
                  <label className="text-sm font-medium">PF No</label>
                  <Input value={formData.pfNo} onChange={(e) => setFormData({ ...formData, pfNo: e.target.value })} />
                </div>

                <div>
                  <label className="text-sm font-medium">PPO No</label>
                  <Input value={formData.ppoNo} onChange={(e) => setFormData({ ...formData, ppoNo: e.target.value })} />
                </div>

                <div>
                  <label className="text-sm font-medium">D O R</label>
                  <Input type="date" value={formData.dor} onChange={(e) => setFormData({ ...formData, dor: e.target.value })} />
                </div>

                <div>
                  <label className="text-sm font-medium">PF Trust Name</label>
                  <Input
                    value={formData.pfTrustName}
                    onChange={(e) => setFormData({ ...formData, pfTrustName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">EPFO Trust Name</label>
                  <Input
                    value={formData.epfoTrustName}
                    onChange={(e) => setFormData({ ...formData, epfoTrustName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Mob. No</label>
                  <Input
                    value={formData.mobileNo}
                    onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Mail ID</label>
                  <Input
                    type="email"
                    value={formData.emailId}
                    onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">DOB</label>
                  <Input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
                </div>

                <div>
                  <label className="text-sm font-medium">NCR</label>
                  <Input value={formData.ncr} onChange={(e) => setFormData({ ...formData, ncr: e.target.value })} />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-medium">ITGI ID No</label>
                  <Input
                    value={formData.itgiIdNo}
                    onChange={(e) => setFormData({ ...formData, itgiIdNo: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-white pb-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                  {selectedCandidate ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
