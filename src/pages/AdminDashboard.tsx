import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Line, Bar } from 'react-chartjs-2';
import { Chart, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const queryClient = useQueryClient();

  // Fetch dashboard data
  const fetchDashboard = useCallback(async () => {
    const { data: users } = await supabase.from("users").select("id, created_at");
    const { data: drivers } = await supabase.from("drivers").select("id, created_at");
    const { data: vehicles } = await supabase.from("vehicles").select("id, created_at");
    const { data: feedback } = await supabase.from("feedback").select("id, created_at");
    return { users: users || [], drivers: drivers || [], vehicles: vehicles || [], feedback: feedback || [] };
  }, []);

  const { data = { users: [], drivers: [], vehicles: [], feedback: [] }, isLoading, isError, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchDashboard,
  });

  // Stats
  const totalUsers = data.users.length;
  const totalDrivers = data.drivers.length;
  const totalVehicles = data.vehicles.length;
  const totalFeedback = data.feedback.length;

  // Recent activity (last 5 users, drivers, vehicles, feedback)
  const recentUsers = [...data.users].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 2);
  const recentDrivers = [...data.drivers].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 2);
  const recentVehicles = [...data.vehicles].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 1);
  const recentFeedback = [...data.feedback].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 1);

  // User Growth Line Chart Data
  const monthlyUsers = {};
  data.users.forEach(u => {
    if (!u.created_at) return;
    const d = new Date(u.created_at);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    monthlyUsers[key] = (monthlyUsers[key] || 0) + 1;
  });
  const userGrowthData = {
    labels: Object.keys(monthlyUsers),
    datasets: [
      {
        label: 'Users Created per Month',
        data: Object.values(monthlyUsers),
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Driver Performance Bar Chart Data
  const monthlyDrivers = {};
  data.drivers.forEach(d => {
    if (!d.created_at) return;
    const dt = new Date(d.created_at);
    const key = `${dt.getFullYear()}-${dt.getMonth() + 1}`;
    monthlyDrivers[key] = (monthlyDrivers[key] || 0) + 1;
  });
  const driverPerformanceData = {
    labels: Object.keys(monthlyDrivers),
    datasets: [
      {
        label: 'Drivers Created per Month',
        data: Object.values(monthlyDrivers),
        backgroundColor: '#FFD700',
      },
    ],
  };

  const [fraudAlert, setFraudAlert] = useState(null);
  const [maintenanceRec, setMaintenanceRec] = useState(null);

  // Fraud Detection integration
  const getFraudAlerts = async (booking_data, ride_data) => {
    setFraudAlert("Loading...");
    try {
      const res = await fetch('/functions/v1/fraud-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_data, ride_data }),
      });
      const data = await res.json();
      setFraudAlert(data.fraud_alerts || data.message);
    } catch {
      setFraudAlert("Error fetching fraud alerts.");
    }
  };

  // Predictive Maintenance integration
  const getMaintenanceRecommendation = async (vehicle_id, telemetry) => {
    setMaintenanceRec("Loading...");
    try {
      const res = await fetch('/functions/v1/predictive-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle_id, telemetry }),
      });
      const data = await res.json();
      setMaintenanceRec(data.maintenance_recommendation || data.message);
    } catch {
      setMaintenanceRec("Error fetching maintenance recommendation.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-2 sm:px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-luxe-gold-accent">Admin Dashboard</h1>
      {isLoading ? (
        <div className="text-zinc-400">Loading...</div>
      ) : isError ? (
        <div className="text-red-400">Error: {error.message}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-8">
            <StatCard label="Total Users" value={totalUsers} />
            <StatCard label="Total Drivers" value={totalDrivers} />
            <StatCard label="Total Vehicles" value={totalVehicles} />
            <StatCard label="Feedback" value={totalFeedback} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-8">
            <QuickLink to="/manage-users" label="Manage Users" />
            <QuickLink to="/manage-drivers" label="Manage Drivers" />
            <QuickLink to="/manage-vehicles" label="Manage Vehicles" />
            <QuickLink to="/feedback" label="Feedback" />
          </div>
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-luxe-gold-accent">Recent Activity</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              <RecentList title="Users" items={recentUsers} />
              <RecentList title="Drivers" items={recentDrivers} />
              <RecentList title="Vehicles" items={recentVehicles} />
              <RecentList title="Feedback" items={recentFeedback} />
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-luxe-gold-accent">User Growth (Chart)</h2>
            <div className="bg-zinc-900 rounded p-6 mb-6">
              <Line data={userGrowthData} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-luxe-gold-accent">Driver Performance (Chart)</h2>
            <div className="bg-zinc-900 rounded p-6">
              <Bar data={driverPerformanceData} />
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-luxe-gold-accent">AI Operations</h2>
            <button
              className="bg-luxe-gold-accent text-black font-bold px-3 py-1 rounded mt-2 mr-2"
              onClick={() => getFraudAlerts({ id: 'demo-booking' }, { route: [] })}
            >
              Check Fraud Alert (Demo)
            </button>
            {fraudAlert && (
              <div className="mt-2 bg-zinc-800 text-luxe-gold-accent rounded p-2">
                {fraudAlert}
              </div>
            )}
            <button
              className="bg-luxe-gold-accent text-black font-bold px-3 py-1 rounded mt-2"
              onClick={() => getMaintenanceRecommendation('demo-vehicle', { speed: 60, fuel_level: 50 })}
            >
              Check Maintenance (Demo)
            </button>
            {maintenanceRec && (
              <div className="mt-2 bg-zinc-800 text-luxe-gold-accent rounded p-2">
                {maintenanceRec}
              </div>
            )}
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

function RecentList({ title, items }) {
  return (
    <div className="bg-zinc-900 rounded p-3 mb-2">
      <div className="font-semibold text-luxe-gold-accent mb-1">{title}</div>
      {items.length === 0 ? (
        <div className="text-zinc-400 text-sm">None</div>
      ) : (
        <ul className="text-xs text-zinc-200 space-y-1">
          {items.map((item, idx) => (
            <li key={item.id || idx}>{item.id?.slice(0, 8) ?? "-"} <span className="text-zinc-400">{item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</span></li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminDashboard; 