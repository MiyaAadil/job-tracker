export interface Application {
  id: string;
  user_id: string;
  company: string;
  role: string;
  status: "applied" | "interview" | "offer" | "rejected";
  date_applied: string;
  job_description?: string;
  notes?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  skills: string | null;
  experience: string | null;
  updated_at: string;
}

export type NewApplication = Pick <
  Application,
  "company" | "role" | "status" | "job_description" | "notes"
>;