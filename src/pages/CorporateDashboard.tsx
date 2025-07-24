import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Bar, Line } from 'react-chartjs-2';
import { Chart, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const CorporateDashboard = () => {
  const [user, setUser] = useState(null);
  const [corporateAccountId, setCorporateAccountId] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: profile } = await supabase.from("users").select("corporate_account_id").eq("id", data.user.id).single();
        setCorporateAccountId(profile?.corporate_account_id);
      }
    });
  }, []);

  // Fetch dashboard data
  const fetchDashboard = useCallback(async () => {
    if (!corporateAccountId) return { bookings: [], approvals: [], payments: [], team: [] };
    const { data: bookings } = await supabase.from("trips").select("id, trip_status, requested_at").eq("corporate_account_id", corporateAccountId);
    const { data: approvals } = await supabase.from("trips").select("id").eq("corporate_account_id", corporateAccountId).eq("trip_status", "pending_approval");
    const { data: payments } = await supabase.from("payments").select("amount, processed_at").eq("corporate_invoice_id", corporateAccountId);
    const { data: team } = await supabase.from("users").select("id").eq("corporate_account_id", corporateAccountId);
    return { bookings: bookings || [], approvals: approvals || [], payments: payments || [], team: team || [] };
  }, [corporateAccountId]);

  const { data = { bookings: [], approvals: [], payments: [], team: [] }, isLoading, isError, error } = useQuery({
    queryKey: ["corporate-dashboard", corporateAccountId],
    queryFn: fetchDashboard,
    enabled: !!corporateAccountId,
  });

  // Stats
  const totalBookings = data.bookings.length;
  const pendingApprovals = data.approvals.length;
  const totalSpend = data.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const teamSize = data.team.length;

  // Recent activity (last 5 bookings)
  const recentBookings = [...data.bookings]
    .sort((a, b) => {
      const dateA = a.requested_at ? new Date(a.requested_at).getTime() : 0;
      const dateB = b.requested_at ? new Date(b.requested_at).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  // Monthly Spend Chart Data
  const monthlySpend = {};
  data.payments.forEach(p => {
    if (!p.processed_at) return;
    const d = new Date(p.processed_at);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    monthlySpend[key] = (monthlySpend[key] || 0) + Number(p.amount || 0);
  });
  const chartData = {
    labels: Object.keys(monthlySpend),
    datasets: [
      {
        label: 'Monthly Spend',
        data: Object.values(monthlySpend),
        backgroundColor: '#FFD700',
      },
    ],
  };

  // Booking Trends Line Chart Data
  const monthlyBookings = {};
  data.bookings.forEach(b => {
    if (!b.requested_at) return;
    const d = new Date(b.requested_at);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    monthlyBookings[key] = (monthlyBookings[key] || 0) + 1;
  });
  const bookingTrendsData = {
    labels: Object.keys(monthlyBookings),
    datasets: [
      {
        label: 'Bookings per Month',
        data: Object.values(monthlyBookings),
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white px-2 sm:px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-luxe-gold-accent">Corporate Dashboard</h1>
      {isLoading ? (
        <div className="text-zinc-400">Loading...</div>
      ) : isError ? (
        <div className="text-red-400">Error: {error.message}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-8">
            <StatCard label="Total Bookings" value={totalBookings} />
            <StatCard label="Pending Approvals" value={pendingApprovals} />
            <StatCard label="Total Spend" value={`Ksh ${totalSpend.toLocaleString()}`} />
            <StatCard label="Team Size" value={teamSize} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-8">
            <QuickLink to="/team-bookings" label="Team Bookings" />
            <QuickLink to="/approvals" label="Approvals" />
            <QuickLink to="/reports" label="Reports" />
            <QuickLink to="/manage-team" label="Manage Team" />
          </div>
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-luxe-gold-accent">Recent Bookings</h2>
            {recentBookings.length === 0 ? (
              <div className="text-zinc-400">No recent bookings.</div>
            ) : (
              <ul className="space-y-2">
                {recentBookings.map(b => (
                  <li key={b.id} className="bg-zinc-900 rounded p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <span className="font-semibold">{b.trip_status.replace("_", " ").toUpperCase()}</span>
                    <span className="text-xs text-zinc-400 mt-1 sm:mt-0">{b.requested_at ? new Date(b.requested_at).toLocaleString() : "-"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-luxe-gold-accent">Monthly Spend (Chart)</h2>
            <div className="bg-zinc-900 rounded p-6 mb-6">
              <Bar data={chartData} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-luxe-gold-accent">Booking Trends (Chart)</h2>
            <div className="bg-zinc-900 rounded p-6">
              <Line data={bookingTrendsData} />
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

export default CorporateDashboard; 