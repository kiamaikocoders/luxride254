import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { User } from "@supabase/supabase-js";

interface Trip {
  id: string;
  trip_status: string;
  requested_at: string;
  final_fare?: number;
  estimated_fare?: number;
  pickup_location?: any;
  destination?: any;
  users: {
    full_name?: string;
    email?: string;
  };
  vehicles: {
    make: string;
    model: string;
  };
  payments: {
    status?: string;
  };
  feedback?: any;
}

interface StatusTab {
  key: string;
  label: string;
}

const STATUS_TABS: StatusTab[] = [
  { key: "active", label: "Active" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

function getTripCategory(trip: Trip): string {
  if (trip.trip_status === "cancelled") return "cancelled";
  if (["completed"].includes(trip.trip_status)) return "completed";
  if (["in_progress", "accepted"].includes(trip.trip_status)) return "active";
  return "upcoming";
}

const MyTrips: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("active");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Get current user and driver_id
  const [user, setUser] = useState<User | null>(null);
  const [driverId, setDriverId] = useState<string | null>(null);
  
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        // Get driver_id from drivers table
        const { data: driver } = await supabase.from("drivers").select("id").eq("user_id", data.user.id).single();
        setDriverId(driver?.id || null);
      }
    });
  }, []);

  // Fetch trips for driver
  const fetchTrips = useCallback(async (): Promise<Trip[]> => {
    if (!driverId) return [];
    const { data, error } = await supabase
      .from("trips")
      .select(`*, users:user_id(*), vehicles(*), payments(*), feedback(*)`)
      .eq("driver_id", driverId)
      .order("requested_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as Trip[];
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
        () => {
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
  const handleAccept = async (tripId: string) => {
    await supabase.from("trips").update({ trip_status: "accepted" }).eq("id", tripId);
    refetch();
    setModalOpen(false);
  };
  
  const handleDecline = async (tripId: string) => {
    await supabase.from("trips").update({ trip_status: "cancelled" }).eq("id", tripId);
    refetch();
    setModalOpen(false);
  };
  
  const handleStart = async (tripId: string) => {
    await supabase.from("trips").update({ 
      trip_status: "in_progress", 
      started_at: new Date().toISOString() 
    }).eq("id", tripId);
    refetch();
    setModalOpen(false);
  };
  
  const handleComplete = async (tripId: string) => {
    await supabase.from("trips").update({ 
      trip_status: "completed", 
      completed_at: new Date().toISOString() 
    }).eq("id", tripId);
    refetch();
    setModalOpen(false);
  };
  
  const handleCancel = async (tripId: string) => {
    await supabase.from("trips").update({ trip_status: "cancelled" }).eq("id", tripId);
    refetch();
    setModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Driver Trips</h2>
      <div className="flex gap-4 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              activeTab === tab.key 
                ? "bg-blue-600 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-400">Error: {error instanceof Error ? error.message : 'Unknown error'}</div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-gray-400 text-center py-12">No {activeTab} trips found.</div>
      ) : (
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-gray-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-gray-200 transition"
              onClick={() => { setSelectedTrip(trip); setModalOpen(true); }}
            >
              <div>
                <div className="font-bold text-lg text-gray-900">{trip.vehicles?.make} {trip.vehicles?.model}</div>
                <div className="text-sm text-gray-600">{trip.trip_status.replace("_", " ").toUpperCase()} &bull; {format(new Date(trip.requested_at), "PPpp")}</div>
                <div className="text-sm text-gray-600">Rider: {trip.users?.full_name ?? trip.users?.email ?? "-"}</div>
                <div className="text-sm text-gray-600">From: {trip.pickup_location ? JSON.stringify(trip.pickup_location) : "-"}</div>
                <div className="text-sm text-gray-600">To: {trip.destination ? JSON.stringify(trip.destination) : "-"}</div>
              </div>
              <div className="mt-2 md:mt-0 md:text-right">
                <div className="text-lg font-semibold">Ksh {trip.final_fare ?? trip.estimated_fare ?? "-"}</div>
                <div className="text-xs text-gray-500">{trip.payments?.status ? trip.payments.status.toUpperCase() : "Unpaid"}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Trip Details Modal */}
      {modalOpen && selectedTrip && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
            <button 
              className="absolute top-2 right-2 text-gray-500 text-2xl" 
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Trip Details</h3>
            <div className="mb-2">Vehicle: <span className="font-semibold">{selectedTrip.vehicles?.make} {selectedTrip.vehicles?.model}</span></div>
            <div className="mb-2">Rider: <span className="font-semibold">{selectedTrip.users?.full_name ?? selectedTrip.users?.email ?? "-"}</span></div>
            <div className="mb-2">Pickup: <span className="font-semibold">{selectedTrip.pickup_location ? JSON.stringify(selectedTrip.pickup_location) : "-"}</span></div>
            <div className="mb-2">Destination: <span className="font-semibold">{selectedTrip.destination ? JSON.stringify(selectedTrip.destination) : "-"}</span></div>
            <div className="mb-2">Status: <span className="font-semibold">{selectedTrip.trip_status.replace("_", " ").toUpperCase()}</span></div>
            <div className="mb-2">Fare: <span className="font-semibold">Ksh {selectedTrip.final_fare ?? selectedTrip.estimated_fare ?? "-"}</span></div>
            <div className="mb-2">Payment: <span className="font-semibold">{selectedTrip.payments?.status ?? "Unpaid"}</span></div>
            {/* Actions based on status */}
            {selectedTrip.trip_status === "requested" && (
              <div className="flex gap-2 mt-4">
                <button 
                  className="w-1/2 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700" 
                  onClick={() => handleAccept(selectedTrip.id)}
                >
                  Accept
                </button>
                <button 
                  className="w-1/2 bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700" 
                  onClick={() => handleDecline(selectedTrip.id)}
                >
                  Decline
                </button>
              </div>
            )}
            {selectedTrip.trip_status === "accepted" && (
              <button 
                className="mt-4 w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700" 
                onClick={() => handleStart(selectedTrip.id)}
              >
                Start Trip
              </button>
            )}
            {selectedTrip.trip_status === "in_progress" && (
              <button 
                className="mt-4 w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700" 
                onClick={() => handleComplete(selectedTrip.id)}
              >
                Complete Trip
              </button>
            )}
            {selectedTrip.trip_status !== "completed" && selectedTrip.trip_status !== "cancelled" && (
              <button 
                className="mt-2 w-full bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700" 
                onClick={() => handleCancel(selectedTrip.id)}
              >
                Cancel Trip
              </button>
            )}
            {selectedTrip.trip_status === "completed" && selectedTrip.feedback && (
              <div className="mt-4 text-green-600">Feedback submitted by rider. Thank you!</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTrips;
