import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const Reports = () => {
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

  // Fetch trips and payments for corporate account
  const fetchData = useCallback(async () => {
    if (!corporateAccountId) return { trips: [], payments: [] };
    const { data: trips, error: tripsError } = await supabase
      .from("trips")
      .select(`*, users:user_id(*), vehicles(*), payments(*)`)
      .eq("corporate_account_id", corporateAccountId)
      .order("requested_at", { ascending: false });
    const { data: payments, error: paymentsError } = await supabase
      .from("payments")
      .select(`*, trips(*)`)
      .eq("corporate_invoice_id", corporateAccountId)
      .order("processed_at", { ascending: false });
    if (tripsError) throw new Error(tripsError.message);
    if (paymentsError) throw new Error(paymentsError.message);
    return { trips: trips || [], payments: payments || [] };
  }, [corporateAccountId]);

  const {
    data = { trips: [], payments: [] },
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["corporate-reports", corporateAccountId],
    queryFn: fetchData,
    enabled: !!corporateAccountId,
  });

  // Realtime subscription
  useEffect(() => {
    if (!corporateAccountId) return;
    const channel = supabase
      .channel("realtime:reports-corporate")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trips", filter: `corporate_account_id=eq.${corporateAccountId}` },
        () => queryClient.invalidateQueries(["corporate-reports", corporateAccountId])
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payments", filter: `corporate_invoice_id=eq.${corporateAccountId}` },
        () => queryClient.invalidateQueries(["corporate-reports", corporateAccountId])
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [corporateAccountId, queryClient]);

  // Analytics
  const totalRides = data.trips.length;
  const totalSpend = data.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const monthlyBreakdown = data.payments.reduce((acc, p) => {
    const d = new Date(p.processed_at);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    acc[key] = (acc[key] || 0) + (Number(p.amount) || 0);
    return acc;
  }, {});

  // UI
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-luxe-gold-accent">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard label="Total Rides" value={totalRides} />
        <SummaryCard label="Total Spend" value={`Ksh ${totalSpend.toLocaleString()}`} />
        <SummaryCard label="This Month" value={`Ksh ${monthlyBreakdown[Object.keys(monthlyBreakdown).pop()]?.toLocaleString() || 0}`} />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-luxe-gold-accent">All Trips</h2>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-zinc-900 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-400">Error: {error.message}</div>
      ) : data.trips.length === 0 ? (
        <div className="text-zinc-400 text-center py-12">No trips found.</div>
      ) : (
        <div className="space-y-4">
          {data.trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-zinc-900 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-zinc-800 transition"
              onClick={() => { setSelectedTrip(trip); setModalOpen(true); }}
            >
              <div>
                <div className="font-bold text-lg text-luxe-gold-accent">{trip.vehicles?.make} {trip.vehicles?.model}</div>
                <div className="text-sm text-zinc-400">{trip.trip_status.replace("_", " ").toUpperCase()} &bull; {format(new Date(trip.requested_at), "PPpp")}</div>
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
            <h2 className="text-2xl font-bold mb-2 text-luxe-gold-accent">Trip Details</h2>
            <div className="mb-2">Booked by: <span className="font-semibold">{selectedTrip.users?.full_name ?? selectedTrip.users?.email ?? "-"}</span></div>
            <div className="mb-2">Vehicle: <span className="font-semibold">{selectedTrip.vehicles?.make} {selectedTrip.vehicles?.model}</span></div>
            <div className="mb-2">Pickup: <span className="font-semibold">{selectedTrip.pickup_location ? JSON.stringify(selectedTrip.pickup_location) : "-"}</span></div>
            <div className="mb-2">Destination: <span className="font-semibold">{selectedTrip.destination ? JSON.stringify(selectedTrip.destination) : "-"}</span></div>
            <div className="mb-2">Status: <span className="font-semibold">{selectedTrip.trip_status.replace("_", " ").toUpperCase()}</span></div>
            <div className="mb-2">Fare: <span className="font-semibold">Ksh {selectedTrip.final_fare ?? selectedTrip.estimated_fare ?? "-"}</span></div>
            <div className="mb-2">Payment: <span className="font-semibold">{selectedTrip.payments?.status ?? "Unpaid"}</span></div>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold mt-8 mb-4 text-luxe-gold-accent">Payments</h2>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-900 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-400">Error: {error.message}</div>
      ) : data.payments.length === 0 ? (
        <div className="text-zinc-400 text-center py-8">No payments found.</div>
      ) : (
        <div className="space-y-2">
          {data.payments.map((p) => (
            <div key={p.id} className="bg-zinc-900 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="font-bold text-luxe-gold-accent">Trip: {p.trips?.id?.slice(0, 8) ?? "-"}</div>
                <div className="text-sm text-zinc-400">Processed: {p.processed_at ? format(new Date(p.processed_at), "PPpp") : "-"}</div>
                <div className="text-sm text-zinc-400">Status: {p.status?.toUpperCase() ?? "-"}</div>
              </div>
              <div className="mt-2 md:mt-0 md:text-right">
                <div className="text-lg font-semibold">Ksh {Number(p.amount).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function SummaryCard({ label, value }) {
  return (
    <div className="bg-zinc-900 rounded-lg p-4 flex flex-col items-center justify-center">
      <div className="text-sm text-zinc-400 mb-1">{label}</div>
      <div className="text-2xl font-bold text-luxe-gold-accent">{value}</div>
    </div>
  );
}

export default Reports; 