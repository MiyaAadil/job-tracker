import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import Auth from "./Auth";
import ApplicationForm from "./ApplicationForm";
import ApplicationList from "./ApplicationList";
import { Plus, List, LogOut } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [view, setView] = useState<"form" | "list">("list");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  if (!session) return <Auth />;

  const displayName = session.user.user_metadata.full_name || session.user.email;

  return (
    <div className="p-8 lg:max-w-7xl lg:mx-auto">
      <Toaster position="bottom-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Job Applications</h1>
        <button
          onClick={() => {supabase.auth.signOut()
            toast.success("Signed out")
          }}
          className="text-xs bg-gray-50 shadow-md shadow-red-300 px-3 py-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-red-400 active:scale-96 font-bold flex gap-1"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
      <p>Welcome, <span className="font-medium italic">{displayName}</span></p>
      

      <div className="flex gap-2 mb-6 border-b">
  <button
    onClick={() => setView("list")}
    className={`flex items-center gap-2 px-4 py-2 ${
      view === "list" ? "border-b-2 border-red-700 font-bold" : "text-gray-500 cursor-pointer"
    }`}
  >
    <List size={18} /> My Applications
  </button>
  <button
    onClick={() => setView("form")}
    className={`flex items-center gap-2 px-4 py-2 ${
      view === "form" ? "border-b-2 border-red-700 font-bold" : "text-gray-500 cursor-pointer"
    }`}
  >
    <Plus size={18} /> Add New
  </button>
</div>

{view === "form" && (
  <ApplicationForm
    onAdded={() => {
      setRefreshKey((k) => k + 1);
      setView("list");
    }}
  />
)}
{view === "list" && <ApplicationList refreshKey={refreshKey} />}
    </div>
  );
};

export default App;