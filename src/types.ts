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

export type NewApplication = Pick
  Application,
  "company" | "role" | "status" | "job_description" | "notes"
>;