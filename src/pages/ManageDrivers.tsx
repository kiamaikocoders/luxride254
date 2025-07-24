import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ManageDrivers = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all drivers (with user info)
  const fetchDrivers = useCallback(async () => {
    const { data, error } = await supabase
      .from("drivers")
      .select("*, users:user_id(*)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }, []);

  const {
    data: drivers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-drivers"],
    queryFn: fetchDrivers,
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("realtime:admin-drivers")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "drivers" },
        () => queryClient.invalidateQueries(["admin-drivers"])
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Approve onboarding
  const handleApprove = async (driverId) => {
    await supabase.from("drivers").update({ status: "approved" }).eq("id", driverId);
    refetch();
    setModalOpen(false);
  };
  // Suspend driver
  const handleSuspend = async (driverId) => {
    await supabase.from("drivers").update({ status: "suspended" }).eq("id", driverId);
    refetch();
    setModalOpen(false);
  };

  // UI
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-luxe-gold-accent">Manage Drivers</h1>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-900 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-400">Error: {error.message}</div>
      ) : drivers.length === 0 ? (
        <div className="text-zinc-400 text-center py-12">No drivers found.</div>
      ) : (
        <div className="space-y-4">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-zinc-900 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-zinc-800 transition"
              onClick={() => { setSelectedDriver(driver); setModalOpen(true); }}
            >
              <div>
                <div className="font-bold text-lg text-luxe-gold-accent">{driver.users?.full_name ?? driver.users?.email}</div>
                <div className="text-sm text-zinc-400">Status: {driver.status}</div>
                <div className="text-sm text-zinc-400">Experience: {driver.experience_years ?? "-"} years</div>
              </div>
              <div className="mt-2 md:mt-0 md:text-right">
                {driver.status !== "approved" && (
                  <button
                    className="bg-luxe-gold-accent text-black font-bold px-4 py-2 rounded mr-2"
                    onClick={(e) => { e.stopPropagation(); handleApprove(driver.id); }}
                  >Approve</button>
                )}
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded"
                  onClick={(e) => { e.stopPropagation(); handleSuspend(driver.id); }}
                >Suspend</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Driver Details Modal */}
      {modalOpen && selectedDriver && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-luxe-gold-accent text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-2 text-luxe-gold-accent">Driver Details</h2>
            <div className="mb-2">Name: <span className="font-semibold">{selectedDriver.users?.full_name ?? selectedDriver.users?.email}</span></div>
            <div className="mb-2">Status: <span className="font-semibold">{selectedDriver.status}</span></div>
            <div className="mb-2">Experience: <span className="font-semibold">{selectedDriver.experience_years ?? "-"} years</span></div>
            <div className="mb-2">License: <span className="font-semibold">{selectedDriver.license_number ?? "-"}</span></div>
            <div className="mb-2">Languages: <span className="font-semibold">{selectedDriver.languages?.join(", ") ?? "-"}</span></div>
            <div className="mb-2">Rating: <span className="font-semibold">{selectedDriver.rating ?? "-"}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDrivers; 