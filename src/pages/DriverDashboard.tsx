import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Line, Bar } from 'react-chartjs-2';
import { Chart, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const DriverDashboard = () => {
  const [user, setUser] = useState(null);
  const [driverId, setDriverId] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: driver } = await supabase.from("drivers").select("id").eq("user_id", data.user.id).single();
        setDriverId(driver?.id);
      }
    });
  }, []);

  // Fetch dashboard data
  const fetchDashboard = useCallback(async () => {
    if (!driverId) return { trips: [], payments: [], feedback: [] };
    const { data: trips } = await supabase.from("trips").select("id, trip_status, requested_at").eq("driver_id", driverId);
    const { data: payments } = await supabase.from("payments").select("driver_earning, processed_at").eq("user_id", user?.id);
    const { data: feedback } = await supabase.from("feedback").select("rating").eq("driver_id", driverId);
    return { trips: trips || [], payments: payments || [], feedback: feedback || [] };
  }, [driverId, user]);

  const { data = { trips: [], payments: [], feedback: [] }, isLoading, isError, error } = useQuery({
    queryKey: ["driver-dashboard", driverId],
    queryFn: fetchDashboard,
    enabled: !!driverId,
  });

  // Stats
  const activeTrips = data.trips.filter(t => ["in_progress", "accepted"].includes(t.trip_status)).length;
  const totalEarnings = data.payments.reduce((sum, p) => sum + (Number(p.driver_earning) || 0), 0);
  const avgRating = data.feedback.length ? (data.feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / data.feedback.length).toFixed(2) : "-";

  // Recent activity (last 5 trips)
  const recentTrips = [...data.trips]
    .sort((a, b) => {
      const dateA = a.requested_at ? new Date(a.requested_at).getTime() : 0;
      const dateB = b.requested_at ? new Date(b.requested_at).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  // Earnings Over Time Line Chart Data
  const monthlyEarnings = {};
  data.payments.forEach(p => {
    if (!p.processed_at) return;
    const d = new Date(p.processed_at);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    monthlyEarnings[key] = (monthlyEarnings[key] || 0) + Number(p.driver_earning || 0);
  });
  const earningsData = {
    labels: Object.keys(monthlyEarnings),
    datasets: [
      {
        label: 'Earnings per Month',
        data: Object.values(monthlyEarnings),
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Trip Completion Rate Bar Chart Data
  const monthlyTrips = {};
  data.trips.forEach(t => {
    if (!t.requested_at) return;
    const d = new Date(t.requested_at);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    if (!monthlyTrips[key]) monthlyTrips[key] = { completed: 0, total: 0 };
    monthlyTrips[key].total += 1;
    if (t.trip_status === 'completed') monthlyTrips[key].completed += 1;
  });
  const completionLabels = Object.keys(monthlyTrips);
  const completionData = {
    labels: completionLabels,
    datasets: [
      {
        label: 'Completed Trips',
        data: completionLabels.map(k => monthlyTrips[k].completed),
        backgroundColor: '#FFD700',
      },
      {
        label: 'Total Trips',
        data: completionLabels.map(k => monthlyTrips[k].total),
        backgroundColor: '#333',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white px-2 sm:px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-luxe-gold-accent">Driver Dashboard</h1>
      {isLoading ? (
        <div className="text-zinc-400">Loading...</div>
      ) : isError ? (
        <div className="text-red-400">Error: {error.message}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-8">
            <StatCard label="Active Trips" value={activeTrips} />
            <StatCard label="Total Earnings" value={`Ksh ${totalEarnings.toLocaleString()}`} />
            <StatCard label="Avg. Rating" value={avgRating} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-8">
            <QuickLink to="/my-trips" label="My Trips" />
            <QuickLink to="/earnings" label="Earnings" />
          </div>
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-luxe-gold-accent">Recent Trips</h2>
            {recentTrips.length === 0 ? (
              <div className="text-zinc-400">No recent trips.</div>
            ) : (
              <ul className="space-y-2">
                {recentTrips.map(t => (
                  <li key={t.id} className="bg-zinc-900 rounded p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <span className="font-semibold">{t.trip_status.replace("_", " ").toUpperCase()}</span>
                    <span className="text-xs text-zinc-400 mt-1 sm:mt-0">{t.requested_at ? new Date(t.requested_at).toLocaleString() : "-"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-luxe-gold-accent">Earnings Over Time (Chart)</h2>
            <div className="bg-zinc-900 rounded p-6 mb-6">
              <Line data={earningsData} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-luxe-gold-accent">Trip Completion Rate (Chart)</h2>
            <div className="bg-zinc-900 rounded p-6">
              <Bar data={completionData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function StatCard({ label, value }) {
  return (
    <div className="bg-zinc-900 rounded-lg p-4 flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-luxe-gold-accent" tabIndex={0} aria-label={label}>
      <div className="text-sm text-zinc-400 mb-1">{label}</div>
      <div className="text-2xl font-bold text-luxe-gold-accent">{value}</div>
    </div>
  );
}

function QuickLink({ to, label }) {
  return (
    <Link
      to={to}
      className="bg-luxe-gold-accent text-black font-bold px-4 py-3 rounded flex items-center justify-center hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-luxe-gold-accent transition text-lg text-center"
      tabIndex={0}
      aria-label={label}
    >
      {label}
    </Link>
  );
}

export default DriverDashboard; 