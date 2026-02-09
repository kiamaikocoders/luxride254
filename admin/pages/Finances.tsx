import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/format';
import { ADMIN_CONFIG } from '../config';
import type { PackageSubscription } from '../types';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Download,
  Filter,
  Search,
  Calendar,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SubscriptionPayment {
  id: string;
  subscription_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: 'completed' | 'pending' | 'failed';
  user?: any;
  subscription?: PackageSubscription;
}

interface RevenueBreakdown {
  totalRevenue: number;
  ownerShare: number;
  driverShare: number;
  platformShare: number;
  totalRides: number;
  avgPerRide: number;
}

export function Finances() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<PackageSubscription[]>([]);
  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year' | 'all'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'cancelled'>('all');

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch subscriptions
      const { data: subsData, error: subsError } = await supabase
        .from('package_subscriptions')
        .select(`
          *,
          user:users(*)
        `)
        .order('created_at', { ascending: false });

      if (subsError) throw subsError;
      setSubscriptions(subsData || []);

      // Fetch payments (if there's a payments table, otherwise use mock data)
      // For now, we'll calculate payments from subscriptions
      const mockPayments: SubscriptionPayment[] = (subsData || []).map((sub: any) => ({
        id: `payment-${sub.id}`,
        subscription_id: sub.id,
        amount: sub.monthly_fee,
        payment_date: sub.start_date,
        payment_method: 'M-Pesa',
        status: sub.status === 'active' ? 'completed' : 'pending',
        user: sub.user,
        subscription: sub,
      }));
      setPayments(mockPayments);
    } catch (error) {
      console.error('Error fetching finances data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRevenueBreakdown = (): RevenueBreakdown => {
    const activeSubscriptions = subscriptions.filter((s) => s.status === 'active');
    const totalRevenue = activeSubscriptions.reduce((sum, sub) => sum + Number(sub.monthly_fee), 0);
    const totalRides = activeSubscriptions.reduce((sum, sub) => sum + Number(sub.rides_included), 0);
    const avgPerRide = totalRides > 0 ? totalRevenue / totalRides : 0;

    return {
      totalRevenue,
      ownerShare: totalRevenue * ADMIN_CONFIG.paymentSplit.owner,
      driverShare: totalRevenue * ADMIN_CONFIG.paymentSplit.driver,
      platformShare: totalRevenue * ADMIN_CONFIG.paymentSplit.platform,
      totalRides,
      avgPerRide,
    };
  };

  const calculatePerRideBreakdown = (subscription: PackageSubscription) => {
    const perRideCost = Number(subscription.monthly_fee) / Number(subscription.rides_included);
    return {
      perRideCost,
      ownerShare: perRideCost * ADMIN_CONFIG.paymentSplit.owner,
      driverShare: perRideCost * ADMIN_CONFIG.paymentSplit.driver,
      platformShare: perRideCost * ADMIN_CONFIG.paymentSplit.platform,
    };
  };

  const getStats = () => {
    const breakdown = calculateRevenueBreakdown();
    const activeSubscriptions = subscriptions.filter((s) => s.status === 'active').length;
    const totalPayments = payments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);

    return {
      totalRevenue: breakdown.totalRevenue,
      activeSubscriptions,
      monthlyRevenue: breakdown.totalRevenue,
      totalPayments,
      totalRides: breakdown.totalRides,
      avgPerRide: breakdown.avgPerRide,
    };
  };

  const getFilteredSubscriptions = () => {
    let filtered = subscriptions;

    if (filterStatus !== 'all') {
      filtered = filtered.filter((s) => s.status === filterStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.user?.full_name?.toLowerCase().includes(query) ||
          s.user?.email?.toLowerCase().includes(query) ||
          s.package_type.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getFilteredPayments = () => {
    let filtered = payments;

    if (filterStatus !== 'all') {
      filtered = filtered.filter((p) => {
        if (filterStatus === 'active') return p.status === 'completed';
        return p.subscription?.status === filterStatus;
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.user?.full_name?.toLowerCase().includes(query) ||
          p.user?.email?.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const stats = getStats();
  const breakdown = calculateRevenueBreakdown();
  const filteredSubscriptions = getFilteredSubscriptions();
  const filteredPayments = getFilteredPayments();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#9dabb9]">Loading finances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-[#0f151b]">
      {/* Header */}
      <div className="border-b border-[#283039] bg-[#111418] px-6 py-4 flex-none">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Finances & Revenue</h1>
            <p className="text-[#9dabb9] text-sm">Track subscriptions, payments, and revenue distribution</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-[#3e4856] text-white hover:bg-[#283039] flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              className="border-[#3e4856] text-white hover:bg-[#283039] flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32 bg-[#283039] border-[#3e4856] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-[#9dabb9] text-xs font-medium mb-1">Total Revenue</p>
              <p className="text-2xl font-black text-white">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-green-500 mt-2">+12.5% from last month</p>
            </div>

            <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-[#9dabb9] text-xs font-medium mb-1">Active Subscriptions</p>
              <p className="text-2xl font-black text-white">{stats.activeSubscriptions}</p>
              <p className="text-xs text-blue-500 mt-2">+5 new this month</p>
            </div>

            <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <CreditCard className="h-5 w-5 text-purple-500" />
                </div>
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-[#9dabb9] text-xs font-medium mb-1">Monthly Revenue</p>
              <p className="text-2xl font-black text-white">{formatCurrency(stats.monthlyRevenue)}</p>
              <p className="text-xs text-purple-500 mt-2">All active subscriptions</p>
            </div>

            <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <PieChart className="h-5 w-5 text-orange-500" />
                </div>
                <BarChart3 className="h-4 w-4 text-orange-500" />
              </div>
              <p className="text-[#9dabb9] text-xs font-medium mb-1">Avg Per Ride</p>
              <p className="text-2xl font-black text-white">{formatCurrency(stats.avgPerRide)}</p>
              <p className="text-xs text-orange-500 mt-2">Based on {stats.totalRides} rides</p>
            </div>
          </div>

          {/* Revenue Distribution */}
          <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Revenue Distribution Breakdown</h3>
                <p className="text-[#9dabb9] text-sm">How subscription revenue is allocated across stakeholders</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#111418] rounded-lg p-4 border border-[#283039]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-[#9dabb9]">Owner Share</span>
                  </div>
                  <span className="text-xs font-bold text-white bg-blue-500/20 px-2 py-1 rounded">
                    {ADMIN_CONFIG.paymentSplit.owner * 100}%
                  </span>
                </div>
                <p className="text-2xl font-black text-white">{formatCurrency(breakdown.ownerShare)}</p>
                <p className="text-xs text-[#9dabb9] mt-1">
                  {formatCurrency(breakdown.avgPerRide * ADMIN_CONFIG.paymentSplit.owner)} per ride
                </p>
              </div>

              <div className="bg-[#111418] rounded-lg p-4 border border-[#283039]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-[#9dabb9]">Driver Share</span>
                  </div>
                  <span className="text-xs font-bold text-white bg-green-500/20 px-2 py-1 rounded">
                    {ADMIN_CONFIG.paymentSplit.driver * 100}%
                  </span>
                </div>
                <p className="text-2xl font-black text-white">{formatCurrency(breakdown.driverShare)}</p>
                <p className="text-xs text-[#9dabb9] mt-1">
                  {formatCurrency(breakdown.avgPerRide * ADMIN_CONFIG.paymentSplit.driver)} per ride
                </p>
              </div>

              <div className="bg-[#111418] rounded-lg p-4 border border-[#283039]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm font-medium text-[#9dabb9]">Platform Share</span>
                  </div>
                  <span className="text-xs font-bold text-white bg-purple-500/20 px-2 py-1 rounded">
                    {ADMIN_CONFIG.paymentSplit.platform * 100}%
                  </span>
                </div>
                <p className="text-2xl font-black text-white">{formatCurrency(breakdown.platformShare)}</p>
                <p className="text-xs text-[#9dabb9] mt-1">
                  {formatCurrency(breakdown.avgPerRide * ADMIN_CONFIG.paymentSplit.platform)} per ride
                </p>
              </div>
            </div>

            {/* Per-Ride Example */}
            <div className="bg-gradient-to-r from-[#111418] to-[#1a1f28] rounded-lg p-4 border border-[#283039]">
              <h4 className="text-sm font-bold text-white mb-3">Example: Per-Ride Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-[#9dabb9] mb-1">Per-Ride Cost</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(breakdown.avgPerRide)}</p>
                  <p className="text-[10px] text-[#5d6b79] mt-1">
                    ({formatCurrency(breakdown.totalRevenue)} ÷ {breakdown.totalRides} rides)
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9dabb9] mb-1">Owner</p>
                  <p className="text-lg font-bold text-blue-400">
                    {formatCurrency(breakdown.avgPerRide * ADMIN_CONFIG.paymentSplit.owner)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9dabb9] mb-1">Driver</p>
                  <p className="text-lg font-bold text-green-400">
                    {formatCurrency(breakdown.avgPerRide * ADMIN_CONFIG.paymentSplit.driver)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#9dabb9] mb-1">Platform</p>
                  <p className="text-lg font-bold text-purple-400">
                    {formatCurrency(breakdown.avgPerRide * ADMIN_CONFIG.paymentSplit.platform)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="bg-[#1c242c] rounded-xl border border-[#283039] overflow-hidden">
            <div className="p-5 border-b border-[#283039] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Subscription Management</h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9dabb9]" />
                  <Input
                    className="pl-9 w-64 bg-[#111418] border-[#283039] text-white placeholder:text-[#5d6b79]"
                    placeholder="Search subscriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="w-32 bg-[#111418] border-[#283039] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#111418] border-b border-[#283039]">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#9dabb9] uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#9dabb9] uppercase tracking-wider">
                      Package
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#9dabb9] uppercase tracking-wider">
                      Monthly Fee
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#9dabb9] uppercase tracking-wider">
                      Rides Included
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#9dabb9] uppercase tracking-wider">
                      Per-Ride Cost
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#9dabb9] uppercase tracking-wider">
                      Revenue Split
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#9dabb9] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#9dabb9] uppercase tracking-wider">
                      Start Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#283039]">
                  {filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-8 text-center text-[#9dabb9]">
                        No subscriptions found
                      </td>
                    </tr>
                  ) : (
                    filteredSubscriptions.map((subscription) => {
                      const rideBreakdown = calculatePerRideBreakdown(subscription);
                      return (
                        <tr key={subscription.id} className="hover:bg-[#111418]/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#283039] flex items-center justify-center">
                                <span className="text-xs font-bold text-white">
                                  {subscription.user?.full_name?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {subscription.user?.full_name || 'Unknown User'}
                                </p>
                                <p className="text-xs text-[#9dabb9]">{subscription.user?.email || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <Badge
                              className={`capitalize ${
                                subscription.package_type.includes('diamond')
                                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/20'
                                  : subscription.package_type.includes('platinum')
                                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/20'
                                  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
                              }`}
                            >
                              {subscription.package_type.replace(/_/g, ' ')}
                            </Badge>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-white">{formatCurrency(subscription.monthly_fee)}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-white">
                              {subscription.rides_used || 0} / {subscription.rides_included}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-white">{formatCurrency(rideBreakdown.perRideCost)}</p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-xs text-[#9dabb9]">
                                  Owner: {formatCurrency(rideBreakdown.ownerShare)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-xs text-[#9dabb9]">
                                  Driver: {formatCurrency(rideBreakdown.driverShare)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                <span className="text-xs text-[#9dabb9]">
                                  Platform: {formatCurrency(rideBreakdown.platformShare)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <Badge
                              className={
                                subscription.status === 'active'
                                  ? 'bg-green-500/20 text-green-400 border-green-500/20'
                                  : subscription.status === 'suspended'
                                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
                                  : 'bg-red-500/20 text-red-400 border-red-500/20'
                              }
                            >
                              {subscription.status}
                            </Badge>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-xs text-[#9dabb9]">{formatDate(subscription.start_date)}</p>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-[#1c242c] rounded-xl border border-[#283039] overflow-hidden">
            <div className="p-5 border-b border-[#283039]">
              <h3 className="text-lg font-bold text-white">Payment History</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#111418] border-b border-[#283039]">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#9dabb9] uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#9dabb9] uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#9dabb9] uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#9dabb9] uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-[#9dabb9] uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#283039]">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-[#9dabb9]">
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-[#111418]/50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="text-sm text-white">{formatDate(payment.payment_date)}</p>
                          <p className="text-xs text-[#9dabb9]">{formatRelativeTime(payment.payment_date)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-white">
                            {payment.user?.full_name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-[#9dabb9]">{payment.user?.email || 'N/A'}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-white">{formatCurrency(payment.amount)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-[#9dabb9]">{payment.payment_method}</p>
                        </td>
                        <td className="px-5 py-4">
                          <Badge
                            className={
                              payment.status === 'completed'
                                ? 'bg-green-500/20 text-green-400 border-green-500/20'
                                : payment.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
                                : 'bg-red-500/20 text-red-400 border-red-500/20'
                            }
                          >
                            {payment.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

