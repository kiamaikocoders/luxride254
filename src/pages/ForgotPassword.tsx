import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from '@/lib/supabaseClient';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setMessage("Password reset link sent! Check your email.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/assets/luxury-car-bg.jpg)', filter: 'brightness(0.5)' }} />
      <div className="absolute inset-0 bg-black opacity-60" />
      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-auto rounded-2xl bg-black/80 shadow-xl p-8 flex flex-col items-center">
        {/* Logo */}
        <img src="/lovable-uploads/17e72a8b-49e0-4058-be7d-041219b45d45.png" alt="LuxeRide" className="h-12 w-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-6">Forgot Password?</h2>
        <form className="w-full" onSubmit={handleReset}>
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
          {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
          {message && <div className="text-green-500 mb-4 text-center">{message}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded bg-luxe-gold-accent text-black font-bold text-lg hover:bg-luxe-gold-accent/90 transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <div className="w-full flex justify-end mt-4">
          <Link to="/login" className="text-luxe-gold-accent text-sm hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 