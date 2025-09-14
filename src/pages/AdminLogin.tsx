import React, { useState } from "react";
import { supabase } from '@/lib/supabaseClient';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("No user found.");
      // Fetch user role
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();
      if (profileError) throw new Error("Failed to fetch user role.");
      if (profile?.role !== "admin") throw new Error("Access denied. Not an admin account.");
      window.location.href = "/admin-dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md mx-auto rounded-2xl bg-black/80 shadow-xl p-8 flex flex-col items-center">
        <img src="/lovable-uploads/17e72a8b-49e0-4058-be7d-041219b45d45.png" alt="LuxeRide" className="h-12 w-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
        <form className="w-full" onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              className="w-full p-3 rounded bg-black/60 border border-luxe-gold-accent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-gold-accent"
              placeholder="Admin Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="w-full p-3 rounded bg-black/60 border border-luxe-gold-accent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-gold-accent"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded bg-luxe-gold-accent text-black font-bold text-lg hover:bg-luxe-gold-accent/90 transition"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
