import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import type { Profile } from "./types";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [fullName, setFullName] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data) {
        const profile = data as Profile;
        setFullName(profile.full_name || "");
        setSkills(profile.skills || "");
        setExperience(profile.experience || "");
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      skills,
      experience,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);

    if (!error) {
      toast.success("Profile saved");
    } else {
      toast.error("Failed to save profile");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-6xl mx-auto">
      <label className="text-sm font-medium">Full name</label>
      <input
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="border border-gray-300 p-2 rounded-2xl"
      />

      <label className="text-sm font-medium">Skills</label>
      <textarea
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="e.g. React, TypeScript, Tailwind, REST APIs"
        rows={3}
        className="border border-gray-300 p-2 rounded-2xl"
      />

      <label className="text-sm font-medium">Experience</label>
      <textarea
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        placeholder="Brief summary of your background, projects, and experience"
        rows={5}
        className="border border-gray-300 p-2 rounded-2xl"
      />

      <button
        type="submit"
        disabled={saving}
        className="bg-[#6d8cbe] text-white p-2 rounded-3xl disabled:opacity-50 hover:bg-[#88a2bd] transition-all duration-300 active:scale-95"
      >
        {saving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
};

export default ProfilePage;