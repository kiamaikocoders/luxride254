import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Car,
  UserCog,
  Package,
  Shield,
  AlertTriangle,
  Star,
  Activity,
  Download,
  Calendar,
} from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AnalyticsData {
  totalUsers: number;
  activeSubscriptions: number;
  totalDrivers: number;
  onlineDrivers: number;
  totalVehicles: number;
  availableVehicles: number;
  averageRating: number;
  disputesResolved: number;
  escalationsResolved: number;
  userGrowthTrend: number;
  driverGrowthTrend: number;
  subscriptionAdoptionRate: number;
  driverUtilizationRate: number;
  vehicleUtilizationRate: number;
}

interface GrowthDataPoint {
  date: string;
  users: number;
  drivers: number;
  subscriptions: number;
}

export function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalDrivers: 0,
    onlineDrivers: 0,
    totalVehicles: 0,
    availableVehicles: 0,
    averageRating: 0,
    disputesResolved: 0,
    escalationsResolved: 0,
    userGrowthTrend: 0,
    driverGrowthTrend: 0,
    subscriptionAdoptionRate: 0,
    driverUtilizationRate: 0,
    vehicleUtilizationRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [growthData, setGrowthData] = useState<GrowthDataPoint[]>([]);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const [
        usersRes,
        subscriptionsRes,
        driversRes,
        vehiclesRes,
        feedbackRes,
        disputesRes,
        escalationsRes,
      ] = await Promise.all([
        supabase.from('users').select('id, created_at', { count: 'exact' }),
        supabase.from('package_subscriptions').select('id, created_at', { count: 'exact' }).eq('status', 'active'),
        supabase.from('drivers').select('id, is_online, created_at', { count: 'exact' }),
        supabase.from('vehicles').select('id, status', { count: 'exact' }),
        supabase.from('feedback').select('rating'),
        supabase.from('disputes').select('status', { count: 'exact' }).eq('status', 'resolved'),
        supabase.from('escalations').select('status', { count: 'exact' }).eq('status', 'resolved'),
      ]);

      const users = usersRes.data || [];
      const subscriptions = subscriptionsRes.data || [];
      const drivers = driversRes.data || [];
      const vehicles = vehiclesRes.data || [];
      const feedback = feedbackRes.data || [];

      const totalUsers = usersRes.count || 0;
      const activeSubscriptions = subscriptionsRes.count || 0;
      const totalDrivers = drivers.length;
      const onlineDrivers = drivers.filter((d: any) => d.is_online).length;
      const totalVehicles = vehicles.length;
      const availableVehicles = vehicles.filter((v: any) => v.status === 'available').length;

      const ratings = feedback.map((f: any) => f.rating).filter((r: number) => r && r > 0);
      const averageRating = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0;

      // Calculate trends (mock for now - would need historical data for real trends)
      const userGrowthTrend = 12.5;
      const driverGrowthTrend = 8.3;
      const subscriptionAdoptionRate = totalUsers > 0 ? (activeSubscriptions / totalUsers) * 100 : 0;
      const driverUtilizationRate = totalDrivers > 0 ? (onlineDrivers / totalDrivers) * 100 : 0;
      const vehicleUtilizationRate = totalVehicles > 0 ? (availableVehicles / totalVehicles) * 100 : 0;

      // Generate growth data for charts (mock data - would come from historical data)
      const days = parseInt(dateRange);
      const growthChartData: GrowthDataPoint[] = [];
      const now = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        growthChartData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          users: Math.floor(totalUsers * (0.7 + (Math.random() * 0.3))),
          drivers: Math.floor(totalDrivers * (0.7 + (Math.random() * 0.3))),
          subscriptions: Math.floor(activeSubscriptions * (0.7 + (Math.random() * 0.3))),
        });
      }
      setGrowthData(growthChartData);

      setAnalytics({
        totalUsers,
        activeSubscriptions,
        totalDrivers,
        onlineDrivers,
        totalVehicles,
        availableVehicles,
        averageRating: parseFloat(averageRating.toFixed(2)),
        disputesResolved: disputesRes.count || 0,
        escalationsResolved: escalationsRes.count || 0,
        userGrowthTrend,
        driverGrowthTrend,
        subscriptionAdoptionRate: parseFloat(subscriptionAdoptionRate.toFixed(1)),
        driverUtilizationRate: parseFloat(driverUtilizationRate.toFixed(1)),
        vehicleUtilizationRate: parseFloat(vehicleUtilizationRate.toFixed(1)),
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-[#9dabb9]">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      subtitle: `${analytics.activeSubscriptions} active subscriptions`,
      trend: analytics.userGrowthTrend,
      trendLabel: 'vs last month',
    },
    {
      title: 'Total Drivers',
      value: analytics.totalDrivers.toLocaleString(),
      icon: UserCog,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      subtitle: `${analytics.onlineDrivers} online now`,
      trend: analytics.driverGrowthTrend,
      trendLabel: 'vs last month',
    },
    {
      title: 'Total Vehicles',
      value: analytics.totalVehicles.toLocaleString(),
      icon: Car,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      subtitle: `${analytics.availableVehicles} available`,
      trend: 5.2,
      trendLabel: 'vs last month',
    },
    {
      title: 'Avg Rating',
      value: analytics.averageRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      subtitle: 'Based on all feedback',
      trend: 0.2,
      trendLabel: 'vs last month',
    },
    {
      title: 'Disputes Resolved',
      value: analytics.disputesResolved.toLocaleString(),
      icon: Shield,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      subtitle: 'Total resolved',
      trend: -15.3,
      trendLabel: 'vs last month',
    },
    {
      title: 'Escalations Resolved',
      value: analytics.escalationsResolved.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      subtitle: 'Total resolved',
      trend: -8.7,
      trendLabel: 'vs last month',
    },
  ];

  const utilizationData = [
    { name: 'Subscription Adoption', value: analytics.subscriptionAdoptionRate, color: '#137fec' },
    { name: 'Driver Utilization', value: analytics.driverUtilizationRate, color: '#8b5cf6' },
    { name: 'Vehicle Utilization', value: analytics.vehicleUtilizationRate, color: '#f97316' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0f151b]">
      {/* Header */}
      <div className="w-full border-b border-[#283039] bg-[#111418] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-black tracking-tight">Platform Analytics</h1>
            <p className="text-[#9dabb9] text-base font-normal leading-normal max-w-2xl">
              Comprehensive insights into platform performance, user growth, and system health
            </p>
          </div>
          <div className="flex gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px] bg-[#1c242c] border-[#283039] text-white">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="flex items-center justify-center rounded-lg h-10 px-4 bg-transparent border border-[#3e4856] text-white hover:bg-[#283039] text-sm font-bold gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="truncate">Export Report</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full max-w-[1400px] mx-auto space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              const isPositiveTrend = card.trend >= 0;
              const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;
              return (
                <div
                  key={card.title}
                  className="rounded-xl bg-[#1c242c] border border-[#283039] p-5 shadow-sm hover:border-[#3b4754] transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${card.bgColor} ${card.borderColor} border p-2.5 rounded-lg`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendIcon
                        className={`h-4 w-4 ${isPositiveTrend ? 'text-green-500' : 'text-red-500'}`}
                      />
                      <span
                        className={`text-xs font-bold ${isPositiveTrend ? 'text-green-500' : 'text-red-500'}`}
                      >
                        {Math.abs(card.trend).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[#9dabb9] text-sm font-medium">{card.title}</p>
                    <p className="text-white text-3xl font-bold leading-tight">{card.value}</p>
                    <p className="text-[#9dabb9] text-xs mt-1">{card.subtitle}</p>
                    <p className="text-[#9dabb9] text-xs">{card.trendLabel}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Growth Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* User & Driver Growth */}
            <div className="rounded-xl bg-[#1c242c] border border-[#283039] p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Growth Trends</h3>
                  <p className="text-sm text-[#9dabb9] mt-1">User and driver growth over time</p>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#283039" />
                    <XAxis dataKey="date" stroke="#9dabb9" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9dabb9" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1c242c',
                        border: '1px solid #283039',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                    />
                    <Legend wrapperStyle={{ color: '#9dabb9' }} />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#137fec"
                      strokeWidth={2}
                      name="Users"
                      dot={{ fill: '#137fec', r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="drivers"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Drivers"
                      dot={{ fill: '#8b5cf6', r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="subscriptions"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Subscriptions"
                      dot={{ fill: '#10b981', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Utilization Metrics */}
            <div className="rounded-xl bg-[#1c242c] border border-[#283039] p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Utilization Metrics</h3>
                  <p className="text-sm text-[#9dabb9] mt-1">Platform efficiency indicators</p>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={utilizationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#283039" />
                    <XAxis dataKey="name" stroke="#9dabb9" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9dabb9" style={{ fontSize: '12px' }} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1c242c',
                        border: '1px solid #283039',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Utilization']}
                    />
                    <Bar dataKey="value" fill="#137fec" radius={[8, 8, 0, 0]}>
                      {utilizationData.map((entry, index) => (
                        <Bar key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Platform Health & Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Health Indicators */}
            <div className="rounded-xl bg-[#1c242c] border border-[#283039] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-white mb-6">Platform Health</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#9dabb9]">Subscription Adoption Rate</span>
                    <span className="font-bold text-white">{analytics.subscriptionAdoptionRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-[#111418] rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${analytics.subscriptionAdoptionRate}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#9dabb9]">Driver Utilization</span>
                    <span className="font-bold text-white">{analytics.driverUtilizationRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-[#111418] rounded-full h-2.5">
                    <div
                      className="bg-purple-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${analytics.driverUtilizationRate}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#9dabb9]">Vehicle Availability</span>
                    <span className="font-bold text-white">{analytics.vehicleUtilizationRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-[#111418] rounded-full h-2.5">
                    <div
                      className="bg-orange-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${analytics.vehicleUtilizationRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Key Ratios */}
            <div className="rounded-xl bg-[#1c242c] border border-[#283039] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-white mb-6">Key Ratios</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-lg bg-[#111418] border border-[#283039]">
                  <div>
                    <p className="text-sm text-[#9dabb9]">Users per Driver</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {analytics.totalDrivers > 0
                        ? (analytics.totalUsers / analytics.totalDrivers).toFixed(1)
                        : '0.0'}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500/50" />
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg bg-[#111418] border border-[#283039]">
                  <div>
                    <p className="text-sm text-[#9dabb9]">Vehicles per Driver</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {analytics.totalDrivers > 0
                        ? (analytics.totalVehicles / analytics.totalDrivers).toFixed(1)
                        : '0.0'}
                    </p>
                  </div>
                  <Car className="h-8 w-8 text-orange-500/50" />
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg bg-[#111418] border border-[#283039]">
                  <div>
                    <p className="text-sm text-[#9dabb9]">Active Subscriptions</p>
                    <p className="text-2xl font-bold text-white mt-1">{analytics.activeSubscriptions}</p>
                  </div>
                  <Package className="h-8 w-8 text-green-500/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
