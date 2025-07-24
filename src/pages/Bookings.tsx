import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

// Helper: Trip status categories
const STATUS_TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "cancelled", label: "Cancelled" },
];

// Helper: Determine status category
function getTripCategory(trip) {
  if (trip.trip_status === "cancelled") return "cancelled";
  if (["completed"].includes(trip.trip_status)) return "past";
  return "upcoming";
}

const Bookings = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Get current user
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // Fetch trips for user
  const fetchTrips = useCallback(async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from("trips")
      .select(`*, vehicles(*), drivers(*), payments(*), feedback(*)`)
      .eq("user_id", user.id)
      .order("requested_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }, [user]);

  const {
    data: trips = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-trips", user?.id],
    queryFn: fetchTrips,
    enabled: !!user,
  });

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("realtime:trips")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trips", filter: `user_id=eq.${user.id}` },
        (payload) => {
          queryClient.invalidateQueries(["user-trips", user.id]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Tab filtering
  const filteredTrips = trips.filter((trip) => getTripCategory(trip) === activeTab);

  // Cancel trip
  const handleCancel = async (tripId) => {
    await supabase.from("trips").update({ trip_status: "cancelled" }).eq("id", tripId);
    refetch();
    setModalOpen(false);
  };

  // Feedback (simplified for now)
  const handleFeedback = async (tripId, rating, comments) => {
    await supabase.from("feedback").insert({ trip_id: tripId, user_id: user.id, rating, comments });
    refetch();
    setModalOpen(false);
  };

  // UI
  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-luxe-gold-accent">My Bookings</h1>
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
        <div className="text-zinc-400 text-center py-12">No {activeTab} bookings found.</div>
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
            <div className="mb-2">Vehicle: <span className="font-semibold">{selectedTrip.vehicles?.make} {selectedTrip.vehicles?.model}</span></div>
            <div className="mb-2">Driver: <span className="font-semibold">{selectedTrip.drivers?.user_id ?? "-"}</span></div>
            <div className="mb-2">Pickup: <span className="font-semibold">{selectedTrip.pickup_location ? JSON.stringify(selectedTrip.pickup_location) : "-"}</span></div>
            <div className="mb-2">Destination: <span className="font-semibold">{selectedTrip.destination ? JSON.stringify(selectedTrip.destination) : "-"}</span></div>
            <div className="mb-2">Status: <span className="font-semibold">{selectedTrip.trip_status.replace("_", " ").toUpperCase()}</span></div>
            <div className="mb-2">Fare: <span className="font-semibold">Ksh {selectedTrip.final_fare ?? selectedTrip.estimated_fare ?? "-"}</span></div>
            <div className="mb-2">Payment: <span className="font-semibold">{selectedTrip.payments?.status ?? "Unpaid"}</span></div>
            {/* Cancel button for upcoming trips */}
            {getTripCategory(selectedTrip) === "upcoming" && selectedTrip.trip_status !== "cancelled" && (
              <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded" onClick={() => handleCancel(selectedTrip.id)}>Cancel Booking</button>
            )}
            {/* Feedback for past trips */}
            {getTripCategory(selectedTrip) === "past" && !selectedTrip.feedback && (
              <FeedbackForm onSubmit={(rating, comments) => handleFeedback(selectedTrip.id, rating, comments)} />
            )}
            {selectedTrip.feedback && (
              <div className="mt-4 text-green-400">Feedback submitted. Thank you!</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Feedback form component
function FeedbackForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  return (
    <form
      className="mt-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await onSubmit(rating, comments);
        setSubmitting(false);
      }}
    >
      <div className="mb-2">
        <label className="block text-sm mb-1">Rating:</label>
        <select
          className="w-full rounded bg-zinc-800 text-white p-2"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm mb-1">Comments:</label>
        <textarea
          className="w-full rounded bg-zinc-800 text-white p-2"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-luxe-gold-accent text-black font-bold py-2 rounded mt-2 disabled:opacity-60"
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}

export default Bookings; 