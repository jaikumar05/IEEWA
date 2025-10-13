"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Download, Upload, Search, Mail, Phone, Building, MapPin, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

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

const initialData: Candidate[] = [
  {
    id: "1",
    name: "John Doe",
    designation: "Software Engineer",
    emailId: "john@example.com",
    mobileNo: "9876543210",
    city: "Mumbai",
    employer: "Tech Corp",
    srNo: "001",
    secNo: "A1",
    initialName: "JD",
    fatherHusbandName: "Robert Doe",
    age: "30",
    address: "123 Main Street",
    persnaNo: "P001",
    pfNo: "PF001",
    ppoNo: "PPO001",
    dor: "2025-12-31",
    pfTrustName: "PF Trust",
    epfoTrustName: "EPFO Trust",
    dob: "1995-01-01",
    ncr: "NCR001",
  },
];

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState<Candidate>({
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
  });

  useEffect(() => {
    setTimeout(() => {
      const stored = localStorage.getItem("candidview_candidates");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCandidates(parsed);
          setFilteredCandidates(parsed);
        } catch {
          setCandidates(initialData);
          setFilteredCandidates(initialData);
          localStorage.setItem("candidview_candidates", JSON.stringify(initialData));
        }
      } else {
        setCandidates(initialData);
        setFilteredCandidates(initialData);
        localStorage.setItem("candidview_candidates", JSON.stringify(initialData));
      }
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchQuery.trim()) {
        setFilteredCandidates(candidates);
        return;
      }
      
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = candidates.filter(c => 
        (c.name?.toLowerCase() || "").includes(lowerQuery) ||
        (c.initialName?.toLowerCase() || "").includes(lowerQuery) ||
        (c.emailId?.toLowerCase() || "").includes(lowerQuery) ||
        (c.designation?.toLowerCase() || "").includes(lowerQuery) ||
        (c.city?.toLowerCase() || "").includes(lowerQuery) ||
        (c.employer?.toLowerCase() || "").includes(lowerQuery)
      );
      setFilteredCandidates(filtered);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, candidates]);

  const saveToStorage = (data: Candidate[]) => {
    localStorage.setItem("candidview_candidates", JSON.stringify(data));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Name is required!");
      return;
    }

    const existing = candidates.find(c => c.id === formData.id);
    const updated = existing
      ? candidates.map(c => c.id === formData.id ? formData : c)
      : [...candidates, { ...formData, id: Date.now().toString() }];
    
    setCandidates(updated);
    setFilteredCandidates(updated);
    saveToStorage(updated);
    setDialogOpen(false);
    setSelectedCandidate(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      const updated = candidates.filter(c => c.id !== id);
      setCandidates(updated);
      setFilteredCandidates(updated);
      saveToStorage(updated);
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm("⚠️ Are you sure you want to delete ALL candidates? This action cannot be undone!")) {
      if (window.confirm("⚠️ Final confirmation: Delete ALL " + candidates.length + " candidates?")) {
        setCandidates([]);
        setFilteredCandidates([]);
        localStorage.removeItem("candidview_candidates");
        alert("All candidates have been deleted.");
      }
    }
  };

  const handleDownload = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(candidates);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `candidates_export_${new Date().getTime()}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again or use a browser like Chrome.");
    }
  };

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
        const json = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "" });

        const imported = json.map((row: any) => {
          const cleanRow: any = {};
          Object.keys(row).forEach(key => {
            cleanRow[key.trim()] = row[key];
          });

          if (!cleanRow.Name && !cleanRow.name) return null;

          return {
            id: Date.now().toString() + Math.random(),
            name: cleanRow.Name || cleanRow.name || "",
            designation: cleanRow.Designation || cleanRow.designation || "",
            emailId: cleanRow.Email || cleanRow.emailId || "",
            mobileNo: cleanRow.Mobile || cleanRow.mobileNo || "",
            city: cleanRow.City || cleanRow.city || "",
            employer: cleanRow.Employer || cleanRow.employer || "",
            srNo: cleanRow["Sr No"] || cleanRow.srNo || "",
            secNo: cleanRow["Sec No"] || cleanRow.secNo || "",
            initialName: cleanRow["Initial Name"] || cleanRow.initialName || "",
            fatherHusbandName: cleanRow["Father/Husband Name"] || cleanRow.fatherHusbandName || "",
            age: cleanRow.Age || cleanRow.age || "",
            address: cleanRow.Address || cleanRow.address || "",
            persnaNo: cleanRow["Persna No"] || cleanRow.persnaNo || "",
            pfNo: cleanRow["PF No"] || cleanRow.pfNo || "",
            ppoNo: cleanRow["PPO No"] || cleanRow.ppoNo || "",
            dor: cleanRow["Date of Retirement"] || cleanRow.dor || "",
            pfTrustName: cleanRow["PF Trust Name"] || cleanRow.pfTrustName || "",
            epfoTrustName: cleanRow["EPFO Trust Name"] || cleanRow.epfoTrustName || "",
            dob: cleanRow["Date of Birth"] || cleanRow.dob || "",
            ncr: cleanRow.NCR || cleanRow.ncr || "",
          };
        }).filter((c: any): c is Candidate => c !== null);

        const updated = [...candidates, ...imported];
        setCandidates(updated);
        setFilteredCandidates(updated);
        saveToStorage(updated);
        alert(`Successfully imported ${imported.length} candidates!`);
      } catch (error) {
        alert("Error importing file. Please check the file format.");
        console.error(error);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const openDialog = (candidate?: Candidate) => {
    if (candidate) {
      setFormData(candidate);
      setSelectedCandidate(candidate);
    } else {
      setFormData({
        id: Date.now().toString(),
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
      });
      setSelectedCandidate(null);
    }
    setDialogOpen(true);
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
            
            <Button 
              onClick={() => openDialog()} 
              className="bg-teal-500 hover:bg-teal-600"
            >
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
              <input 
                type="file" 
                accept=".xlsx,.xls,.csv" 
                onChange={handleUpload} 
                className="hidden" 
              />
            </label>
            
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>

            <Button 
              variant="destructive" 
              onClick={handleDeleteAll}
              disabled={candidates.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map(candidate => (
            <div
              key={candidate.id}
              className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/candidate/${candidate.id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold">{candidate.name}</h3>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => openDialog(candidate)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(candidate.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {candidate.designation && (
                <p className="text-sm font-medium text-teal-600 mb-2">{candidate.designation}</p>
              )}
              
              {candidate.emailId && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Mail className="h-3 w-3" />
                  <span>{candidate.emailId}</span>
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
                  <span>{candidate.employer}</span>
                </div>
              )}
              
              {candidate.city && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{candidate.city}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No candidates found.
          </div>
        )}
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
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Designation</label>
                  <Input
                    value={formData.designation}
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.emailId}
                    onChange={(e) => setFormData({...formData, emailId: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Mobile</label>
                  <Input
                    value={formData.mobileNo}
                    onChange={(e) => setFormData({...formData, mobileNo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Employer</label>
                  <Input
                    value={formData.employer}
                    onChange={(e) => setFormData({...formData, employer: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Sr No</label>
                  <Input
                    value={formData.srNo}
                    onChange={(e) => setFormData({...formData, srNo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Sec No</label>
                  <Input
                    value={formData.secNo}
                    onChange={(e) => setFormData({...formData, secNo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Initial Name</label>
                  <Input
                    value={formData.initialName}
                    onChange={(e) => setFormData({...formData, initialName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Father/Husband Name</label>
                  <Input
                    value={formData.fatherHusbandName}
                    onChange={(e) => setFormData({...formData, fatherHusbandName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Age</label>
                  <Input
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Persna No</label>
                  <Input
                    value={formData.persnaNo}
                    onChange={(e) => setFormData({...formData, persnaNo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">PF No</label>
                  <Input
                    value={formData.pfNo}
                    onChange={(e) => setFormData({...formData, pfNo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">PPO No</label>
                  <Input
                    value={formData.ppoNo}
                    onChange={(e) => setFormData({...formData, ppoNo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Date of Retirement</label>
                  <Input
                    type="date"
                    value={formData.dor}
                    onChange={(e) => setFormData({...formData, dor: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">PF Trust Name</label>
                  <Input
                    value={formData.pfTrustName}
                    onChange={(e) => setFormData({...formData, pfTrustName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">EPFO Trust Name</label>
                  <Input
                    value={formData.epfoTrustName}
                    onChange={(e) => setFormData({...formData, epfoTrustName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Date of Birth</label>
                  <Input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">NCR</label>
                  <Input
                    value={formData.ncr}
                    onChange={(e) => setFormData({...formData, ncr: e.target.value})}
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