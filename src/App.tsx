import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import Auth from "./Auth";

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm underline"
        >
          Sign out
        </button>
      </div>
      <p>Logged in as {session.user.email}</p>
      {/* Application tracker UI goes here next */}
    </div>
  );
};

export default App;