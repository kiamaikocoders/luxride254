import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ManageTeam = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const queryClient = useQueryClient();

  // Get current user and corporate_account_id
  const [user, setUser] = useState(null);
  const [corporateAccountId, setCorporateAccountId] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        // Get corporate_account_id from users table
        const { data: profile } = await supabase.from("users").select("corporate_account_id").eq("id", data.user.id).single();
        setCorporateAccountId(profile?.corporate_account_id);
      }
    });
  }, []);

  // Fetch team members
  const fetchTeam = useCallback(async () => {
    if (!corporateAccountId) return [];
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("corporate_account_id", corporateAccountId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }, [corporateAccountId]);

  const {
    data: team = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["corporate-team", corporateAccountId],
    queryFn: fetchTeam,
    enabled: !!corporateAccountId,
  });

  // Realtime subscription
  useEffect(() => {
    if (!corporateAccountId) return;
    const channel = supabase
      .channel("realtime:team-corporate")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users", filter: `corporate_account_id=eq.${corporateAccountId}` },
        () => queryClient.invalidateQueries(["corporate-team", corporateAccountId])
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [corporateAccountId, queryClient]);

  // Add team member (by email, if user exists)
  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    // Find user by email
    const { data: foundUser, error } = await supabase.from("users").select("id").eq("email", newEmail).single();
    if (error || !foundUser) {
      alert("User not found. They must sign up first.");
      setAdding(false);
      return;
    }
    // Update user's corporate_account_id
    await supabase.from("users").update({ corporate_account_id: corporateAccountId }).eq("id", foundUser.id);
    setNewEmail("");
    setAdding(false);
    refetch();
  };

  // Remove team member
  const handleRemove = async (userId) => {
    await supabase.from("users").update({ corporate_account_id: null }).eq("id", userId);
    refetch();
    setModalOpen(false);
  };

  // UI
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-luxe-gold-accent">Manage Team</h1>
      <form className="flex gap-2 mb-6" onSubmit={handleAdd}>
        <input
          type="email"
          className="flex-1 rounded bg-zinc-800 text-white p-2"
          placeholder="Add team member by email..."
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-luxe-gold-accent text-black font-bold px-4 py-2 rounded disabled:opacity-60"
          disabled={adding}
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </form>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-900 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-400">Error: {error.message}</div>
      ) : team.length === 0 ? (
        <div className="text-zinc-400 text-center py-12">No team members found.</div>
      ) : (
        <div className="space-y-4">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-zinc-900 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-zinc-800 transition"
              onClick={() => { setSelectedUser(member); setModalOpen(true); }}
            >
              <div>
                <div className="font-bold text-lg text-luxe-gold-accent">{member.full_name ?? member.email}</div>
                <div className="text-sm text-zinc-400">Role: {member.role}</div>
                <div className="text-sm text-zinc-400">Joined: {member.created_at ? new Date(member.created_at).toLocaleDateString() : "-"}</div>
              </div>
              <div className="mt-2 md:mt-0 md:text-right">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded"
                  onClick={(e) => { e.stopPropagation(); handleRemove(member.id); }}
                >Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* User Details Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-luxe-gold-accent text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-2 text-luxe-gold-accent">Team Member Details</h2>
            <div className="mb-2">Name: <span className="font-semibold">{selectedUser.full_name ?? selectedUser.email}</span></div>
            <div className="mb-2">Email: <span className="font-semibold">{selectedUser.email}</span></div>
            <div className="mb-2">Role: <span className="font-semibold">{selectedUser.role}</span></div>
            <div className="mb-2">Joined: <span className="font-semibold">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : "-"}</span></div>
            <div className="mb-2">Loyalty Tier: <span className="font-semibold">{selectedUser.loyalty_tier ?? "-"}</span></div>
            <div className="mb-2">Phone: <span className="font-semibold">{selectedUser.phone ?? "-"}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeam; 