import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

type Profile = {
  full_name?: string;
  role?: string;
};

const UserMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    if (user) {
      supabase.from("users").select("role, full_name").eq("id", user.id).single().then(({ data }) => setProfile(data));
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyMsg(null);
    const { error } = await supabase.auth.resend({ type: "signup", email: user.email });
    if (error) setVerifyMsg(error.message);
    else setVerifyMsg("Verification email sent!");
    setVerifying(false);
  };

  if (!user) return null;

  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 px-3 py-2 rounded-full bg-luxe-dark-outline text-luxe-gold-accent hover:bg-luxe-gold-accent/20">
        <span className="inline-block w-8 h-8 rounded-full bg-luxe-gold-accent text-black flex items-center justify-center font-bold">
          {profile?.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
        </span>
        <svg className="w-4 h-4 ml-1 text-luxe-gold-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black/90 ring-1 ring-black ring-opacity-5 z-50">
          <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); navigate("/bookings"); }}>My Bookings</button>
          <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); navigate("/profile"); }}>Profile Settings</button>
          <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-red-500" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 