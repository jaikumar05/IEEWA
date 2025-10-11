export interface Candidate {
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
  [key: string]: string | undefined;
}