import { Candidate } from "@/types/candidate";

const STORAGE_KEY = "candidview_candidates";

// Sample starting data
const initialCandidates: Candidate[] = [
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

// Load candidates from browser storage
export const loadCandidates = (): Candidate[] => {
  if (typeof window === "undefined") return initialCandidates;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      saveCandidates(initialCandidates);
      return initialCandidates;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading candidates:", error);
    return initialCandidates;
  }
};

// Save candidates to browser storage
export const saveCandidates = (candidates: Candidate[]): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  } catch (error) {
    console.error("Error saving candidates:", error);
  }
};