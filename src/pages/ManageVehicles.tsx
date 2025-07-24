import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ManageVehicles = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ make: "", model: "", year: "", license_plate: "", category: "" });
  const queryClient = useQueryClient();

  // Fetch all vehicles (with driver info)
  const fetchVehicles = useCallback(async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*, drivers(driver_id, user_id, status)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }, []);

  const {
    data: vehicles = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-vehicles"],
    queryFn: fetchVehicles,
  });

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("realtime:admin-vehicles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vehicles" },
        () => queryClient.invalidateQueries(["admin-vehicles"])
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Add vehicle
  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    await supabase.from("vehicles").insert({ ...newVehicle });
    setNewVehicle({ make: "", model: "", year: "", license_plate: "", category: "" });
    setAdding(false);
    refetch();
  };

  // Remove vehicle
  const handleRemove = async (vehicleId) => {
    await supabase.from("vehicles").delete().eq("id", vehicleId);
    refetch();
    setModalOpen(false);
  };

  // UI
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-luxe-gold-accent">Manage Vehicles</h1>
      <form className="flex flex-wrap gap-2 mb-6" onSubmit={handleAdd}>
        <input type="text" className="rounded bg-zinc-800 text-white p-2" placeholder="Make" value={newVehicle.make} onChange={e => setNewVehicle(v => ({ ...v, make: e.target.value }))} required />
        <input type="text" className="rounded bg-zinc-800 text-white p-2" placeholder="Model" value={newVehicle.model} onChange={e => setNewVehicle(v => ({ ...v, model: e.target.value }))} required />
        <input type="number" className="rounded bg-zinc-800 text-white p-2" placeholder="Year" value={newVehicle.year} onChange={e => setNewVehicle(v => ({ ...v, year: e.target.value }))} required />
        <input type="text" className="rounded bg-zinc-800 text-white p-2" placeholder="License Plate" value={newVehicle.license_plate} onChange={e => setNewVehicle(v => ({ ...v, license_plate: e.target.value }))} required />
        <input type="text" className="rounded bg-zinc-800 text-white p-2" placeholder="Category" value={newVehicle.category} onChange={e => setNewVehicle(v => ({ ...v, category: e.target.value }))} required />
        <button type="submit" className="bg-luxe-gold-accent text-black font-bold px-4 py-2 rounded disabled:opacity-60" disabled={adding}>{adding ? "Adding..." : "Add Vehicle"}</button>
      </form>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-zinc-900 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-400">Error: {error.message}</div>
      ) : vehicles.length === 0 ? (
        <div className="text-zinc-400 text-center py-12">No vehicles found.</div>
      ) : (
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-zinc-900 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-zinc-800 transition"
              onClick={() => { setSelectedVehicle(vehicle); setModalOpen(true); }}
            >
              <div>
                <div className="font-bold text-lg text-luxe-gold-accent">{vehicle.make} {vehicle.model} ({vehicle.year})</div>
                <div className="text-sm text-zinc-400">License: {vehicle.license_plate}</div>
                <div className="text-sm text-zinc-400">Category: {vehicle.category}</div>
              </div>
              <div className="mt-2 md:mt-0 md:text-right">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded"
                  onClick={(e) => { e.stopPropagation(); handleRemove(vehicle.id); }}
                >Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Vehicle Details Modal */}
      {modalOpen && selectedVehicle && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-luxe-gold-accent text-2xl" onClick={() => setModalOpen(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-2 text-luxe-gold-accent">Vehicle Details</h2>
            <div className="mb-2">Make: <span className="font-semibold">{selectedVehicle.make}</span></div>
            <div className="mb-2">Model: <span className="font-semibold">{selectedVehicle.model}</span></div>
            <div className="mb-2">Year: <span className="font-semibold">{selectedVehicle.year}</span></div>
            <div className="mb-2">License Plate: <span className="font-semibold">{selectedVehicle.license_plate}</span></div>
            <div className="mb-2">Category: <span className="font-semibold">{selectedVehicle.category}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVehicles; 