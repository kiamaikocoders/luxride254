import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from '@/lib/supabaseClient';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Fetch user role from profile table (assume 'role' column exists)
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user?.id)
      .single();
    if (profileError) {
      setError("Failed to fetch user role.");
      setLoading(false);
      return;
    }
    // Redirect based on role
    if (profile?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-black">
      {/* Background image with overlay */}
      <img src="/lovable-uploads/17e72a8b-49e0-4058-be7d-041219b45d45.png" alt="LuxeRide Car" className="absolute inset-0 w-full h-full object-cover z-0" style={{ filter: 'brightness(0.5)' }} />
      <div className="absolute inset-0 bg-black opacity-60 z-10" />
      {/* Card */}
      <div className="relative z-20 w-full max-w-md mx-auto rounded-2xl bg-black/80 shadow-xl p-8 flex flex-col items-center">
        {/* Logo */}
        <img src="/lovable-uploads/17e72a8b-49e0-4058-be7d-041219b45d45.png" alt="LuxeRide" className="h-12 w-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
        <form className="w-full" onSubmit={handleSignIn}>
          <div className="mb-4">
            <input
              type="email"
              className="w-full p-3 rounded bg-black/60 border border-luxe-gold-accent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-gold-accent"
              placeholder="Username or Email"
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
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="w-full flex justify-between mt-4">
          <Link to="/forgot-password" className="text-luxe-gold-accent text-sm hover:underline">Forgot Password?</Link>
          <Link to="/signup" className="text-luxe-gold-accent text-sm hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 