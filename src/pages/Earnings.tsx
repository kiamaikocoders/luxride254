import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const Earnings = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Get current user and driver_id
  const [user, setUser] = useState(null);
  const [driverId, setDriverId] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        // Get driver_id from drivers table
        const { data: driver } = await supabase.from("drivers").select("id").eq("user_id", data.user.id).single();
        setDriverId(driver?.id);
      }
    });
  }, []);

  // Fetch payments for driver
  const fetchPayments = useCallback(async () => {
    if (!driverId) return [];
    const { data, error } = await supabase
      .from("payments")
      .select(`*, trips(*), vehicles:trips.vehicle_id(*)`)
      .eq("trips.driver_id", driverId)
      .order("processed_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }, [driverId]);

  const {
    data: payments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["driver-earnings", driverId],
    queryFn: fetchPayments,
    enabled: !!driverId,
  });

  // Realtime subscription
  useEffect(() => {
    if (!driverId) return;
    const channel = supabase
      .channel("realtime:payments-driver")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payments" },
        (payload) => {
          queryClient.invalidateQueries(["driver-earnings", driverId]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId, queryClient]);

  // Earnings summary
  const totalEarnings = payments.reduce((sum, p) => sum + (Number(p.driver_earning) || 0), 0);
  const thisMonthEarnings = payments.filter((p) => {
    const d = new Date(p.processed_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, p) => sum + (Number(p.driver_earning) || 0), 0);
  const pendingEarnings = payments.filter((p) => p.status !== "paid").reduce((sum, p) => sum + (Number(p.driver_earning) || 0), 0);

  // UI
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-luxe-gold-accent">Earnings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard label="Total Earnings" value={`Ksh ${totalEarnings.toLocaleString()}`} />
        <SummaryCard label="This Month" value={`Ksh ${thisMonthEarnings.toLocaleString()}`} />
        <SummaryCard label="Pending" value={`Ksh ${pendingEarnings.toLocaleString()}`} />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-luxe-gold-accent">Payouts</h2>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-zinc-900 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-400">Error: {error.message}</div>
      ) : payments.length === 0 ? (
        <div className="text-zinc-400 text-center py-12">No earnings found.</div>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => (
            <div
              key={p.id}
              className="bg-zinc-900 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-zinc-800 transition"
              onClick={() => { setSelectedPayment(p); setModalOpen(true); }}
            >
              <div>
                <div className="font-bold text-lg text-luxe-gold-accent">Trip: {p.trips?.id?.slice(0, 8) ?? "-"}</div>
                <div className="text-sm text-zinc-400">Processed: {p.processed_at ? format(new Date(p.processed_at), "PPpp") : "-"}</div>
                <div className="text-sm text-zinc-400">Status: {p.status?.toUpperCase() ?? "-"}</div>
              </div>
              <div className="mt-2 md:mt-0 md:text-right">
                <div className="text-lg font-semibold">Ksh {Number(p.driver_earning).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Payment Details Modal */}
      {modalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-luxe-gold-accent text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-2 text-luxe-gold-accent">Payment Details</h2>
            <div className="mb-2">Trip ID: <span className="font-semibold">{selectedPayment.trips?.id ?? "-"}</span></div>
            <div className="mb-2">Vehicle: <span className="font-semibold">{selectedPayment.vehicles?.make} {selectedPayment.vehicles?.model}</span></div>
            <div className="mb-2">Processed: <span className="font-semibold">{selectedPayment.processed_at ? format(new Date(selectedPayment.processed_at), "PPpp") : "-"}</span></div>
            <div className="mb-2">Status: <span className="font-semibold">{selectedPayment.status?.toUpperCase() ?? "-"}</span></div>
            <div className="mb-2">Amount: <span className="font-semibold">Ksh {Number(selectedPayment.driver_earning).toLocaleString()}</span></div>
            <div className="mb-2">Commission: <span className="font-semibold">Ksh {Number(selectedPayment.commission).toLocaleString()}</span></div>
            <div className="mb-2">Method: <span className="font-semibold">{selectedPayment.method ?? "-"}</span></div>
          </div>
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

export default Earnings; 