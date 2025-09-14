import React, { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase.from("users").select("full_name, role, email").eq("id", data.user.id).single().then(({ data }) => {
          setProfile(data);
          setFullName(data?.full_name || "");
        });
      }
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!user) return;
    const { error: updateError } = await supabase.from("users").update({ full_name: fullName }).eq("id", user.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSuccess("Profile updated!");
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!password) return;
    const { error: pwError } = await supabase.auth.updateUser({ password });
    if (pwError) {
      setError(pwError.message);
      return;
    }
    setSuccess("Password updated!");
    setPassword("");
  };

  if (!user || !profile) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/assets/luxury-car-bg.jpg)', filter: 'brightness(0.5)' }} />
      <div className="absolute inset-0 bg-black opacity-60" />
      <div className="relative z-10 w-full max-w-md mx-auto rounded-2xl bg-black/80 shadow-xl p-8 flex flex-col items-center">
        <img src="/lovable-uploads/17e72a8b-49e0-4058-be7d-041219b45d45.png" alt="LuxeRide" className="h-12 w-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-6">Profile</h2>
        <form className="w-full mb-6" onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-luxe-gold-accent mb-1">Full Name</label>
            <input
              type="text"
              className="w-full p-3 rounded bg-black/60 border border-luxe-gold-accent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-gold-accent"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-luxe-gold-accent mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded bg-black/60 border border-luxe-gold-accent text-white placeholder-gray-400"
              value={profile.email}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-luxe-gold-accent mb-1">Role</label>
            <input
              type="text"
              className="w-full p-3 rounded bg-black/60 border border-luxe-gold-accent text-white placeholder-gray-400"
              value={profile.role}
              readOnly
            />
          </div>
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          {success && <div className="text-green-500 mb-4 text-center">{success}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded bg-luxe-gold-accent text-black font-bold text-lg hover:bg-luxe-gold-accent/90 transition"
          >
            Update Profile
          </button>
        </form>
        <form className="w-full" onSubmit={handlePassword}>
          <div className="mb-4">
            <label className="block text-luxe-gold-accent mb-1">Change Password</label>
            <input
              type="password"
              className="w-full p-3 rounded bg-black/60 border border-luxe-gold-accent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-gold-accent"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="New Password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded bg-luxe-gold-accent text-black font-bold text-lg hover:bg-luxe-gold-accent/90 transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;