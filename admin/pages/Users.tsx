import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate } from '../utils/format';
import type { User, PackageSubscription, ServiceRequest } from '../types';
import { Search, X, Edit, Ban, Star, MapPin, MoreVertical } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserWithMetrics extends User {
  subscription?: PackageSubscription;
  totalRides: number;
  avgRating: number;
  cancelRate: number;
  totalSpent: number;
  status: 'active' | 'pending' | 'suspended';
  location?: string;
  recentActivity: ActivityItem[];
  currentRide?: ServiceRequest;
}

interface ActivityItem {
  id: string;
  type: 'ride_started' | 'ride_completed' | 'ticket_opened';
  timestamp: string;
  title: string;
  description?: string;
  metadata?: {
    fare?: number;
    duration?: number;
    ticketId?: string;
    location?: string;
  };
}

export function Users() {
  const [users, setUsers] = useState<UserWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [rideCountFilter, setRideCountFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserWithMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'payment' | 'issues'>('history');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel('users_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
        },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentPage, statusFilter, rideCountFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch metrics for each user
      const usersWithMetrics = await Promise.all(
        (usersData || []).map(async (user) => {
          // Fetch subscription
          const { data: subscriptionData } = await supabase
            .from('package_subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

          // Fetch service requests for this user
          const { data: serviceRequests } = await supabase
            .from('service_requests')
            .select('*')
            .eq('user_id', user.id);

          // Fetch feedback/ratings for this user (from feedback table if it exists)
          const { data: feedbackData } = await supabase
            .from('feedback')
            .select('rating')
            .eq('user_id', user.id)
            .not('rating', 'is', null);

          const rides = serviceRequests || [];
          const completedRides = rides.filter((r: any) => r.status === 'completed');
          const cancelledRides = rides.filter((r: any) => r.status === 'cancelled');
          const totalRides = completedRides.length;
          const cancelRate =
            rides.length > 0 ? ((cancelledRides.length / rides.length) * 100).toFixed(1) : '0';

          // Calculate average rating from feedback
          const ratings: number[] = (feedbackData || []).map((fb: any) => fb.rating).filter((r: number) => r && r > 0);
          const avgRating =
            ratings.length > 0
              ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
              : '0';

          // Calculate total spent (from subscription payments - for now use subscription fee)
          const totalSpent = subscriptionData?.monthly_fee || 0;

          // Fetch recent activity
          const recentRides = rides
            .sort((a: any, b: any) => {
              const dateA = new Date(a.created_at || a.requested_at).getTime();
              const dateB = new Date(b.created_at || b.requested_at).getTime();
              return dateB - dateA;
            })
            .slice(0, 10);

          const recentActivity: ActivityItem[] = recentRides.map((ride: any) => {
            if (ride.status === 'in_progress') {
              return {
                id: ride.id,
                type: 'ride_started',
                timestamp: ride.requested_at || ride.created_at,
                title: `Ride started from ${ride.pickup_address?.split(',')[0] || 'pickup location'}`,
                metadata: { location: ride.pickup_address },
              };
            } else if (ride.status === 'completed') {
              return {
                id: ride.id,
                type: 'ride_completed',
                timestamp: ride.updated_at || ride.created_at,
                title: `Completed ride to ${ride.destination_address?.split(',')[0] || 'destination'}`,
                metadata: { fare: totalSpent / (subscriptionData?.rides_included || 1) },
              };
            }
            return null;
          }).filter(Boolean) as ActivityItem[];

          // Check for current active ride
          const currentRide = rides.find((r: any) => r.status === 'in_progress' || r.status === 'assigned');

          // Determine user status
          let userStatus: 'active' | 'pending' | 'suspended' = 'active';
          if (subscriptionData?.status === 'suspended') userStatus = 'suspended';
          else if (!subscriptionData || subscriptionData.status === 'cancelled') userStatus = 'pending';

          return {
            ...user,
            subscription: subscriptionData as PackageSubscription | undefined,
            totalRides,
            avgRating: parseFloat(avgRating),
            cancelRate: parseFloat(cancelRate),
            totalSpent,
            status: userStatus,
            location: 'Nairobi, Kenya', // TODO: Get from user profile
            recentActivity,
            currentRide,
          };
        })
      );

      setUsers(usersWithMetrics);
      setTotalUsers(usersWithMetrics.length);

      // Auto-select first user if none selected
      if (!selectedUser && usersWithMetrics.length > 0) {
        setSelectedUser(usersWithMetrics[0]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    const matchesRideCount =
      rideCountFilter === 'all' ||
      (rideCountFilter === 'new' && user.totalRides < 5) ||
      (rideCountFilter === 'frequent' && user.totalRides >= 20) ||
      (rideCountFilter === 'vip' && user.totalRides >= 100);

    return matchesSearch && matchesStatus && matchesRideCount;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#9dabb9]">Loading users...</p>
        </div>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900/30 text-green-400 border-green-900/50';
      case 'suspended':
        return 'bg-red-900/30 text-red-400 border-red-900/50';
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-900/50';
      default:
        return 'bg-[#283039] text-[#9dabb9] border-[#3b4754]';
    }
  };

  const formatActivityTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return formatDate(dateString);
    }
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Header & Toolbar */}
      <header className="flex flex-col gap-4 p-6 border-b border-[#283039] bg-[#111418] shrink-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-3xl font-black leading-tight tracking-tight">
              User Management
            </h2>
            <p className="text-[#9dabb9] text-sm font-normal">Manage rider accounts, profiles, and history.</p>
          </div>
          <Button className="bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-lg shadow-blue-500/20">
            <span className="text-[20px]">+</span>
            <span>Add New User</span>
          </Button>
      </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap gap-4 items-center mt-2">
      {/* Search */}
          <div className="flex-1 min-w-[280px] max-w-[400px]">
            <div className="relative flex items-center h-10 w-full rounded-lg bg-[#283039] overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <div className="flex items-center justify-center pl-3 pr-2 text-[#9dabb9]">
                <Search className="h-5 w-5" />
              </div>
            <Input
                className="w-full h-full bg-transparent border-none text-white placeholder-[#9dabb9] text-sm focus:ring-0 px-0"
                placeholder="Search by Name, Email, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="min-w-[140px] h-10 bg-[#283039] border-transparent text-white text-sm">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1c2127] border-[#283039] text-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={rideCountFilter} onValueChange={setRideCountFilter}>
              <SelectTrigger className="min-w-[140px] h-10 bg-[#283039] border-transparent text-white text-sm">
                <SelectValue placeholder="Ride Count" />
              </SelectTrigger>
              <SelectContent className="bg-[#1c2127] border-[#283039] text-white">
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="new">New (&lt; 5)</SelectItem>
                <SelectItem value="frequent">Frequent (20+)</SelectItem>
                <SelectItem value="vip">VIP (100+)</SelectItem>
              </SelectContent>
            </Select>
                  </div>
              </div>
      </header>

      {/* Content Area: Split View */}
      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        {/* Left Side: User List Table */}
        <div className="flex-1 bg-[#111418] rounded-xl border border-[#283039] flex flex-col overflow-hidden shadow-sm">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1c2127] sticky top-0 z-10 border-b border-[#283039]">
                <tr>
                  <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                    User
                  </th>
                  <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider hidden lg:table-cell">
                    Contact
                  </th>
                  <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider hidden xl:table-cell">
                    Joined
                  </th>
                  <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-center">
                    Rides
                  </th>
                  <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-center">
                    Rating
                  </th>
                  <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#283039]">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#9dabb9]">
                      No users found
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => {
                    const isSelected = selectedUser?.id === user.id;
                    return (
                      <tr
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`group hover:bg-[#1c2127] transition-colors cursor-pointer border-l-2 ${
                          isSelected ? 'bg-[#1c2127]/50 border-primary' : 'border-transparent'
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {user.avatar_url || user.profile_photo ? (
                              <div
                                className="h-10 w-10 rounded-full bg-cover bg-center border border-[#283039]"
                                style={{
                                  backgroundImage: `url(${user.avatar_url || user.profile_photo})`,
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-[#283039] flex items-center justify-center text-[#9dabb9] border border-[#3b4754]">
                                <span className="text-sm font-bold">
                                  {user.full_name?.charAt(0).toUpperCase() ||
                                    user.email.charAt(0).toUpperCase()}
                                </span>
                </div>
              )}
                            <div>
                              <p className="text-white text-sm font-semibold">
                                {user.full_name || user.email}
                              </p>
                              <p className="text-[#9dabb9] text-xs lg:hidden">{user.email}</p>
                  </div>
                </div>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <p className="text-white text-sm">{user.email}</p>
                          <p className="text-[#9dabb9] text-xs">{user.phone || 'No phone'}</p>
                        </td>
                        <td className="p-4 hidden xl:table-cell">
                          <p className="text-[#9dabb9] text-sm">{formatDate(user.created_at)}</p>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#283039] text-white">
                            {user.totalRides}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {user.avgRating > 0 ? (
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-white text-sm font-medium">{user.avgRating.toFixed(1)}</span>
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            </div>
                          ) : (
                            <span className="text-white text-sm font-medium">--</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                              user.status
                            )}`}
                          >
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-[#9dabb9] hover:text-white p-1 rounded hover:bg-[#283039]">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
                </div>

          {/* Pagination */}
          <div className="bg-[#111418] p-4 border-t border-[#283039] flex items-center justify-between sticky bottom-0">
            <p className="text-[#9dabb9] text-sm">
              Showing {(currentPage - 1) * usersPerPage + 1}-{Math.min(currentPage * usersPerPage, filteredUsers.length)} of{' '}
              {filteredUsers.length} users
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="px-3 py-1 rounded bg-[#283039] text-white text-sm hover:bg-[#3b4754] disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <Button
                variant="ghost"
                className="px-3 py-1 rounded bg-[#283039] text-white text-sm hover:bg-[#3b4754]"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
      </div>

        {/* Right Side: Details Inspector */}
        {selectedUser && (
          <div className="hidden lg:flex flex-col w-[380px] bg-[#111418] rounded-xl border border-[#283039] shadow-xl overflow-hidden">
            {/* User Profile Header */}
            <div className="relative h-24 bg-gradient-to-r from-blue-900/40 to-purple-900/40">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 p-1 rounded-full backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 pb-6 -mt-10 relative">
              <div className="flex justify-between items-end mb-3">
                {selectedUser.avatar_url || selectedUser.profile_photo ? (
                  <div
                    className="h-20 w-20 rounded-full border-4 border-[#111418] bg-cover bg-center shadow-lg"
                    style={{
                      backgroundImage: `url(${selectedUser.avatar_url || selectedUser.profile_photo})`,
                    }}
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full border-4 border-[#111418] bg-[#283039] flex items-center justify-center text-white shadow-lg">
                    <span className="text-2xl font-bold">
                      {selectedUser.full_name?.charAt(0).toUpperCase() ||
                        selectedUser.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex gap-2">
                  <button className="h-8 w-8 rounded-full bg-[#283039] flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors border border-[#3b4754]">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="h-8 w-8 rounded-full bg-[#283039] flex items-center justify-center text-white hover:bg-red-600 hover:text-white transition-colors border border-[#3b4754]">
                    <Ban className="h-4 w-4" />
                  </button>
                </div>
                </div>
              <h3 className="text-xl font-bold text-white leading-tight">
                {selectedUser.full_name || selectedUser.email}
              </h3>
              <p className="text-[#9dabb9] text-sm">
                {selectedUser.location || 'Nairobi, Kenya'} · Joined{' '}
                {new Date(selectedUser.created_at).getFullYear()}
              </p>

              {/* Live Status Indicator */}
              {selectedUser.currentRide && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-blue-900/20 rounded-lg border border-blue-900/30">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </div>
                  <p className="text-blue-200 text-xs font-medium">
                    Currently on a ride · Est. arrival 14:05
                  </p>
                </div>
              )}
              </div>

            {/* Tabs */}
            <div className="flex border-b border-[#283039] px-6">
              <button
                onClick={() => setActiveTab('history')}
                className={`pb-3 border-b-2 mr-6 text-sm font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-[#9dabb9] hover:text-white'
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`pb-3 border-b-2 mr-6 text-sm font-medium transition-colors ${
                  activeTab === 'payment'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-[#9dabb9] hover:text-white'
                }`}
              >
                Payment
              </button>
              <button
                onClick={() => setActiveTab('issues')}
                className={`pb-3 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === 'issues'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-[#9dabb9] hover:text-white'
                }`}
                      >
                Issues
              </button>
                    </div>

            {/* Inspector Content */}
            <div className="overflow-y-auto flex-1 p-6">
              {activeTab === 'history' && (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-[#1c2127] p-3 rounded-lg border border-[#283039]">
                      <p className="text-[#9dabb9] text-xs mb-1">Total Spent</p>
                      <p className="text-white text-lg font-bold">
                        KES {selectedUser.totalSpent.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-[#1c2127] p-3 rounded-lg border border-[#283039]">
                      <p className="text-[#9dabb9] text-xs mb-1">Avg Rating</p>
                      <div className="flex items-center gap-1">
                        <span className="text-white text-lg font-bold">
                          {selectedUser.avgRating > 0 ? selectedUser.avgRating.toFixed(1) : '--'}
                        </span>
                        {selectedUser.avgRating > 0 && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                    </div>
                    <div className="bg-[#1c2127] p-3 rounded-lg border border-[#283039]">
                      <p className="text-[#9dabb9] text-xs mb-1">Rides</p>
                      <p className="text-white text-lg font-bold">{selectedUser.totalRides}</p>
                    </div>
                    <div className="bg-[#1c2127] p-3 rounded-lg border border-[#283039]">
                      <p className="text-[#9dabb9] text-xs mb-1">Cancel Rate</p>
                      <p className="text-white text-lg font-bold">{selectedUser.cancelRate.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <h4 className="text-white text-sm font-semibold mb-3">Recent Activity</h4>
                  <div className="relative pl-4 border-l border-[#283039] space-y-6">
                    {selectedUser.recentActivity.length === 0 ? (
                      <p className="text-[#9dabb9] text-sm">No recent activity</p>
                    ) : (
                      selectedUser.recentActivity.map((activity, index) => (
                        <div key={activity.id || index} className="relative">
                          <div
                            className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-[#111418] ${
                              activity.type === 'ride_started'
                                ? 'bg-blue-500'
                                : activity.type === 'ride_completed'
                                ? 'bg-[#3b4754]'
                                : 'bg-yellow-500'
                            }`}
                          />
                          <div className="flex flex-col gap-1">
                            <span className="text-[#9dabb9] text-xs">
                              {formatActivityTime(activity.timestamp)}
                            </span>
                            <p className="text-white text-sm">{activity.title}</p>
                            {activity.metadata?.fare && (
                              <p className="text-[#9dabb9] text-xs">
                                KES {activity.metadata.fare.toLocaleString()} · 42 min
                              </p>
                            )}
                            {activity.type === 'ride_started' && activity.metadata?.location && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-blue-400 cursor-pointer hover:underline">
                                <MapPin className="h-3 w-3" />
                                View on Map
                              </div>
                            )}
                            {activity.type === 'ticket_opened' && activity.description && (
                              <div className="bg-[#283039] p-2 rounded mt-1 border border-[#3b4754]">
                                <p className="text-[#9dabb9] text-xs italic">{activity.description}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <Button className="w-full mt-6 py-2.5 text-sm font-medium text-white bg-[#283039] hover:bg-[#3b4754] rounded-lg transition-colors border border-[#3b4754]">
                    View Full History
                  </Button>
                </>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-4">
                  {selectedUser.subscription ? (
                    <>
                      <div className="bg-[#1c2127] p-4 rounded-lg border border-[#283039]">
                        <h5 className="text-white font-semibold mb-2">Active Subscription</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#9dabb9]">Package:</span>
                            <span className="text-white capitalize">
                              {selectedUser.subscription.package_type}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#9dabb9]">Monthly Fee:</span>
                            <span className="text-white">
                              KES {selectedUser.subscription.monthly_fee.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#9dabb9]">Rides:</span>
                            <span className="text-white">
                              {selectedUser.subscription.rides_used} /{' '}
                              {selectedUser.subscription.rides_included}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#1c2127] p-4 rounded-lg border border-[#283039]">
                        <h5 className="text-white font-semibold mb-2">Total Spent</h5>
                        <p className="text-white text-2xl font-bold">
                          KES {selectedUser.totalSpent.toLocaleString()}
                        </p>
                        <p className="text-[#9dabb9] text-xs mt-1">All-time subscription payments</p>
                      </div>
                    </>
                  ) : (
                    <div className="bg-[#1c2127] p-4 rounded-lg border border-[#283039] text-center py-8">
                      <p className="text-[#9dabb9]">No active subscription</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'issues' && (
                <div className="space-y-4">
                  <div className="bg-[#1c2127] p-4 rounded-lg border border-[#283039] text-center py-8">
                    <p className="text-[#9dabb9]">No issues reported</p>
                    <p className="text-[#9dabb9] text-xs mt-1">Issues and tickets will appear here</p>
                  </div>
                </div>
              )}
            </div>
            </div>
          )}
      </div>
    </div>
  );
}
