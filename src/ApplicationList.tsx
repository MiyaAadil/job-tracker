import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import type { Application } from "./types";
import ApplicationCardSkeleton from "./ApplicationCardSkeleton";
import toast from "react-hot-toast";

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
        <div key={app.id} className="border rounded-xl p-4 flex justify-between items-start">
          <div>
            <h3 className="font-bold">{app.role} @ {app.company}</h3>
            <p className="text-sm text-gray-500">
              Applied {new Date(app.date_applied).toLocaleDateString()}
            </p>
            {app.notes && <p className="text-sm mt-1">{app.notes}</p>}
          </div>
          <div className="flex flex-col items-end gap-2">
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
              className="text-xs text-red-600 underline cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationList;