import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Bell,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Car,
  DollarSign,
  Star,
  X,
  Calendar,
  Filter,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatDate } from '../utils/format';
import type { ServiceRequest, PackageSubscription } from '../types';

interface RideStats {
  totalRides: number;
  totalRevenue: number;
  avgRating: number;
  cancellationRate: number;
  totalRidesTrend: number;
  revenueTrend: number;
  ratingTrend: number;
  cancellationTrend: number;
}

interface RideWithDetails extends ServiceRequest {
  user?: any;
  driver?: any;
  vehicle?: any;
  subscription?: PackageSubscription;
  calculatedFare?: number;
  rating?: number;
}

export function Rides() {
  const [stats, setStats] = useState<RideStats>({
    totalRides: 0,
    totalRevenue: 0,
    avgRating: 0,
    cancellationRate: 0,
    totalRidesTrend: 0,
    revenueTrend: 0,
    ratingTrend: 0,
    cancellationTrend: 0,
  });
  const [rides, setRides] = useState<RideWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('30');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ridesPerPage = 10;

  useEffect(() => {
    fetchStats();
  }, [dateFilter]);

  useEffect(() => {
    fetchRides();
  }, [dateFilter, statusFilter]);

  useEffect(() => {
    // Search is handled client-side, no need to refetch
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchStats = async () => {
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      if (dateFilter === '7') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (dateFilter === '30') {
        startDate.setDate(endDate.getDate() - 30);
      } else if (dateFilter === '90') {
        startDate.setDate(endDate.getDate() - 90);
      } else {
        startDate.setMonth(endDate.getMonth() - 1);
      }

      // Fetch service requests
      const { data: serviceRequests } = await supabase
        .from('service_requests')
        .select('*, user:users(*), driver:drivers(*)')
        .gte('created_at', startDate.toISOString());

      // Fetch subscription payments for revenue
      const { data: payments } = await supabase
        .from('subscription_payments')
        .select('amount')
        .eq('status', 'paid')
        .gte('created_at', startDate.toISOString());

      // Fetch feedback for ratings
      const { data: feedback } = await supabase
        .from('feedback')
        .select('rating, service_request_id')
        .gte('created_at', startDate.toISOString())
        .not('rating', 'is', null);

      const rides = serviceRequests || [];
      const totalRides = rides.length;
      const completedRides = rides.filter((r: any) => r.status === 'completed').length;
      const cancelledRides = rides.filter((r: any) => r.status === 'cancelled').length;
      const cancellationRate = totalRides > 0 ? (cancelledRides / totalRides) * 100 : 0;

      // Calculate revenue from subscription payments
      const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      // Calculate average rating
      const ratings = feedback?.map((f: any) => f.rating).filter((r: number) => r && r > 0) || [];
      const avgRating = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0;

      // Calculate trends (mock for now - would need historical data)
      const totalRidesTrend = 12;
      const revenueTrend = 8;
      const ratingTrend = 0.1;
      const cancellationTrend = -0.5;

      setStats({
        totalRides,
        totalRevenue,
        avgRating,
        cancellationRate,
        totalRidesTrend,
        revenueTrend,
        ratingTrend,
        cancellationTrend,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRides = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('service_requests')
        .select(`
          *,
          user:users(*),
          driver:drivers(*, user:users(*)),
          vehicle:vehicles(*),
          subscription:package_subscriptions(*)
        `)
        .order('created_at', { ascending: false });

      // Apply date filter
      if (dateFilter !== 'all') {
        const endDate = new Date();
        const startDate = new Date();
        if (dateFilter === '7') {
          startDate.setDate(endDate.getDate() - 7);
        } else if (dateFilter === '30') {
          startDate.setDate(endDate.getDate() - 30);
        } else if (dateFilter === '90') {
          startDate.setDate(endDate.getDate() - 90);
        }
        query = query.gte('created_at', startDate.toISOString());
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch ratings for each ride
      const ridesWithRatings = await Promise.all(
        (data || []).map(async (ride: any) => {
          const { data: feedbackData } = await supabase
            .from('feedback')
            .select('rating')
            .eq('service_request_id', ride.id)
            .single();

          // Calculate fare allocation based on subscription
          // For subscription model: fare = subscription.monthly_fee / rides_included
          let calculatedFare = 0;
          if (ride.subscription && ride.subscription.monthly_fee && ride.subscription.rides_included) {
            calculatedFare = ride.subscription.monthly_fee / ride.subscription.rides_included;
          }

          return {
            ...ride,
            rating: feedbackData?.rating || null,
            calculatedFare,
          };
        })
      );

      setRides(ridesWithRatings);
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply search filter client-side
  const filteredRides = rides.filter((ride: RideWithDetails) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      ride.id?.toLowerCase().includes(query) ||
      ride.user?.full_name?.toLowerCase().includes(query) ||
      ride.driver?.user?.full_name?.toLowerCase().includes(query) ||
      ride.pickup_address?.toLowerCase().includes(query) ||
      ride.destination_address?.toLowerCase().includes(query)
    );
  });

  const paginatedRides = filteredRides.slice((currentPage - 1) * ridesPerPage, currentPage * ridesPerPage);
  const totalPages = Math.ceil(filteredRides.length / ridesPerPage);

  const exportToCSV = () => {
    const headers = ['Ride ID', 'Date & Time', 'Route', 'Driver', 'Rider', 'Fare', 'Status', 'Rating'];
    const rows = rides.map((ride) => [
      ride.id?.substring(0, 8) || 'N/A',
      ride.created_at ? new Date(ride.created_at).toLocaleString() : 'N/A',
      `${ride.pickup_address || 'N/A'} → ${ride.destination_address || 'N/A'}`,
      ride.driver?.user?.full_name || 'N/A',
      ride.user?.full_name || 'N/A',
      ride.calculatedFare ? `KES ${ride.calculatedFare.toFixed(2)}` : 'N/A',
      ride.status || 'N/A',
      ride.rating ? ride.rating.toFixed(1) : 'N/A',
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ride-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; bg: string; border: string }> = {
      completed: {
        color: 'text-[#0bda5b]',
        bg: 'bg-[#0bda5b]/10',
        border: 'border-[#0bda5b]/20',
      },
      in_progress: {
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
      },
      cancelled: {
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
      },
      disputed: {
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
      },
    };

    const config = statusConfig[status] || {
      color: 'text-gray-500',
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/20',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color} border ${config.border}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  // Calculate ride status breakdown (from all rides, not filtered)
  const statusBreakdown = {
    completed: rides.filter((r) => r.status === 'completed').length,
    ongoing: rides.filter((r) => r.status === 'in_progress').length,
    cancelled: rides.filter((r) => r.status === 'cancelled').length,
    disputed: rides.filter((r) => r.status === 'disputed').length,
  };
  const totalForBreakdown = rides.length || 1;
  const completedPercent = (statusBreakdown.completed / totalForBreakdown) * 100;
  const ongoingPercent = (statusBreakdown.ongoing / totalForBreakdown) * 100;
  const cancelledPercent = (statusBreakdown.cancelled / totalForBreakdown) * 100;
  const disputedPercent = (statusBreakdown.disputed / totalForBreakdown) * 100;

  if (loading && rides.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#9dabb9]">Loading ride analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-[#283039] bg-[#111418] px-8 py-4 flex-shrink-0">
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-3 text-white">
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold leading-tight">Analytics Dashboard</h2>
          </div>
          {/* Search Bar */}
          <div className="hidden md:flex flex-col min-w-[300px]">
            <div className="flex w-full items-center rounded-lg bg-[#283039] border border-transparent focus-within:border-primary/50 transition-colors">
              <Search className="ml-3 text-[#9dabb9] h-5 w-5" />
              <Input
                className="w-full bg-transparent border-none text-sm text-white placeholder:text-[#9dabb9] focus:ring-0 h-10"
                placeholder="Search ride ID, driver, or route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          <div className="flex gap-2">
            <button className="flex items-center justify-center rounded-full size-10 hover:bg-[#283039] text-white transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-[#111418]"></span>
            </button>
            <button className="flex items-center justify-center rounded-full size-10 hover:bg-[#283039] text-white transition-colors">
              <MessageSquare className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          {/* Page Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-3xl font-black leading-tight">Ride Analytics</h1>
            <p className="text-[#9dabb9] text-base font-normal">
              Monitor real-time performance, revenue streams, and operational metrics.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Rides */}
            <div className="flex flex-col gap-2 rounded-xl p-5 border border-[#3b4754] bg-[#1c2127] shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-[#9dabb9] text-sm font-medium">Total Rides</p>
                <Car className="text-primary h-6 w-6" />
              </div>
              <p className="text-white text-2xl font-bold">{stats.totalRides.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-[#0bda5b] text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                <span>
                  +{stats.totalRidesTrend}% <span className="text-[#9dabb9] font-normal">vs last month</span>
                </span>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="flex flex-col gap-2 rounded-xl p-5 border border-[#3b4754] bg-[#1c2127] shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-[#9dabb9] text-sm font-medium">Total Revenue</p>
                <DollarSign className="text-primary h-6 w-6" />
              </div>
              <p className="text-white text-2xl font-bold">
                KES {stats.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <div className="flex items-center gap-1 text-[#0bda5b] text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                <span>
                  +{stats.revenueTrend}% <span className="text-[#9dabb9] font-normal">vs last month</span>
                </span>
              </div>
            </div>

            {/* Avg Rating */}
            <div className="flex flex-col gap-2 rounded-xl p-5 border border-[#3b4754] bg-[#1c2127] shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-[#9dabb9] text-sm font-medium">Avg Rating</p>
                <Star className="text-yellow-500 h-6 w-6 fill-yellow-500" />
              </div>
              <p className="text-white text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
              <div className="flex items-center gap-1 text-[#0bda5b] text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                <span>
                  +{stats.ratingTrend}% <span className="text-[#9dabb9] font-normal">vs last month</span>
                </span>
              </div>
            </div>

            {/* Cancellation Rate */}
            <div className="flex flex-col gap-2 rounded-xl p-5 border border-[#3b4754] bg-[#1c2127] shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-[#9dabb9] text-sm font-medium">Cancellation Rate</p>
                <X className="text-red-500 h-6 w-6" />
              </div>
              <p className="text-white text-2xl font-bold">{stats.cancellationRate.toFixed(1)}%</p>
              <div className="flex items-center gap-1 text-[#fa6238] text-sm font-medium">
                <TrendingDown className="h-4 w-4" />
                <span>
                  {stats.cancellationTrend}% <span className="text-[#9dabb9] font-normal">vs last month</span>
                </span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Revenue Overview Chart Placeholder */}
            <div className="xl:col-span-2 rounded-xl p-6 border border-[#3b4754] bg-[#1c2127] shadow-sm">
              <div className="flex justify-between items-end mb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
                  <p className="text-sm text-[#9dabb9]">Daily revenue performance over the last 30 days</p>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  KES {(stats.totalRevenue / 1000).toFixed(0)}k
                </h3>
              </div>
              <div className="relative w-full h-[250px] flex items-center justify-center text-[#9dabb9]">
                <p className="text-sm">Chart visualization coming soon</p>
              </div>
            </div>

            {/* Ride Status Breakdown */}
            <div className="flex flex-col gap-4 rounded-xl p-6 border border-[#3b4754] bg-[#1c2127] shadow-sm">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-white">Ride Status</h3>
                <p className="text-sm text-[#9dabb9]">Breakdown by status</p>
              </div>
              <div className="flex flex-col gap-6 mt-2">
                <div className="space-y-4">
                  {/* Completed */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-300">Completed</span>
                      <span className="text-sm font-bold text-white">{completedPercent.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-[#283039] rounded-full h-2">
                      <div className="bg-[#0bda5b] h-2 rounded-full" style={{ width: `${completedPercent}%` }}></div>
                    </div>
                  </div>

                  {/* Ongoing */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-300">Ongoing</span>
                      <span className="text-sm font-bold text-white">{ongoingPercent.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-[#283039] rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${ongoingPercent}%` }}></div>
                    </div>
                  </div>

                  {/* Cancelled */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-300">Cancelled</span>
                      <span className="text-sm font-bold text-white">{cancelledPercent.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-[#283039] rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${cancelledPercent}%` }}></div>
                    </div>
                  </div>

                  {/* Disputed */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-300">Disputed</span>
                      <span className="text-sm font-bold text-white">{disputedPercent.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-[#283039] rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${disputedPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-[#1c2127] p-4 rounded-xl border border-[#3b4754] shadow-sm">
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              {/* Date Filter */}
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="pl-10 pr-8 py-2.5 bg-[#283039] border-[#3b4754] text-white min-w-[160px]">
                  <Calendar className="absolute left-3 h-5 w-5 text-[#9dabb9]" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="pl-4 pr-10 py-2.5 bg-[#283039] border-[#3b4754] text-white">
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status: All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in_progress">Ongoing</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#283039] border-[#3b4754] text-white hover:bg-[#323c46]"
              >
                <Filter className="h-5 w-5" />
                More Filters
              </Button>
              <Button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary/90" onClick={exportToCSV}>
                <Download className="h-5 w-5" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="rounded-xl border border-[#3b4754] overflow-hidden bg-[#1c2127] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1A222C] border-b border-[#3b4754]">
                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Ride ID</th>
                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Date & Time</th>
                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Route</th>
                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Driver</th>
                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">Rider</th>
                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-right">Fare</th>
                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-center">Status</th>
                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-right">Rating</th>
                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#283039]">
                  {paginatedRides.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-[#9dabb9]">
                        No rides found
                      </td>
                    </tr>
                  ) : (
                    paginatedRides.map((ride) => (
                      <tr key={ride.id} className="hover:bg-[#283039]/50 transition-colors group cursor-pointer">
                        <td className="p-4 text-sm font-medium text-primary">
                          #{ride.id?.substring(0, 8).toUpperCase() || 'N/A'}
                        </td>
                        <td className="p-4 text-sm text-gray-300">
                          {ride.created_at ? (
                            <>
                              {formatDate(ride.created_at)}
                              <br />
                              <span className="text-xs text-[#9dabb9]">
                                {new Date(ride.created_at).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="p-4 text-sm text-gray-300">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            <span className="truncate max-w-[150px]">{ride.pickup_address || 'N/A'}</span>
                          </div>
                          <div className="h-4 border-l border-dashed border-gray-600 ml-1"></div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#0bda5b]"></span>
                            <span className="truncate max-w-[150px]">{ride.destination_address || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {ride.driver?.user ? (
                            <div className="flex items-center gap-2">
                              {ride.driver.user.avatar_url || ride.driver.user.profile_photo ? (
                                <div
                                  className="size-8 rounded-full bg-cover bg-center"
                                  style={{
                                    backgroundImage: `url(${ride.driver.user.avatar_url || ride.driver.user.profile_photo})`,
                                  }}
                                />
                              ) : (
                                <div className="size-8 rounded-full bg-[#283039] flex items-center justify-center">
                                  <span className="text-xs font-bold text-white">
                                    {ride.driver.user.full_name?.charAt(0).toUpperCase() || 'D'}
                                  </span>
                                </div>
                              )}
                              <span className="text-sm font-medium text-white">
                                {ride.driver.user.full_name || 'Unknown'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-[#9dabb9]">Unassigned</span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-gray-300">{ride.user?.full_name || 'N/A'}</td>
                        <td className="p-4 text-sm font-bold text-white text-right">
                          {ride.calculatedFare ? `KES ${ride.calculatedFare.toFixed(2)}` : 'N/A'}
                        </td>
                        <td className="p-4 text-center">{getStatusBadge(ride.status || 'pending')}</td>
                        <td className="p-4 text-right">
                          {ride.rating ? (
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-sm font-bold text-white">{ride.rating.toFixed(1)}</span>
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            </div>
                          ) : (
                            <span className="text-xs text-[#9dabb9]">-</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-[#9dabb9] hover:text-primary transition-colors">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-[#3b4754] flex items-center justify-between bg-[#1A222C]">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-[#9dabb9]">
                    Showing <span className="font-medium text-white">
                      {(currentPage - 1) * ridesPerPage + 1}
                    </span>{' '}
                    to <span className="font-medium text-white">
                      {Math.min(currentPage * ridesPerPage, rides.length)}
                    </span>{' '}
                    of <span className="font-medium text-white">{filteredRides.length}</span> results
                  </p>
                </div>
                <div>
                  <nav aria-label="Pagination" className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[#3b4754] bg-[#283039] text-sm font-medium text-gray-300 hover:bg-[#1F2937] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {[...Array(Math.min(totalPages, 10))].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-primary/10 border-primary text-primary'
                              : 'bg-[#283039] border-[#3b4754] text-gray-300 hover:bg-[#1F2937]'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    {totalPages > 10 && (
                      <>
                        <span className="relative inline-flex items-center px-4 py-2 border border-[#3b4754] bg-[#283039] text-sm font-medium text-gray-300">
                          ...
                        </span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="relative inline-flex items-center px-4 py-2 border border-[#3b4754] bg-[#283039] text-sm font-medium text-gray-300 hover:bg-[#1F2937]"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[#3b4754] bg-[#283039] text-sm font-medium text-gray-300 hover:bg-[#1F2937] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

