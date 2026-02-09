import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '../utils/format';
import type { Driver, ServiceRequest, Vehicle } from '../types';
import { FleetMap } from '../components/FleetMap';
import {
  Clock,
  Route,
  Car,
  DollarSign,
  MoreVertical,
  Star,
  MessageSquare,
  Calendar,
  Plus,
  Maximize2,
  User,
} from 'lucide-react';

interface DashboardStats {
  pendingRequests: number;
  activeRides: number;
  availableFleet: number;
  totalFleet: number;
  revenueToday: number;
  urgentRequests: number;
}

interface ActiveDispatch {
  id: string;
  service_request_id: string;
  client_name: string;
  client_avatar?: string;
  chauffeur_name: string;
  vehicle_make: string;
  vehicle_model: string;
  status: 'en_route' | 'on_board' | 'waiting' | 'completed';
  service_request?: ServiceRequest;
}

interface NewRequest {
  id: string;
  request_type: string;
  pickup_address: string;
  destination_address: string;
  scheduled_time: string;
  client_name: string;
  client_avatar?: string;
  status: string;
}

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    pendingRequests: 0,
    activeRides: 0,
    availableFleet: 0,
    totalFleet: 0,
    revenueToday: 0,
    urgentRequests: 0,
  });
  const [activeDispatches, setActiveDispatches] = useState<ActiveDispatch[]>([]);
  const [newRequests, setNewRequests] = useState<NewRequest[]>([]);
  const [availableChauffeurs, setAvailableChauffeurs] = useState<Driver[]>([]);
  const [useSeedData, setUseSeedData] = useState(false);

  useEffect(() => {
    fetchDashboardData();

    // Set up real-time subscriptions
    const serviceRequestsChannel = supabase
      .channel('service_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_requests',
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    const driversChannel = supabase
      .channel('drivers_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'drivers',
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(serviceRequestsChannel);
      supabase.removeChannel(driversChannel);
    };
  }, []);

  // Generate seed data for demonstration
  const generateSeedData = () => {
    // Seed active dispatches
    const seedDispatches: ActiveDispatch[] = [
      {
        id: '9201',
        service_request_id: 'sr-9201',
        client_name: 'Sarah Jenkins',
        client_avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=3b82f6&color=fff',
        chauffeur_name: 'Michael B.',
        vehicle_make: 'Mercedes',
        vehicle_model: 'S-Class',
        status: 'en_route',
      },
      {
        id: '9205',
        service_request_id: 'sr-9205',
        client_name: 'David Chen',
        client_avatar: 'https://ui-avatars.com/api/?name=David+Chen&background=10b981&color=fff',
        chauffeur_name: 'James W.',
        vehicle_make: 'BMW',
        vehicle_model: '7 Series',
        status: 'on_board',
      },
      {
        id: '9150',
        service_request_id: 'sr-9150',
        client_name: 'Elena Rossi',
        client_avatar: 'https://ui-avatars.com/api/?name=Elena+Rossi&background=8b5cf6&color=fff',
        chauffeur_name: 'Robert D.',
        vehicle_make: 'Cadillac',
        vehicle_model: 'Escalade',
        status: 'waiting',
      },
    ];

    // Seed new requests
    const seedRequests: NewRequest[] = [
      {
        id: 'req-001',
        request_type: 'Airport Transfer',
        pickup_address: 'JFK T4',
        destination_address: 'The Plaza Hotel',
        scheduled_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        client_name: 'M. Thompson',
        client_avatar: 'https://ui-avatars.com/api/?name=M+Thompson&background=f59e0b&color=fff',
        status: 'pending',
      },
      {
        id: 'req-002',
        request_type: 'Hourly Service',
        pickup_address: 'Manhattan',
        destination_address: 'Greenwich',
        scheduled_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        client_name: 'L. Rivera',
        client_avatar: 'https://ui-avatars.com/api/?name=L+Rivera&background=ef4444&color=fff',
        status: 'pending',
      },
    ];

    // Seed available chauffeurs
    const seedChauffeurs: Driver[] = [
      {
        id: 'driver-001',
        user_id: 'user-001',
        is_online: true,
        status: 'active',
        rating: 4.9,
        last_updated: new Date().toISOString(),
        user: {
          id: 'user-001',
          full_name: 'Thomas H.',
          email: 'thomas@example.com',
          avatar_url: 'https://ui-avatars.com/api/?name=Thomas+H&background=3b82f6&color=fff',
        },
        vehicle: {
          id: 'vehicle-001',
          make: 'Mercedes',
          model: 'S-Class',
        },
      },
      {
        id: 'driver-002',
        user_id: 'user-002',
        is_online: true,
        status: 'active',
        rating: 4.8,
        last_updated: new Date().toISOString(),
        user: {
          id: 'user-002',
          full_name: 'Albert K.',
          email: 'albert@example.com',
          avatar_url: 'https://ui-avatars.com/api/?name=Albert+K&background=10b981&color=fff',
        },
        vehicle: {
          id: 'vehicle-002',
          make: 'BMW',
          model: '7 Series',
        },
      },
      {
        id: 'driver-003',
        user_id: 'user-003',
        is_online: true,
        status: 'active',
        rating: 5.0,
        last_updated: new Date().toISOString(),
        user: {
          id: 'user-003',
          full_name: 'Maria G.',
          email: 'maria@example.com',
          avatar_url: 'https://ui-avatars.com/api/?name=Maria+G&background=8b5cf6&color=fff',
        },
        vehicle: {
          id: 'vehicle-003',
          make: 'Cadillac',
          model: 'Escalade',
        },
      },
    ] as Driver[];

    return { seedDispatches, seedRequests, seedChauffeurs };
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Check if we should use seed data (if no real data exists)
      const { data: requests } = await supabase
        .from('service_requests')
        .select(
          `
          *,
          user:users(*)
        `
        )
        .in('status', ['pending', 'assigned', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(20);

      const shouldUseSeed = !requests || requests.length === 0;
      setUseSeedData(shouldUseSeed);

      if (shouldUseSeed) {
        const { seedDispatches, seedRequests, seedChauffeurs } = generateSeedData();

        setStats({
          pendingRequests: 12,
          activeRides: 8,
          availableFleet: 14,
          totalFleet: 25,
          revenueToday: 425000, // KES equivalent of $4,250
          urgentRequests: 4,
        });

        setActiveDispatches(seedDispatches);
        setNewRequests(seedRequests);
        setAvailableChauffeurs(seedChauffeurs);
        setLoading(false);
        return;
      }

      // Fetch active dispatches (service requests in progress)
      const { data: dispatchesData } = await supabase
        .from('service_requests')
        .select(
          `
          *,
          user:users(*),
          driver:drivers(*, user:users(*)),
          vehicle:vehicles(*)
        `
        )
        .in('status', ['assigned', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch available chauffeurs (online and active)
      const { data: driversData } = await supabase
        .from('drivers')
        .select(
          `
          *,
          user:users(*),
          vehicle:vehicles(*)
        `
        )
        .eq('is_online', true)
        .eq('status', 'active')
        .order('rating', { ascending: false, nullsLast: true })
        .limit(10);

      // Fetch vehicles
      const { data: vehiclesData } = await supabase
        .from('vehicles')
        .select('status')
        .limit(100);

      // Calculate stats
      const pendingReqs = requests?.filter((r: any) => r.status === 'pending') || [];
      const activeRides = requests?.filter((r: any) => r.status === 'in_progress' || r.status === 'assigned') || [];
      const vehicles = vehiclesData || [];
      const available = vehicles.filter((v: any) => v.status === 'available').length;

      // Calculate revenue (from subscriptions - this is a mock for now)
      const revenueToday = 0; // Would calculate from actual payments

      setStats({
        pendingRequests: pendingReqs.length,
        activeRides: activeRides.length,
        availableFleet: available,
        totalFleet: vehicles.length,
        revenueToday,
        urgentRequests: pendingReqs.filter((r: any) => {
          // Mark urgent if created more than 10 minutes ago
          const createdAt = new Date(r.created_at);
          const now = new Date();
          return (now.getTime() - createdAt.getTime()) / 60000 > 10;
        }).length,
      });

      // Format active dispatches
      const formattedDispatches: ActiveDispatch[] =
        dispatchesData?.map((d: any) => ({
          id: d.id.substring(0, 6),
          service_request_id: d.id,
          client_name: d.user?.full_name || 'Unknown Client',
          client_avatar: d.user?.avatar_url || d.user?.profile_photo,
          chauffeur_name: d.driver?.user?.full_name || 'Unassigned',
          vehicle_make: d.vehicle?.make || 'N/A',
          vehicle_model: d.vehicle?.model || '',
          status:
            d.status === 'in_progress'
              ? 'on_board'
              : d.status === 'assigned'
              ? 'en_route'
              : 'waiting',
          service_request: d,
        })) || [];

      setActiveDispatches(formattedDispatches);

      // Format new requests
      const formattedRequests: NewRequest[] = pendingReqs.slice(0, 4).map((r: any) => ({
        id: r.id,
        request_type: r.request_type || 'Ride',
        pickup_address: r.pickup_address || 'N/A',
        destination_address: r.destination_address || 'N/A',
        scheduled_time: r.scheduled_time || r.created_at,
        client_name: r.user?.full_name || 'Unknown',
        client_avatar: r.user?.avatar_url || r.user?.profile_photo,
        status: r.status,
      }));

      setNewRequests(formattedRequests);

      // Format available chauffeurs
      const formattedChauffeurs: Driver[] =
        driversData?.map((d: any) => ({
          ...d,
          user: d.user,
          vehicle: d.vehicle,
        })) || [];

      setAvailableChauffeurs(formattedChauffeurs);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to seed data on error
      const { seedDispatches, seedRequests, seedChauffeurs } = generateSeedData();
      setStats({
        pendingRequests: 12,
        activeRides: 8,
        availableFleet: 14,
        totalFleet: 25,
        revenueToday: 425000,
        urgentRequests: 4,
      });
      setActiveDispatches(seedDispatches);
      setNewRequests(seedRequests);
      setAvailableChauffeurs(seedChauffeurs);
      setUseSeedData(true);
    } finally {
      setLoading(false);
    }
  };

  // Generate vehicle markers for map
  const getVehicleMarkers = () => {
    if (useSeedData) {
      // Seed vehicle locations around Nairobi
      return [
        { id: 'v1', name: 'Mercedes S-Class', lat: -1.2921, lng: 36.8219, status: 'busy' as const, driverName: 'Michael B.' },
        { id: 'v2', name: 'BMW 7 Series', lat: -1.2821, lng: 36.8319, status: 'busy' as const, driverName: 'James W.' },
        { id: 'v3', name: 'Cadillac Escalade', lat: -1.3021, lng: 36.8119, status: 'busy' as const, driverName: 'Robert D.' },
        { id: 'v4', name: 'Mercedes S-Class', lat: -1.2721, lng: 36.8419, status: 'available' as const, driverName: 'Thomas H.' },
        { id: 'v5', name: 'BMW 7 Series', lat: -1.3121, lng: 36.8019, status: 'available' as const, driverName: 'Albert K.' },
        { id: 'v6', name: 'Cadillac Escalade', lat: -1.2621, lng: 36.8519, status: 'available' as const, driverName: 'Maria G.' },
      ];
    }

    // Real vehicle markers from database
    return availableChauffeurs.map((chauffeur, index) => ({
      id: chauffeur.id,
      name: `${chauffeur.vehicle?.make} ${chauffeur.vehicle?.model}`,
      lat: -1.2921 + (Math.random() - 0.5) * 0.1, // Random location around Nairobi
      lng: 36.8219 + (Math.random() - 0.5) * 0.1,
      status: (chauffeur.is_online ? 'available' : 'offline') as 'available' | 'busy' | 'offline',
      driverName: chauffeur.user?.full_name,
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_route':
        return (
          <Badge className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="size-1.5 rounded-full bg-blue-400"></span>
            En Route
          </Badge>
        );
      case 'on_board':
        return (
          <Badge className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
            <span className="size-1.5 rounded-full bg-green-400"></span>
            On Board
          </Badge>
        );
      case 'waiting':
        return (
          <Badge className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="size-1.5 rounded-full bg-amber-400"></span>
            Waiting
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#9dabb9]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-[#0f151b]">
      {/* Header */}
      <header className="shrink-0 px-6 py-5 border-b border-[#283039] bg-[#111418]/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex flex-wrap justify-between items-center gap-4 max-w-[1600px] mx-auto w-full">
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-2xl font-bold leading-tight tracking-tight">Dashboard Overview</h1>
            <p className="text-[#9dabb9] text-sm font-normal">Real-time operational metrics and dispatch control</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-[#283039] bg-[#1c242c] text-[#9dabb9]">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">{getCurrentDate()}</span>
            </div>
            <Button className="flex items-center gap-2 h-10 px-5 bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              <span>Create Booking</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full pb-10">
          {/* KPI Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pending Requests */}
            <div className="flex flex-col gap-3 rounded-xl p-5 border border-[#283039] bg-[#1c242c] shadow-sm hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-[#9dabb9] text-sm font-medium">Pending Requests</p>
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-white text-3xl font-bold tracking-tight">{stats.pendingRequests}</p>
                {stats.urgentRequests > 0 && (
                  <p className="text-yellow-500 text-xs font-medium mt-1">+{stats.urgentRequests} urgent attention</p>
                )}
              </div>
      </div>

            {/* Active Rides */}
            <div className="flex flex-col gap-3 rounded-xl p-5 border border-[#283039] bg-[#1c242c] shadow-sm hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                <p className="text-[#9dabb9] text-sm font-medium">Active Rides</p>
                <Route className="h-5 w-5 text-primary" />
                    </div>
              <div>
                <p className="text-white text-3xl font-bold tracking-tight">{stats.activeRides}</p>
                <p className="text-[#9dabb9] text-xs font-medium mt-1">Running smoothly</p>
                    </div>
                  </div>

            {/* Available Fleet */}
            <div className="flex flex-col gap-3 rounded-xl p-5 border border-[#283039] bg-[#1c242c] shadow-sm hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-[#9dabb9] text-sm font-medium">Available Fleet</p>
                <Car className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-white text-3xl font-bold tracking-tight">
                  {stats.availableFleet}
                  <span className="text-lg text-[#9dabb9] font-medium">/{stats.totalFleet}</span>
                </p>
                <p className="text-green-500 text-xs font-medium mt-1">Vehicles available</p>
              </div>
      </div>

            {/* Revenue Today */}
            <div className="flex flex-col gap-3 rounded-xl p-5 border border-[#283039] bg-[#1c242c] shadow-sm hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-[#9dabb9] text-sm font-medium">Revenue Today</p>
                <DollarSign className="h-5 w-5 text-[#9dabb9]" />
                  </div>
              <div>
                <p className="text-white text-3xl font-bold tracking-tight">
                  {stats.revenueToday > 0 ? formatCurrency(stats.revenueToday) : 'KES 0'}
                </p>
                <p className="text-green-500 text-xs font-medium mt-1">Subscription-based</p>
              </div>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column (2/3) */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              {/* Map Widget */}
              <div className="rounded-xl border border-[#283039] bg-[#1c242c] overflow-hidden flex flex-col h-[400px]">
                <div className="px-5 py-4 border-b border-[#283039] flex justify-between items-center bg-[#111418]">
                  <h3 className="text-white font-semibold">Live Fleet Map</h3>
                  <button className="text-[#9dabb9] hover:text-white text-xs font-medium flex items-center gap-1">
                    Full Screen
                    <Maximize2 className="h-4 w-4" />
                  </button>
                        </div>
                <div className="relative w-full h-full">
                  <FleetMap
                    vehicles={getVehicleMarkers()}
                    height="100%"
                    center={[-1.2921, 36.8219]}
                    zoom={12}
                  />
                      </div>
              </div>

              {/* Active Dispatches Table */}
              <div className="rounded-xl border border-[#283039] bg-[#1c242c] flex flex-col overflow-hidden">
                <div className="px-5 py-4 border-b border-[#283039] flex justify-between items-center bg-[#111418]">
                  <h2 className="text-white text-lg font-bold tracking-tight">Active Dispatches</h2>
                  <button className="text-primary text-sm font-medium hover:text-primary/80">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-[#9dabb9]">
                    <thead className="bg-[#111418] text-xs uppercase font-semibold text-white">
                      <tr>
                        <th className="px-5 py-4 w-20">ID</th>
                        <th className="px-5 py-4">VIP Client</th>
                        <th className="px-5 py-4">Chauffeur</th>
                        <th className="px-5 py-4">Vehicle</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#283039]">
                      {activeDispatches.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-5 py-8 text-center text-[#9dabb9]">
                            No active dispatches
                          </td>
                        </tr>
                      ) : (
                        activeDispatches.map((dispatch) => (
                          <tr key={dispatch.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-5 py-4 font-mono text-xs">#{dispatch.id}</td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {dispatch.client_avatar ? (
                                  <div
                                    className="size-8 rounded-full bg-cover bg-center"
                                    style={{ backgroundImage: `url(${dispatch.client_avatar})` }}
                                  />
                                ) : (
                                  <div className="size-8 rounded-full bg-slate-700 flex items-center justify-center">
                                    <User className="h-4 w-4 text-[#9dabb9]" />
                                  </div>
                                )}
                                <span className="text-white font-medium">{dispatch.client_name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-white">{dispatch.chauffeur_name}</td>
                            <td className="px-5 py-4">
                              {dispatch.vehicle_make} {dispatch.vehicle_model}
                            </td>
                            <td className="px-5 py-4">{getStatusBadge(dispatch.status)}</td>
                            <td className="px-5 py-4 text-right">
                              <button className="text-[#9dabb9] hover:text-white">
                                <MoreVertical className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column (1/3) */}
            <div className="xl:col-span-1 flex flex-col gap-6">
              {/* New Requests Panel */}
              <div className="rounded-xl border border-[#283039] bg-[#1c242c] overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-[#283039] flex justify-between items-center bg-[#111418]">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    New Requests
                    {newRequests.length > 0 && (
                      <span className="bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 rounded font-bold">
                        {newRequests.length}
                      </span>
                    )}
                  </h3>
                  <button className="text-xs text-[#9dabb9] hover:text-white">Expand</button>
                  </div>
                <div className="flex flex-col p-4 gap-4">
                  {newRequests.length === 0 ? (
                    <div className="text-center py-8 text-[#9dabb9] text-sm">No new requests</div>
                  ) : (
                    newRequests.map((request) => (
                      <div key={request.id} className="flex flex-col gap-3 p-4 rounded-lg bg-[#111418] border border-[#283039]">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <p className="text-white font-semibold text-sm capitalize">
                              {request.request_type || 'Ride'}
                            </p>
                            <p className="text-[#9dabb9] text-xs mt-0.5">
                              {request.pickup_address} → {request.destination_address}
                            </p>
                          </div>
                          <p className="text-xs font-mono text-primary font-medium">
                            {new Date(request.scheduled_time).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {request.client_avatar ? (
                            <div
                              className="size-6 rounded-full bg-cover bg-center"
                              style={{ backgroundImage: `url(${request.client_avatar})` }}
                            />
                          ) : (
                            <div className="size-6 rounded-full bg-slate-600 flex items-center justify-center">
                              <User className="h-3 w-3 text-[#9dabb9]" />
                            </div>
                          )}
                          <p className="text-xs text-[#9dabb9]">
                            Requested by <span className="text-white">{request.client_name}</span>
                          </p>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button className="flex-1 py-1.5 h-auto rounded bg-primary hover:bg-primary/90 text-white text-xs font-bold">
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 py-1.5 h-auto rounded border border-[#283039] hover:bg-white/5 text-[#9dabb9] text-xs font-medium"
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                  ))
                )}
              </div>
      </div>

              {/* Available Chauffeurs */}
              <div className="rounded-xl border border-[#283039] bg-[#1c242c] overflow-hidden flex flex-col flex-1">
                <div className="px-5 py-4 border-b border-[#283039] flex justify-between items-center bg-[#111418]">
                  <h3 className="text-white font-semibold">Available Chauffeurs</h3>
                </div>
                <div className="flex flex-col divide-y divide-[#283039]">
                  {availableChauffeurs.length === 0 ? (
                    <div className="p-8 text-center text-[#9dabb9] text-sm">No available chauffeurs</div>
                  ) : (
                    availableChauffeurs.map((chauffeur) => (
                      <div
                        key={chauffeur.id}
                        className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <div className="relative">
                          {chauffeur.user?.avatar_url || chauffeur.user?.profile_photo ? (
                            <div
                              className="size-10 rounded-full bg-cover bg-center"
                              style={{
                                backgroundImage: `url(${chauffeur.user.avatar_url || chauffeur.user.profile_photo})`,
                              }}
                            />
                          ) : (
                            <div className="size-10 rounded-full bg-slate-600 flex items-center justify-center">
                              <User className="h-5 w-5 text-[#9dabb9]" />
                            </div>
                          )}
                          {chauffeur.is_online && (
                            <div className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 ring-2 ring-[#1c242c]"></div>
                          )}
                    </div>
                        <div className="flex flex-col flex-1">
                          <p className="text-white text-sm font-medium">
                            {chauffeur.user?.full_name || 'Unknown Chauffeur'}
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-[#9dabb9] text-xs">
                              {chauffeur.rating?.toFixed(1) || 'N/A'} • {chauffeur.vehicle?.make}{' '}
                              {chauffeur.vehicle?.model || ''}
                            </span>
                          </div>
                        </div>
                        <MessageSquare className="h-5 w-5 text-[#9dabb9]" />
                      </div>
                    ))
                  )}
                    </div>
                {availableChauffeurs.length > 0 && (
                  <div className="p-3 bg-[#111418] border-t border-[#283039] mt-auto">
                    <button className="w-full text-center text-xs text-[#9dabb9] hover:text-white py-1">
                      View Full Roster
                    </button>
                  </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
