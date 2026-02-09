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
  }, []);

  useEffect(() => {
    if (!user) return; // Only fetch if user is logged in
    supabase
      .from("users")
      .select("role, full_name")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to fetch user profile:", error.message);
          // Optionally: setProfile(null); // You may want to clear profile on error
          return;
        }
        setProfile(data);
      });
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

  const role = profile?.role || "user";

  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 px-3 py-2 rounded-full bg-luxe-dark-outline text-luxe-gold-accent hover:bg-luxe-gold-accent/20">
        <span className="inline-block w-8 h-8 rounded-full bg-luxe-gold-accent text-black flex items-center justify-center font-bold">
          {profile?.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
        </span>
        <span className="text-xs text-luxe-gold-accent font-semibold ml-1">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
        <svg className="w-4 h-4 ml-1 text-luxe-gold-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-black/90 ring-1 ring-black ring-opacity-5 z-50">
          {/* Admin menu */}
          {role === "admin" && (
            <>
              <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); navigate("/admin"); }}>Admin Dashboard</button>
              <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); navigate("/manage-users"); }}>Manage Users</button>
              <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); navigate("/manage-drivers"); }}>Manage Drivers</button>
              <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); navigate("/manage-vehicles"); }}>Manage Vehicles</button>
              <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); navigate("/feedback"); }}>Feedback</button>
            </>
          )}
          {/* Driver menu */}
          {role === "driver" && (
            <>
              <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); navigate("/driver-dashboard"); }}>Driver Dashboard</button>
              <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); window.open("https://apps.apple.com/app/luxeride-vip/id[APP_ID]", "_blank"); }}>Download Mobile App</button>
            </>
          )}
          {/* Corporate menu */}
          {role === "corporate" && (
            <>
              <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); window.open("https://apps.apple.com/app/luxeride-vip/id[APP_ID]", "_blank"); }}>Download Mobile App</button>
              <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); navigate("/approvals"); }}>Approvals</button>
              <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); navigate("/reports"); }}>Reports</button>
              <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); navigate("/manage-team"); }}>Manage Team</button>
              <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); navigate("/profile"); }}>Profile</button>
            </>
          )}
          {/* Regular user menu */}
          {role !== "admin" && role !== "driver" && role !== "corporate" && (
            <>
              <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); navigate("/vip-membership"); }}>Membership Packages</button>
              <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-white" onClick={() => { setOpen(false); window.open("https://apps.apple.com/app/luxeride-vip/id[APP_ID]", "_blank"); }}>Download Mobile App</button>
            </>
          )}
          <button className="w-full text-left px-4 py-2 hover:bg-luxe-gold-accent/10 text-red-500" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 