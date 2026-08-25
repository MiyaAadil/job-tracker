import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import type { Application, Profile } from "./types";
import ApplicationCardSkeleton from "./ApplicationCardSkeleton";
import toast from "react-hot-toast";
import { Trash2 } from 'lucide-react';
import CoverLetterModal from "./CoverLetterModal";

const statusColors: Record<Application["status"], string> = {
  applied: "bg-gray-200 text-gray-700",
  interview: "bg-yellow-200 text-yellow-800",
  offer: "bg-green-200 text-green-800",
  rejected: "bg-red-200 text-red-800",
};

interface ApplicationListProps {
  refreshKey: number;
}

const ApplicationList = ({ refreshKey }: ApplicationListProps) => {

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [coverLetters, setCoverLetters] = useState<Record<string, string>>({});
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [viewingLetterId, setViewingLetterId] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setApplications(data as Application[]);
      }
      setLoading(false);
    };

    fetchApplications();
  }, [refreshKey]);

  const handleStatusChange = async (id: string, newStatus: Application["status"]) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    await supabase.from("applications").update({ status: newStatus }).eq("id", id);
  };

  const handleDelete = async (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (!error) toast.success("Application deleted");
  };

  const handleGenerate = async (app: Application) => {
    if (!app.job_description) return;

    setGeneratingId(app.id);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setGeneratingId(null);
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    const profile = profileData as Profile | null;

    const res = await fetch("/api/tailor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobDescription: app.job_description,
        skills: profile?.skills || "",
        experience: profile?.experience || "",
      }),
    });

    const data = await res.json();

    if ("coverLetter" in data) {
      setCoverLetters((prev) => ({ ...prev, [app.id]: data.coverLetter }));
    } else {
      toast.error("Failed to generate cover letter");
    }

    setGeneratingId(null);
  };

  if (loading) return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <ApplicationCardSkeleton key={i} />
      ))}
    </div>
  );

  if (applications.length === 0) {
    return <p className="text-gray-500">No applications yet. Click "Add New" for adding one.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {applications.map((app) => (
        <div key={app.id} className="border-b border-gray-300 p-2 flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold">{app.role} @ <span className="text-teal-500">{app.company}</span> </h3>
            <p className="text-sm text-gray-500">
              Applied {new Date(app.date_applied).toLocaleDateString()}
            </p>
            {app.notes && <p className="text-sm mt-1">{app.notes}</p>}

            {app.job_description && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleGenerate(app)}
                  disabled={generatingId === app.id}
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-2xl disabled:opacity-50 font-semibold cursor-pointer"
                >
                  {generatingId === app.id ? "Generating..." : "Generate Cover Letter"}
                </button>

                {coverLetters[app.id] && (
                  <button
                    onClick={() => setViewingLetterId(app.id)}
                    className="text-xs bg-teal-400 px-2 py-1 text-white font-semibold ml-2 rounded-2xl cursor-pointer"
                  >
                    View Cover Letter
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-4">
            <select
              value={app.status}
              onChange={(e) =>
                handleStatusChange(app.id, e.target.value as Application["status"])
              }
              className={`text-sm rounded px-2 py-1 cursor-pointer ${statusColors[app.status]}`}
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={() => handleDelete(app.id)}
              className="text-xs text-red-600 underline cursor-pointer bg-red-100 p-1 rounded-full active:scale-95"
            >
              <Trash2 size={22} />
            </button>
          </div>
        </div>
      ))}
      {viewingLetterId && coverLetters[viewingLetterId] && (
        <CoverLetterModal
          coverLetter={coverLetters[viewingLetterId]}
          onClose={() => setViewingLetterId(null)}
        />
      )}
    </div>
  );
};

export default ApplicationList;