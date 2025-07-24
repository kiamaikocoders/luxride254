import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const Approvals = () => {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
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

  // Fetch approval requests (trips with status 'pending_approval')
  const fetchApprovals = useCallback(async () => {
    if (!corporateAccountId) return [];
    const { data, error } = await supabase
      .from("trips")
      .select(`*, users:user_id(*), vehicles(*), payments(*)`)
      .eq("corporate_account_id", corporateAccountId)
      .eq("trip_status", "pending_approval")
      .order("requested_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }, [corporateAccountId]);

  const {
    data: approvals = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["corporate-approvals", corporateAccountId],
    queryFn: fetchApprovals,
    enabled: !!corporateAccountId,
  });

  // Realtime subscription
  useEffect(() => {
    if (!corporateAccountId) return;
    const channel = supabase
      .channel("realtime:approvals-corporate")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trips", filter: `corporate_account_id=eq.${corporateAccountId}` },
        (payload) => {
          queryClient.invalidateQueries(["corporate-approvals", corporateAccountId]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [corporateAccountId, queryClient]);

  // Approve/Reject actions
  const handleApprove = async (tripId) => {
    await supabase.from("trips").update({ trip_status: "approved" }).eq("id", tripId);
    refetch();
    setModalOpen(false);
  };
  const handleReject = async (tripId) => {
    await supabase.from("trips").update({ trip_status: "rejected" }).eq("id", tripId);
    refetch();
    setModalOpen(false);
  };

  // UI
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-luxe-gold-accent">Approvals</h1>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-zinc-900 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-400">Error: {error.message}</div>
      ) : approvals.length === 0 ? (
        <div className="text-zinc-400 text-center py-12">No approval requests found.</div>
      ) : (
        <div className="space-y-4">
          {approvals.map((trip) => (
            <div
              key={trip.id}
              className="bg-zinc-900 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-zinc-800 transition"
              onClick={() => { setSelectedTrip(trip); setModalOpen(true); }}
            >
              <div>
                <div className="font-bold text-lg text-luxe-gold-accent">{trip.vehicles?.make} {trip.vehicles?.model}</div>
                <div className="text-sm text-zinc-400">Requested: {format(new Date(trip.requested_at), "PPpp")}</div>
                <div className="text-sm text-zinc-400">Booked by: {trip.users?.full_name ?? trip.users?.email ?? "-"}</div>
                <div className="text-sm text-zinc-400">From: {trip.pickup_location ? JSON.stringify(trip.pickup_location) : "-"}</div>
                <div className="text-sm text-zinc-400">To: {trip.destination ? JSON.stringify(trip.destination) : "-"}</div>
              </div>
              <div className="mt-2 md:mt-0 md:text-right">
                <div className="text-lg font-semibold">Ksh {trip.final_fare ?? trip.estimated_fare ?? "-"}</div>
                <div className="text-xs text-zinc-400">{trip.payments?.status ? trip.payments.status.toUpperCase() : "Unpaid"}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Trip Details Modal */}
      {modalOpen && selectedTrip && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-luxe-gold-accent text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-2 text-luxe-gold-accent">Approval Request Details</h2>
            <div className="mb-2">Booked by: <span className="font-semibold">{selectedTrip.users?.full_name ?? selectedTrip.users?.email ?? "-"}</span></div>
            <div className="mb-2">Vehicle: <span className="font-semibold">{selectedTrip.vehicles?.make} {selectedTrip.vehicles?.model}</span></div>
            <div className="mb-2">Pickup: <span className="font-semibold">{selectedTrip.pickup_location ? JSON.stringify(selectedTrip.pickup_location) : "-"}</span></div>
            <div className="mb-2">Destination: <span className="font-semibold">{selectedTrip.destination ? JSON.stringify(selectedTrip.destination) : "-"}</span></div>
            <div className="mb-2">Fare: <span className="font-semibold">Ksh {selectedTrip.final_fare ?? selectedTrip.estimated_fare ?? "-"}</span></div>
            <div className="mb-2">Payment: <span className="font-semibold">{selectedTrip.payments?.status ?? "Unpaid"}</span></div>
            <div className="flex gap-2 mt-4">
              <button className="w-1/2 bg-luxe-gold-accent text-black font-bold py-2 rounded" onClick={() => handleApprove(selectedTrip.id)}>Approve</button>
              <button className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded" onClick={() => handleReject(selectedTrip.id)}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals; 