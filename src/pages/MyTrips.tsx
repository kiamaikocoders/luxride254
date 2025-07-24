import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const STATUS_TABS = [
  { key: "active", label: "Active" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

function getTripCategory(trip) {
  if (trip.trip_status === "cancelled") return "cancelled";
  if (["completed"].includes(trip.trip_status)) return "completed";
  if (["in_progress", "accepted"].includes(trip.trip_status)) return "active";
  return "upcoming";
}

const MyTrips = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [selectedTrip, setSelectedTrip] = useState(null);
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

  // Fetch trips for driver
  const fetchTrips = useCallback(async () => {
    if (!driverId) return [];
    const { data, error } = await supabase
      .from("trips")
      .select(`*, users:user_id(*), vehicles(*), payments(*), feedback(*)`)
      .eq("driver_id", driverId)
      .order("requested_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }, [driverId]);

  const {
    data: trips = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["driver-trips", driverId],
    queryFn: fetchTrips,
    enabled: !!driverId,
  });

  // Realtime subscription
  useEffect(() => {
    if (!driverId) return;
    const channel = supabase
      .channel("realtime:trips-driver")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trips", filter: `driver_id=eq.${driverId}` },
        (payload) => {
          queryClient.invalidateQueries(["driver-trips", driverId]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId, queryClient]);

  // Tab filtering
  const filteredTrips = trips.filter((trip) => getTripCategory(trip) === activeTab);

  // Trip actions
  const handleAccept = async (tripId) => {
    await supabase.from("trips").update({ trip_status: "accepted" }).eq("id", tripId);
    refetch();
    setModalOpen(false);
  };
  const handleDecline = async (tripId) => {
    await supabase.from("trips").update({ trip_status: "cancelled" }).eq("id", tripId);
    refetch();
    setModalOpen(false);
  };
  const handleStart = async (tripId) => {
    await supabase.from("trips").update({ trip_status: "in_progress", started_at: new Date().toISOString() }).eq("id", tripId);
    refetch();
    setModalOpen(false);
  };
  const handleComplete = async (tripId) => {
    await supabase.from("trips").update({ trip_status: "completed", completed_at: new Date().toISOString() }).eq("id", tripId);
    refetch();
    setModalOpen(false);
  };
  const handleCancel = async (tripId) => {
    await supabase.from("trips").update({ trip_status: "cancelled" }).eq("id", tripId);
    refetch();
    setModalOpen(false);
  };

  // UI
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-luxe-gold-accent">My Trips (Driver)</h1>
      <div className="flex gap-4 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${activeTab === tab.key ? "bg-luxe-gold-accent text-black" : "bg-zinc-800 text-luxe-gold-accent hover:bg-zinc-700"}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-zinc-900 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-400">Error: {error.message}</div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-zinc-400 text-center py-12">No {activeTab} trips found.</div>
      ) : (
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-zinc-900 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-zinc-800 transition"
              onClick={() => { setSelectedTrip(trip); setModalOpen(true); }}
            >
              <div>
                <div className="font-bold text-lg text-luxe-gold-accent">{trip.vehicles?.make} {trip.vehicles?.model}</div>
                <div className="text-sm text-zinc-400">{trip.trip_status.replace("_", " ").toUpperCase()} &bull; {format(new Date(trip.requested_at), "PPpp")}</div>
                <div className="text-sm text-zinc-400">Rider: {trip.users?.full_name ?? trip.users?.email ?? "-"}</div>
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
            <div className="mb-2">Rider: <span className="font-semibold">{selectedTrip.users?.full_name ?? selectedTrip.users?.email ?? "-"}</span></div>
            <div className="mb-2">Vehicle: <span className="font-semibold">{selectedTrip.vehicles?.make} {selectedTrip.vehicles?.model}</span></div>
            <div className="mb-2">Pickup: <span className="font-semibold">{selectedTrip.pickup_location ? JSON.stringify(selectedTrip.pickup_location) : "-"}</span></div>
            <div className="mb-2">Destination: <span className="font-semibold">{selectedTrip.destination ? JSON.stringify(selectedTrip.destination) : "-"}</span></div>
            <div className="mb-2">Status: <span className="font-semibold">{selectedTrip.trip_status.replace("_", " ").toUpperCase()}</span></div>
            <div className="mb-2">Fare: <span className="font-semibold">Ksh {selectedTrip.final_fare ?? selectedTrip.estimated_fare ?? "-"}</span></div>
            <div className="mb-2">Payment: <span className="font-semibold">{selectedTrip.payments?.status ?? "Unpaid"}</span></div>
            {/* Actions based on status */}
            {selectedTrip.trip_status === "requested" && (
              <div className="flex gap-2 mt-4">
                <button className="w-1/2 bg-luxe-gold-accent text-black font-bold py-2 rounded" onClick={() => handleAccept(selectedTrip.id)}>Accept</button>
                <button className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded" onClick={() => handleDecline(selectedTrip.id)}>Decline</button>
              </div>
            )}
            {selectedTrip.trip_status === "accepted" && (
              <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded" onClick={() => handleStart(selectedTrip.id)}>Start Trip</button>
            )}
            {selectedTrip.trip_status === "in_progress" && (
              <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded" onClick={() => handleComplete(selectedTrip.id)}>Complete Trip</button>
            )}
            {selectedTrip.trip_status !== "completed" && selectedTrip.trip_status !== "cancelled" && (
              <button className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded" onClick={() => handleCancel(selectedTrip.id)}>Cancel Trip</button>
            )}
            {selectedTrip.trip_status === "completed" && selectedTrip.feedback && (
              <div className="mt-4 text-green-400">Feedback submitted by rider. Thank you!</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTrips; 