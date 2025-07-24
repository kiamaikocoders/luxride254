import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ManageUsers = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState("");
  const queryClient = useQueryClient();

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }, []);

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("realtime:admin-users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        () => queryClient.invalidateQueries(["admin-users"])
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Edit role
  const handleRoleChange = async (userId, newRole) => {
    await supabase.from("users").update({ role: newRole }).eq("id", userId);
    refetch();
    setModalOpen(false);
  };

  // Suspend/reactivate user
  const handleSuspend = async (userId, suspended) => {
    await supabase.from("users").update({ role: suspended ? "suspended" : "user" }).eq("id", userId);
    refetch();
    setModalOpen(false);
  };

  // UI
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-luxe-gold-accent">Manage Users</h1>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-900 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-400">Error: {error.message}</div>
      ) : users.length === 0 ? (
        <div className="text-zinc-400 text-center py-12">No users found.</div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-zinc-900 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-zinc-800 transition"
              onClick={() => { setSelectedUser(user); setEditingRole(user.role); setModalOpen(true); }}
            >
              <div>
                <div className="font-bold text-lg text-luxe-gold-accent">{user.full_name ?? user.email}</div>
                <div className="text-sm text-zinc-400">Role: {user.role}</div>
                <div className="text-sm text-zinc-400">Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}</div>
              </div>
              <div className="mt-2 md:mt-0 md:text-right">
                <button
                  className={`bg-${user.role === "suspended" ? "green" : "red"}-600 hover:bg-${user.role === "suspended" ? "green" : "red"}-700 text-white font-bold px-4 py-2 rounded`}
                  onClick={(e) => { e.stopPropagation(); handleSuspend(user.id, user.role !== "suspended"); }}
                >{user.role === "suspended" ? "Reactivate" : "Suspend"}</button>
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
            <h2 className="text-2xl font-bold mb-2 text-luxe-gold-accent">User Details</h2>
            <div className="mb-2">Name: <span className="font-semibold">{selectedUser.full_name ?? selectedUser.email}</span></div>
            <div className="mb-2">Email: <span className="font-semibold">{selectedUser.email}</span></div>
            <div className="mb-2">Role: <span className="font-semibold">{selectedUser.role}</span></div>
            <div className="mb-2">Joined: <span className="font-semibold">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : "-"}</span></div>
            <div className="mb-2">Loyalty Tier: <span className="font-semibold">{selectedUser.loyalty_tier ?? "-"}</span></div>
            <div className="mb-2">Phone: <span className="font-semibold">{selectedUser.phone ?? "-"}</span></div>
            <div className="mb-2">Change Role:
              <select
                className="ml-2 rounded bg-zinc-800 text-white p-1"
                value={editingRole}
                onChange={e => setEditingRole(e.target.value)}
              >
                {['user','driver','corporate','admin','suspended'].map(r => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
              <button
                className="ml-2 bg-luxe-gold-accent text-black font-bold px-3 py-1 rounded"
                onClick={() => handleRoleChange(selectedUser.id, editingRole)}
                disabled={editingRole === selectedUser.role}
              >Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers; 