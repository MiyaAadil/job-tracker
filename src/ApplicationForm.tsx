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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-2 rounded-xl mb-6 lg:max-w-3xl lg:mx-auto">
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company"
        required
        className="border border-gray-300 p-2 rounded-2xl"
      />
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
        required
        className="border border-gray-300 p-2 rounded-2xl"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as NewApplication["status"])}
        className="border border-gray-300 p-2 rounded-2xl"
      >
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="rejected">Rejected</option>
      </select>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Job description (optional)"
        className="border border-gray-300 p-2 rounded-2xl"
        rows={3}
      />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="border border-gray-300 p-2 rounded-2xl"
        rows={2}
      />
      <button
        type="submit"
        disabled={saving}
        className="bg-[#6d8cbe] text-white p-2 rounded-3xl disabled:opacity-50 cursor-pointer transition-all duration-300 hover:bg-[#88a2bd] active:scale-98 shadow-md font-semibold"
      >
        {saving ? "Saving..." : "Add Application"}
      </button>
    </form>
  );
};

export default ApplicationForm;