import { useState } from "react";
import { supabase } from "./lib/supabase";
import type { NewApplication } from "./types";
import toast from "react-hot-toast";

interface ApplicationFormProps {
  onAdded: () => void;
}

const ApplicationForm = ({ onAdded }: ApplicationFormProps) => {
  const [company, setCompany] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [status, setStatus] = useState<NewApplication["status"]>("applied");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("applications").insert({
      user_id: user.id,
      company,
      role,
      status,
      job_description: jobDescription,
      notes,
    });

    setSaving(false);

    if (!error) {
      setCompany("");
      setRole("");
      setStatus("applied");
      setJobDescription("");
      setNotes("");
      toast.success("Application added");
      onAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border p-4 rounded-xl mb-6">
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company"
        required
        className="border p-2 rounded"
      />
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
        required
        className="border p-2 rounded"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as NewApplication["status"])}
        className="border p-2 rounded"
      >
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="rejected">Rejected</option>
      </select>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Job description (optional, needed for AI tailoring later)"
        className="border p-2 rounded"
        rows={3}
      />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="border p-2 rounded"
        rows={2}
      />
      <button
        type="submit"
        disabled={saving}
        className="bg-red-700 text-white p-2 rounded disabled:opacity-50 cursor-pointer transition-all duration-300 hover:bg-red-600 active:scale-98"
      >
        {saving ? "Saving..." : "Add Application"}
      </button>
    </form>
  );
};

export default ApplicationForm;