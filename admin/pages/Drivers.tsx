import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Driver, Vehicle, ServiceRequest } from '../types';
import { Search, MoreVertical, Star, Users, Radio, FileCheck, AlertTriangle, TrendingUp, TrendingDown, Bell, Plus, Filter } from 'lucide-react';

interface DriverWithMetrics extends Driver {
  vehicle?: Vehicle;
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  completionRate: number;
  onboardingProgress: number;
  complaintsCount: number;
  ratingCount: number;
  reviewCount: number;
}

interface DriverStats {
  totalDrivers: number;
  activeNow: number;
  pendingApproval: number;
  reportedIssues: number;
  totalTrend: number;
  activeTrend: number;
  pendingTrend: number;
  issuesTrend: number;
}

export function Drivers() {
  const [drivers, setDrivers] = useState<DriverWithMetrics[]>([]);
  const [stats, setStats] = useState<DriverStats>({
    totalDrivers: 0,
    activeNow: 0,
    pendingApproval: 0,
    reportedIssues: 0,
    totalTrend: 0,
    activeTrend: 0,
    pendingTrend: 0,
    issuesTrend: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 10;

  useEffect(() => {
    fetchDrivers();
    fetchStats();

    const channel = supabase
      .channel('drivers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'drivers',
        },
        () => {
          fetchDrivers();
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all drivers
      const { data: allDrivers } = await supabase.from('drivers').select('status, is_online');

      // Fetch disputes/escalations linked to drivers
      const { data: disputes } = await supabase
        .from('disputes')
        .select('*')
        .in('status', ['open', 'under_review']);

      const drivers = allDrivers || [];
      const totalDrivers = drivers.length;
      const activeNow = drivers.filter((d: any) => d.is_online && d.status === 'active').length;
      const pendingApproval = drivers.filter((d: any) => d.status === 'pending').length;
      const reportedIssues = disputes?.length || 0;

      // Calculate trends (mock for now - would need historical data)
      const totalTrend = 5.2;
      const activeTrend = 12;
      const pendingTrend = -2;
      const issuesTrend = 1;

      setStats({
        totalDrivers,
        activeNow,
        pendingApproval,
        reportedIssues,
        totalTrend,
        activeTrend,
        pendingTrend,
        issuesTrend,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const { data: driversData, error } = await supabase
        .from('drivers')
        .select('*, user:users(*), vehicle:vehicles(*)')
        .order('last_updated', { ascending: false });

      if (error) throw error;

      // Fetch metrics for each driver
      const driversWithMetrics = await Promise.all(
        (driversData || []).map(async (driver) => {
          // Fetch service requests for this driver
          const { data: serviceRequests } = await supabase
            .from('service_requests')
            .select('*')
            .eq('assigned_driver_id', driver.id);

          // Fetch feedback/ratings for this driver
          const { data: feedbackData } = await supabase
            .from('feedback')
            .select('rating')
            .eq('driver_id', driver.id)
            .not('rating', 'is', null);

          // Fetch disputes for this driver's rides
          const { data: disputes } = await supabase
            .from('disputes')
            .select('*')
            .in('service_request_id', (serviceRequests || []).map((sr: any) => sr.id));

          const rides = serviceRequests || [];
          const totalRides = rides.length;
          const completedRides = rides.filter((r: any) => r.status === 'completed').length;
          const cancelledRides = rides.filter((r: any) => r.status === 'cancelled').length;
          const completionRate = totalRides > 0 ? Math.round((completedRides / totalRides) * 100) : 0;

          // Calculate onboarding progress (mock - would need actual onboarding steps)
          const onboardingProgress =
            driver.status === 'pending'
              ? driver.training_status === 'completed'
                ? 80
                : driver.background_check_status === 'approved'
                ? 60
                : 40
              : 100;

          // Complaints count
          const complaintsCount = disputes?.length || 0;

          // Rating and review count
          const ratings: number[] = (feedbackData || []).map((fb: any) => fb.rating).filter((r: number) => r && r > 0);
          const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
          const ratingCount = ratings.length;

          return {
            ...driver,
            totalRides,
            completedRides,
            cancelledRides,
            completionRate,
            onboardingProgress,
            complaintsCount,
            ratingCount,
            reviewCount: ratingCount,
            rating: avgRating > 0 ? avgRating : driver.rating || 0,
          };
        })
      );

      setDrivers(driversWithMetrics);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      !searchQuery ||
      driver.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.license_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.vehicle?.license_plate?.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'all') {
      matchesStatus = true;
    } else if (statusFilter === 'active') {
      matchesStatus = driver.status === 'active' && driver.is_online;
    } else if (statusFilter === 'pending') {
      matchesStatus = driver.status === 'pending';
    } else if (statusFilter === 'blocked') {
      matchesStatus = driver.status === 'suspended';
    }

    return matchesSearch && matchesStatus;
  });

  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * driversPerPage,
    currentPage * driversPerPage
  );

  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#9dabb9]">Loading drivers...</p>
        </div>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string, isOnline?: boolean) => {
    if (status === 'suspended') {
      return 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20';
    }
    if (status === 'pending') {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20';
    }
    if (status === 'active' && isOnline) {
      return 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
  };

  const getPerformanceType = (driver: DriverWithMetrics) => {
    if (driver.status === 'pending') {
      return { type: 'onboarding', value: driver.onboardingProgress, color: 'bg-yellow-500' };
    }
    if (driver.complaintsCount > 5) {
      return { type: 'complaints', value: 100, color: 'bg-red-500', label: 'High' };
    }
    return { type: 'completion', value: driver.completionRate, color: 'bg-green-500' };
  };

  const getPerformanceLabel = (driver: DriverWithMetrics) => {
    if (driver.status === 'pending') {
      return 'Onboarding';
    }
    if (driver.complaintsCount > 5) {
      return 'Complaints';
    }
    return 'Completion';
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-[#283039] bg-[#111418] shrink-0 z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">Driver Management</h2>
          <span className="px-2 py-0.5 rounded bg-[#283039] text-xs text-[#9dabb9] border border-[#3b4754]">
            v2.4.0
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg text-[#9dabb9] hover:bg-[#283039] transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-[#111418]"></span>
          </button>
          <Button className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-primary/25">
            <Plus className="h-5 w-5" />
            <span>Add New Driver</span>
          </Button>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Drivers */}
            <div className="bg-[#1c2127] p-5 rounded-xl border border-[#283039] shadow-sm flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <p className="text-[#9dabb9] text-sm font-medium">Total Drivers</p>
                <div className="text-primary bg-primary/10 p-1.5 rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-end gap-2 mt-2">
                <h3 className="text-3xl font-bold text-white">{stats.totalDrivers.toLocaleString()}</h3>
                <span className="flex items-center text-xs font-medium text-green-500 mb-1.5">
                  <TrendingUp className="h-3 w-3" />
                  {stats.totalTrend > 0 ? '+' : ''}
                  {stats.totalTrend}%
                </span>
              </div>
              <p className="text-xs text-[#9dabb9] mt-1">vs last month</p>
            </div>

            {/* Active Now */}
            <div className="bg-[#1c2127] p-5 rounded-xl border border-[#283039] shadow-sm flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <p className="text-[#9dabb9] text-sm font-medium">Active Now</p>
                <div className="text-green-500 bg-green-500/10 p-1.5 rounded-lg">
                  <Radio className="h-5 w-5 fill-green-500" />
                </div>
              </div>
              <div className="flex items-end gap-2 mt-2">
                <h3 className="text-3xl font-bold text-white">{stats.activeNow.toLocaleString()}</h3>
                <span className="flex items-center text-xs font-medium text-green-500 mb-1.5">
                  <TrendingUp className="h-3 w-3" />
                  +{stats.activeTrend}%
                </span>
              </div>
              <p className="text-xs text-[#9dabb9] mt-1">Currently online</p>
            </div>

            {/* Pending Approval */}
            <div className="bg-[#1c2127] p-5 rounded-xl border border-[#283039] shadow-sm flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <p className="text-[#9dabb9] text-sm font-medium">Pending Approval</p>
                <div className="text-orange-500 bg-orange-500/10 p-1.5 rounded-lg">
                  <FileCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-end gap-2 mt-2">
                <h3 className="text-3xl font-bold text-white">{stats.pendingApproval}</h3>
                <span className="flex items-center text-xs font-medium text-red-500 mb-1.5">
                  <TrendingDown className="h-3 w-3" />
                  {Math.abs(stats.pendingTrend)}%
                </span>
              </div>
              <p className="text-xs text-[#9dabb9] mt-1">Needs review</p>
            </div>

            {/* Reported Issues */}
            <div className="bg-[#1c2127] p-5 rounded-xl border border-[#283039] shadow-sm flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <p className="text-[#9dabb9] text-sm font-medium">Reported Issues</p>
                <div className="text-red-500 bg-red-500/10 p-1.5 rounded-lg">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-end gap-2 mt-2">
                <h3 className="text-3xl font-bold text-white">{stats.reportedIssues}</h3>
                <span className="flex items-center text-xs font-medium text-red-500 mb-1.5">
                  <TrendingUp className="h-3 w-3" />
                  +{stats.issuesTrend}%
                </span>
              </div>
              <p className="text-xs text-[#9dabb9] mt-1">Requires action</p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-[#1c2127] p-4 rounded-xl border border-[#283039] shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-1 w-full md:w-auto gap-3">
              <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9dabb9] group-focus-within:text-primary transition-colors h-5 w-5" />
                <Input
                  className="w-full h-10 pl-10 pr-4 bg-[#111418] border border-[#283039] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-[#9dabb9]"
                  placeholder="Search by name, email, or license plate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="h-10 px-4 flex items-center gap-2 border border-[#283039] rounded-lg bg-[#111418] text-[#9dabb9] hover:bg-[#283039] transition-colors"
              >
                <Filter className="h-5 w-5" />
                Filters
              </Button>
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-transparent text-[#9dabb9] border border-[#283039] hover:border-[#3b4754]'
                }`}
              >
                All Drivers
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === 'active'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-transparent text-[#9dabb9] border border-[#283039] hover:border-[#3b4754]'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-transparent text-[#9dabb9] border border-[#283039] hover:border-[#3b4754]'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('blocked')}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === 'blocked'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-transparent text-[#9dabb9] border border-[#283039] hover:border-[#3b4754]'
                }`}
              >
                Blocked
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#1c2127] rounded-xl border border-[#283039] shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#283039] bg-[#141a22]">
                    <th className="p-4 pl-6 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                      Driver
                    </th>
                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                      Vehicle Details
                    </th>
                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="p-4 pr-6 text-right text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#283039]">
                  {paginatedDrivers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#9dabb9]">
                        No drivers found
                      </td>
                    </tr>
                  ) : (
                    paginatedDrivers.map((driver) => {
                      const performance = getPerformanceType(driver);
                      const performanceLabel = getPerformanceLabel(driver);

                      return (
                        <tr
                          key={driver.id}
                          className="group hover:bg-[#141a22] transition-colors"
                        >
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              {driver.user?.avatar_url || driver.user?.profile_photo ? (
                                <div
                                  className="h-10 w-10 rounded-full bg-cover bg-center ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
                                  style={{
                                    backgroundImage: `url(${driver.user.avatar_url || driver.user.profile_photo})`,
                                  }}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-[#283039] flex items-center justify-center text-white ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                  <span className="text-sm font-bold">
                                    {driver.user?.full_name?.charAt(0).toUpperCase() || 'D'}
                                  </span>
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-white">
                                  {driver.user?.full_name || 'Unknown Driver'}
                                </span>
                                <span className="text-xs text-[#9dabb9]">
                                  {driver.user?.email || 'No email'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            {driver.vehicle ? (
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-white">
                                  {driver.vehicle.make} {driver.vehicle.model}
                                </span>
                                <span className="text-xs text-[#9dabb9] font-mono">
                                  {driver.vehicle.license_plate || 'N/A'} •{' '}
                                  {driver.vehicle.color || 'N/A'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-[#9dabb9]">No vehicle assigned</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                                driver.status || 'inactive',
                                driver.is_online
                              )}`}
                            >
                              {driver.status === 'active' && driver.is_online
                                ? 'Active'
                                : driver.status === 'pending'
                                ? 'Pending'
                                : driver.status === 'suspended'
                                ? 'Suspended'
                                : 'Offline'}
                            </span>
                          </td>
                          <td className="p-4">
                            {driver.ratingCount > 0 && driver.rating > 0 ? (
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-white">
                                  {driver.rating.toFixed(1)}
                                </span>
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs text-[#9dabb9]">({driver.reviewCount})</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-white">--</span>
                                <span className="text-xs text-[#9dabb9]">New Driver</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-1 w-32">
                              <div className="flex justify-between text-xs">
                                <span className="text-[#9dabb9]">{performanceLabel}</span>
                                <span
                                  className={`font-medium ${
                                    performance.type === 'complaints' ? 'text-red-500' : 'text-white'
                                  }`}
                                >
                                  {performance.type === 'complaints' ? performance.label : `${performance.value}%`}
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-[#283039] rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${performance.color} rounded-full transition-all`}
                                  style={{ width: `${performance.value}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            {driver.status === 'pending' ? (
                              <Button className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm">
                                Review
                              </Button>
                            ) : (
                              <button className="p-2 rounded-lg text-[#9dabb9] hover:text-white hover:bg-[#283039] transition-colors">
                                <MoreVertical className="h-5 w-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-[#283039] flex items-center justify-between">
              <span className="text-sm text-[#9dabb9]">
                Showing <span className="font-semibold text-white">
                  {(currentPage - 1) * driversPerPage + 1}-{Math.min(currentPage * driversPerPage, filteredDrivers.length)}
                </span>{' '}
                of <span className="font-semibold text-white">{filteredDrivers.length}</span> drivers
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="px-3 py-1.5 border border-[#283039] rounded-md text-sm text-[#9dabb9] hover:bg-[#283039] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className="px-3 py-1.5 border border-[#283039] rounded-md text-sm text-[#9dabb9] hover:bg-[#283039] transition-colors"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
