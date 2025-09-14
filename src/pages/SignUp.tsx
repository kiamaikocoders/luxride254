import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from '@/lib/supabaseClient';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("Sign up failed. No user returned.");
      // Upsert user profile with selected role
      const { error: profileError } = await supabase.from("users").upsert({
        id: data.user.id,
        email,
        full_name: username,
        role,
      });
      if (profileError) throw new Error(profileError.message || "Failed to create user profile.");
      navigate("/profile");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-black">
      <img src="/lovable-uploads/17e72a8b-49e0-4058-be7d-041219b45d45.png" alt="LuxeRide Car" className="absolute inset-0 w-full h-full object-cover z-0" style={{ filter: 'brightness(0.5)' }} />
      <div className="absolute inset-0 bg-black opacity-60 z-10" />
      <div className="relative z-20 w-full max-w-md mx-auto rounded-2xl bg-black/80 shadow-xl p-8 flex flex-col items-center">
        <img src="/lovable-uploads/17e72a8b-49e0-4058-be7d-041219b45d45.png" alt="LuxeRide" className="h-12 w-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-6">Sign Up</h2>
        <form className="w-full" onSubmit={handleSignUp}>
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-3 rounded bg-black/60 border border-luxe-gold-accent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-gold-accent"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              className="w-full p-3 rounded bg-black/60 border border-luxe-gold-accent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-gold-accent"
              placeholder="Email"
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
          <div className="mb-4">
            <input
              type="password"
              className="w-full p-3 rounded bg-black/60 border border-luxe-gold-accent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-gold-accent"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-luxe-gold-accent mb-1">Role</label>
            <select
              className="w-full p-3 rounded bg-black/60 border border-luxe-gold-accent text-white focus:outline-none focus:ring-2 focus:ring-luxe-gold-accent"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            >
              <option value="user">Passenger</option>
              <option value="driver">Driver</option>
            </select>
          </div>
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded bg-luxe-gold-accent text-black font-bold text-lg hover:bg-luxe-gold-accent/90 transition"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="w-full flex flex-col gap-2 mt-4">
          <div className="flex justify-end">
            <Link to="/login" className="text-luxe-gold-accent text-sm hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;