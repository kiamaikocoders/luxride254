import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RouteMap } from '../components/RouteMap';
import type { ServiceRequest, User, Vehicle, Driver } from '../types';
import {
  Search,
  Bell,
  HelpCircle,
  MapPin,
  Clock,
  Luggage,
  AlertTriangle,
  Car,
  User as UserIcon,
  Send,
  Star,
  Fuel,
  Droplet,
} from 'lucide-react';

interface ServiceRequestWithUser extends ServiceRequest {
  user?: User & {
    subscription?: {
      package_type?: string;
    };
  };
}

interface ActiveDispatch {
  id: string;
  client_name: string;
  client_avatar?: string;
  status: string;
  timeAgo: string;
}

interface AvailableVehicle {
  id: string;
  make: string;
  model: string;
  license_plate: string;
  color: string;
  image?: string;
  status: 'ready' | 'busy';
  fuel: number;
  cleaned: string;
  distance: string;
  timeToPickup: string;
  lat?: number;
  lng?: number;
}

export function ServiceRequests() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ServiceRequestWithUser[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequestWithUser | null>(null);
  const [activeDispatches, setActiveDispatches] = useState<ActiveDispatch[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<AvailableVehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [selectedChauffeur, setSelectedChauffeur] = useState<string>('');
  const [filterTab, setFilterTab] = useState<'all' | 'vip' | 'scheduled' | 'asap'>('all');
  const [vehicleClass, setVehicleClass] = useState<'luxury' | 'suv'>('luxury');
  const [activeTab, setActiveTab] = useState<'vehicle' | 'chauffeur'>('vehicle');
  const [useSeedData, setUseSeedData] = useState(false);

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  useEffect(() => {
    if (selectedRequest && requests.length > 0) {
      // Fetch available vehicles when a request is selected
      fetchAvailableVehicles();
    }
  }, [selectedRequest]);

  // Generate seed data matching the HTML
  const generateSeedData = () => {
    const seedRequests: ServiceRequestWithUser[] = [
      {
        id: 'req-8921',
        user_id: 'user-001',
        request_type: 'ride',
        pickup_address: 'JFK Airport, Terminal 4',
        pickup_location: null,
        destination_address: 'The Plaza Hotel, 768 5th Ave, New York, NY 10019',
        destination: null,
        pickup_latitude: 40.6413,
        pickup_longitude: -73.7781,
        destination_latitude: 40.7648,
        destination_longitude: -73.9773,
        status: 'pending',
        scheduled_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 14:00 today
        special_requirements: 'English-speaking chauffeur. Provide chilled mineral water and champagne. Ensure vehicle temperature is set to 21°C before pickup.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: 'user-001',
          full_name: 'Arthur Rockefeller',
          email: 'arthur@example.com',
          avatar_url: 'https://ui-avatars.com/api/?name=Arthur+Rockefeller&background=3b82f6&color=fff',
          subscription: {
            package_type: 'gold',
          },
        },
        passengers: 2,
        luggage: 3,
        desired_vehicle_type: 'luxury',
      },
      {
        id: 'req-8922',
        user_id: 'user-002',
        request_type: 'ride',
        pickup_address: 'Wall St, NY',
        pickup_location: null,
        destination_address: 'Teterboro Airport',
        destination: null,
        pickup_latitude: 40.7074,
        pickup_longitude: -74.0113,
        destination_latitude: 40.8598,
        destination_longitude: -74.0593,
        status: 'pending',
        scheduled_time: new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(), // 15:30 today
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: 'user-002',
          full_name: 'Elena Fisher',
          email: 'elena@example.com',
          avatar_url: 'https://ui-avatars.com/api/?name=Elena+Fisher&background=10b981&color=fff',
          subscription: {
            package_type: 'corporate',
          },
        },
        passengers: 1,
        luggage: 1,
      },
      {
        id: 'req-8923',
        user_id: 'user-003',
        request_type: 'ride',
        pickup_address: 'Central Park West',
        pickup_location: null,
        destination_address: 'EWR Terminal C',
        destination: null,
        pickup_latitude: 40.7851,
        pickup_longitude: -73.9683,
        destination_latitude: 40.6925,
        destination_longitude: -74.1777,
        status: 'pending',
        scheduled_time: new Date(Date.now() + 4.25 * 60 * 60 * 1000).toISOString(), // 16:15 today
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: 'user-003',
          full_name: 'John Doe',
          email: 'john@example.com',
          avatar_url: undefined,
          subscription: {
            package_type: 'standard',
          },
        },
        passengers: 1,
        luggage: 2,
      },
    ] as ServiceRequestWithUser[];

    const seedActiveDispatches: ActiveDispatch[] = [
      {
        id: 'dispatch-001',
        client_name: 'Ms. Fisher',
        client_avatar: 'https://ui-avatars.com/api/?name=Elena+Fisher&background=10b981&color=fff',
        status: 'en_route_to_pickup',
        timeAgo: '12m ago',
      },
    ];

    const seedVehicles: AvailableVehicle[] = [
      {
        id: 'vehicle-001',
        make: 'Mercedes-Benz',
        model: 'S580',
        license_plate: 'XYZ-9821',
        color: 'Black',
        image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=200&h=150&fit=crop',
        status: 'ready',
        fuel: 85,
        cleaned: '2h ago',
        distance: '1.2 mi away',
        timeToPickup: '~5 mins to pickup',
        lat: 40.7589,
        lng: -73.9851,
      },
      {
        id: 'vehicle-002',
        make: 'BMW',
        model: '760i xDrive',
        license_plate: 'ABC-1122',
        color: 'Dark Blue',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=150&fit=crop',
        status: 'busy',
        fuel: 42,
        cleaned: '',
        distance: '8.5 mi away',
        timeToPickup: 'On active trip',
        lat: 40.7128,
        lng: -74.0060,
      },
      {
        id: 'vehicle-003',
        make: 'Audi',
        model: 'A8 L',
        license_plate: 'LUX-9900',
        color: 'Black',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=200&h=150&fit=crop',
        status: 'ready',
        fuel: 92,
        cleaned: '4h ago',
        distance: '2.1 mi away',
        timeToPickup: '~8 mins to pickup',
        lat: 40.7505,
        lng: -73.9934,
      },
    ];

    return { seedRequests, seedActiveDispatches, seedVehicles };
  };

  const fetchServiceRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select(
          `
          *,
          user:users(*)
        `
        )
        .in('status', ['pending', 'assigned'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        const { seedRequests, seedActiveDispatches } = generateSeedData();
        setRequests(seedRequests);
        setActiveDispatches(seedActiveDispatches);
        setSelectedRequest(seedRequests[0]);
        setUseSeedData(true);
      } else {
        setRequests(data as ServiceRequestWithUser[]);
        if (data.length > 0) {
          setSelectedRequest(data[0] as ServiceRequestWithUser);
        }
        setUseSeedData(false);
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
      const { seedRequests, seedActiveDispatches } = generateSeedData();
      setRequests(seedRequests);
      setActiveDispatches(seedActiveDispatches);
      setSelectedRequest(seedRequests[0]);
      setUseSeedData(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableVehicles = async () => {
    if (useSeedData) {
      const { seedVehicles } = generateSeedData();
      setAvailableVehicles(seedVehicles);
      if (seedVehicles.length > 0) {
        setSelectedVehicle(seedVehicles[0].id);
      }
      return;
    }

    try {
      const { data } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'available')
        .limit(10);

      if (data) {
        const vehicles: AvailableVehicle[] = data.map((v: any) => ({
          id: v.id,
          make: v.make,
          model: v.model,
          license_plate: v.license_plate || 'N/A',
          color: v.color || 'N/A',
          status: 'ready',
          fuel: 85,
          cleaned: '2h ago',
          distance: '1.2 mi away',
          timeToPickup: '~5 mins to pickup',
        }));
        setAvailableVehicles(vehicles);
        if (vehicles.length > 0) {
          setSelectedVehicle(vehicles[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const getFilteredRequests = () => {
    let filtered = requests;

    if (filterTab === 'vip') {
      filtered = filtered.filter(
        (r) =>
          r.user?.subscription?.package_type === 'gold' ||
          r.user?.subscription?.package_type === 'platinum' ||
          r.user?.subscription?.package_type === 'diamond'
      );
    } else if (filterTab === 'scheduled') {
      filtered = filtered.filter((r) => r.scheduled_time && new Date(r.scheduled_time) > new Date());
    } else if (filterTab === 'asap') {
      filtered = filtered.filter((r) => !r.scheduled_time || new Date(r.scheduled_time) <= new Date());
    }

    return filtered;
  };

  const getMemberTypeLabel = (request: ServiceRequestWithUser) => {
    const packageType = request.user?.subscription?.package_type;
    if (packageType === 'gold' || packageType === 'platinum' || packageType === 'diamond') {
      return `VIP ${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Member`;
    }
    if (packageType === 'corporate') {
      return 'Corporate Account';
    }
    return 'Standard Member';
  };

  const formatPickupTime = (scheduledTime?: string) => {
    if (!scheduledTime) return 'ASAP';
    const date = new Date(scheduledTime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} Today`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#9dabb9]">Loading service requests...</p>
        </div>
      </div>
    );
  }

  const filteredRequests = getFilteredRequests();
  const selectedVehicleData = availableVehicles.find((v) => v.id === selectedVehicle);

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-[#0f151b]">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 bg-[#1c242c] border-b border-[#283039] z-10 flex-none">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-white">Service Request & Dispatch</h2>
          <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="size-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            <span className="text-xs font-medium text-green-400 uppercase tracking-wider">
              System Operational
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#9dabb9] h-5 w-5" />
            <Input
              className="pl-10 pr-4 py-2 rounded-lg bg-[#111418] border-none text-sm text-white focus:ring-2 focus:ring-primary w-64 placeholder:text-[#5d6b79]"
              placeholder="Search requests, IDs..."
              type="text"
            />
          </div>
          <button className="relative p-2 text-[#9dabb9] hover:bg-[#283039] rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border border-[#1c242c]"></span>
          </button>
          <button className="p-2 text-[#9dabb9] hover:bg-[#283039] rounded-lg transition-colors">
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column - Incoming Requests */}
        <div className="lg:col-span-4 bg-[#111418] border-r border-[#283039] flex flex-col h-full">
          <div className="p-4 border-b border-[#283039] space-y-4 flex-none">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Incoming Requests</h3>
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {filteredRequests.length}
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilterTab('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterTab === 'all'
                    ? 'bg-[#283039] text-white'
                    : 'bg-[#1c242c] text-[#9dabb9] hover:bg-[#283039]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterTab('vip')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filterTab === 'vip'
                    ? 'bg-[#283039] text-white'
                    : 'bg-[#1c242c] text-[#9dabb9] hover:bg-[#283039]'
                }`}
              >
                VIP Priority
                <span className="size-1.5 rounded-full bg-red-500"></span>
              </button>
              <button
                onClick={() => setFilterTab('scheduled')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filterTab === 'scheduled'
                    ? 'bg-[#283039] text-white'
                    : 'bg-[#1c242c] text-[#9dabb9] hover:bg-[#283039]'
                }`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setFilterTab('asap')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filterTab === 'asap'
                    ? 'bg-[#283039] text-white'
                    : 'bg-[#1c242c] text-[#9dabb9] hover:bg-[#283039]'
                }`}
              >
                ASAP
              </button>
            </div>
          </div>

          {/* Requests List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {filteredRequests.map((request) => {
              const isSelected = selectedRequest?.id === request.id;
              const isVIP = request.user?.subscription?.package_type === 'gold' ||
                request.user?.subscription?.package_type === 'platinum' ||
                request.user?.subscription?.package_type === 'diamond';

              return (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`p-4 rounded-xl border cursor-pointer relative group transition-colors ${
                    isSelected
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-[#1c242c] border-[#283039] hover:border-primary/50'
                  }`}
                >
                  {isVIP && request.id === filteredRequests[0]?.id && (
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        New
                      </span>
                    </div>
                  )}
                  <div className="flex items-start gap-3 mb-3">
                    {request.user?.avatar_url ? (
                      <div
                        className="size-10 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${request.user.avatar_url})` }}
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-[#283039] flex items-center justify-center text-white text-sm font-bold">
                        {request.user?.full_name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-semibold text-sm">
                        {request.user?.full_name || 'Unknown User'}
                      </h4>
                      <p className="text-primary text-xs font-medium">{getMemberTypeLabel(request)}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-[#9dabb9] text-xs">
                      <MapPin className="h-4 w-4 text-[#5d6b79]" />
                      <span className="truncate">{request.pickup_address}</span>
                      <span className="mx-1">→</span>
                      <span className="truncate">{request.destination_address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#9dabb9] text-xs">
                      <Clock className="h-4 w-4 text-[#5d6b79]" />
                      <span>
                        Pickup: <strong className="text-white">{formatPickupTime(request.scheduled_time)}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                    <span className="text-xs text-[#5d6b79] font-mono">#{request.id.substring(0, 8).toUpperCase()}</span>
                    {request.luggage && (
                      <div className="flex items-center gap-1 text-[#5d6b79] text-xs">
                        <Luggage className="h-3 w-3" />
                        <span>{request.luggage} Bags</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Dispatch */}
          <div className="p-3 border-t border-[#283039] mt-auto bg-[#1c242c] flex-none">
            <h3 className="text-xs font-bold text-[#9dabb9] uppercase tracking-wider mb-2 px-1">
              Active Dispatch ({activeDispatches.length})
            </h3>
            {activeDispatches.map((dispatch) => (
              <div
                key={dispatch.id}
                className="p-3 rounded-lg bg-[#111418] border border-green-500/30 shadow-sm flex items-center gap-3"
              >
                <div className="relative">
                  {dispatch.client_avatar ? (
                    <div
                      className="size-8 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${dispatch.client_avatar})` }}
                    />
                  ) : (
                    <div className="size-8 rounded-full bg-[#283039] flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-[#9dabb9]" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 size-3 bg-green-500 border-2 border-[#111418] rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="text-xs font-bold text-white truncate">{dispatch.client_name}</p>
                    <span className="text-[10px] font-mono text-[#5d6b79]">{dispatch.timeAgo}</span>
                  </div>
                  <p className="text-[10px] text-green-400 font-medium truncate flex items-center gap-1">
                    <Car className="h-3 w-3" />
                    En route to Pickup
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Map & Details */}
        <div className="lg:col-span-8 bg-[#151b23] flex flex-col h-full overflow-y-auto">
          {selectedRequest ? (
            <>
              <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Map */}
                <div className="rounded-2xl overflow-hidden h-64 xl:h-auto bg-slate-800 relative group border border-[#283039] shadow-sm">
                  <RouteMap
                    pickupLat={selectedRequest.pickup_latitude || 40.6413}
                    pickupLng={selectedRequest.pickup_longitude || -73.7781}
                    pickupAddress={selectedRequest.pickup_address || ''}
                    destinationLat={selectedRequest.destination_latitude || 40.7648}
                    destinationLng={selectedRequest.destination_longitude || -73.9773}
                    destinationAddress={selectedRequest.destination_address || ''}
                    distance={18.2}
                    duration={45}
                    height="100%"
                  />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 uppercase tracking-wider">Est. Time</span>
                      <span className="text-white font-bold text-sm">45 Mins</span>
                    </div>
                    <div className="w-px h-8 bg-white/20 mx-2"></div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 uppercase tracking-wider">Distance</span>
                      <span className="text-white font-bold text-sm">18.2 Miles</span>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="flex flex-col gap-4">
                  <div className="bg-[#1c242c] p-5 rounded-2xl border border-[#283039] shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-white">Trip Details</h2>
                        <p className="text-sm text-[#9dabb9]">Reference #{selectedRequest.id.substring(0, 8).toUpperCase()}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-bold border border-yellow-500/20">
                        Pending Action
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1 pt-1">
                          <div className="size-3 rounded-full border-2 border-primary bg-[#1c242c]"></div>
                          <div className="w-0.5 h-10 bg-[#283039]"></div>
                          <div className="size-3 rounded-full bg-primary"></div>
                        </div>
                        <div className="flex flex-col gap-4 flex-1">
                          <div>
                            <p className="text-xs text-[#9dabb9] uppercase font-semibold">
                              Pickup • {formatPickupTime(selectedRequest.scheduled_time)}
                            </p>
                            <p className="text-sm font-medium text-white">{selectedRequest.pickup_address}</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#9dabb9] uppercase font-semibold">Drop-off</p>
                            <p className="text-sm font-medium text-white">{selectedRequest.destination_address}</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#283039]">
                        <div>
                          <p className="text-xs text-[#9dabb9] uppercase font-semibold">Desired Vehicle</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Star className="h-4 w-4 text-[#9dabb9]" />
                            <span className="text-sm font-medium text-white">
                              {selectedRequest.desired_vehicle_type === 'luxury' ? 'First Class (S-Class)' : 'SUV'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-[#9dabb9] uppercase font-semibold">Passengers</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <UserIcon className="h-4 w-4 text-[#9dabb9]" />
                            <span className="text-sm font-medium text-white">
                              {selectedRequest.passengers || 1} Adults
                              {selectedRequest.luggage ? `, ${selectedRequest.luggage} Bags` : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Requirements */}
                  {selectedRequest.special_requirements && (
                    <div className="bg-red-900/10 p-4 rounded-xl border border-red-900/30">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <h3 className="text-sm font-bold text-red-400 uppercase">Special Requirements</h3>
                      </div>
                      <p className="text-sm text-red-300 leading-relaxed">{selectedRequest.special_requirements}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle & Chauffeur Selection */}
              <div className="flex-1 px-6 pb-6 min-h-[400px]">
                <div className="bg-[#1c242c] h-full rounded-2xl border border-[#283039] shadow-sm flex flex-col">
                  <div className="flex items-center border-b border-[#283039] px-2 pt-2 flex-none">
                    <button
                      onClick={() => setActiveTab('vehicle')}
                      className={`px-6 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'vehicle'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-[#9dabb9] hover:text-white'
                      }`}
                    >
                      Select Vehicle
                    </button>
                    <button
                      onClick={() => setActiveTab('chauffeur')}
                      className={`px-6 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'chauffeur'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-[#9dabb9] hover:text-white'
                      }`}
                    >
                      Select Chauffeur
                    </button>
                  </div>

                  {activeTab === 'vehicle' && (
                    <>
                      <div className="p-4 flex flex-wrap gap-4 items-center justify-between flex-none">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white mr-2">Vehicle Class:</span>
                          <button
                            onClick={() => setVehicleClass('luxury')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                              vehicleClass === 'luxury'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-[#283039] hover:bg-[#111418] text-[#9dabb9]'
                            }`}
                          >
                            <Star className="h-4 w-4" />
                            S-Class / Luxury
                          </button>
                          <button
                            onClick={() => setVehicleClass('suv')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                              vehicleClass === 'suv'
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-[#283039] hover:bg-[#111418] text-[#9dabb9]'
                            }`}
                          >
                            SUV
                          </button>
                        </div>
                        <div className="text-sm text-[#9dabb9]">
                          <span className="font-bold text-white">
                            {availableVehicles.filter((v) => v.status === 'ready').length}
                          </span>{' '}
                          Available nearby
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
                        {availableVehicles.map((vehicle) => (
                          <label
                            key={vehicle.id}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              selectedVehicle === vehicle.id
                                ? 'border-primary bg-primary/5'
                                : 'border-[#283039] hover:border-primary/50 bg-[#111418]'
                            } ${vehicle.status === 'busy' ? 'opacity-70 grayscale' : ''}`}
                          >
                            <div className="flex items-center gap-4">
                              <input
                                type="radio"
                                name="vehicle"
                                value={vehicle.id}
                                checked={selectedVehicle === vehicle.id}
                                onChange={() => setSelectedVehicle(vehicle.id)}
                                className="size-5 text-primary border-[#283039] focus:ring-primary bg-transparent"
                              />
                              {vehicle.image ? (
                                <div
                                  className="h-16 w-24 bg-cover bg-center rounded-lg"
                                  style={{ backgroundImage: `url(${vehicle.image})` }}
                                />
                              ) : (
                                <div className="h-16 w-24 bg-[#283039] rounded-lg flex items-center justify-center">
                                  <Car className="h-8 w-8 text-[#5d6b79]" />
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-white font-bold">
                                    {vehicle.make} {vehicle.model}
                                  </h4>
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                      vehicle.status === 'ready'
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : 'bg-[#283039] text-[#9dabb9] border-[#283039]'
                                    }`}
                                  >
                                    {vehicle.status.toUpperCase()}
                                  </span>
                                </div>
                                <p className="text-sm text-[#9dabb9] mt-1">
                                  Plate: <span className="font-mono text-white">{vehicle.license_plate}</span> •{' '}
                                  {vehicle.color}
                                </p>
                                <div className="flex items-center gap-3 mt-1.5 text-xs text-[#5d6b79]">
                                  <span className="flex items-center gap-1">
                                    <Fuel className="h-3 w-3" /> {vehicle.fuel}%
                                  </span>
                                  {vehicle.cleaned && (
                                    <span className="flex items-center gap-1">
                                      <Droplet className="h-3 w-3" /> Cleaned {vehicle.cleaned}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-white">{vehicle.distance}</p>
                              <p className="text-xs text-[#5d6b79]">{vehicle.timeToPickup}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Dispatch Actions */}
                  <div className="p-4 border-t border-[#283039] bg-[#111418] rounded-b-2xl flex items-center justify-between flex-none">
                    <div className="flex items-center gap-3 text-sm text-[#9dabb9]">
                      <span className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-2 py-1 rounded-md text-xs font-bold border border-green-500/30">
                        <UserIcon className="h-4 w-4" />
                        ASSIGNED
                      </span>
                      <div className="flex items-center gap-2">
                        <span>Chauffeur: <strong className="text-white">James Sterling</strong></span>
                      </div>
                      <button className="text-primary hover:underline ml-1 text-xs font-medium">Change</button>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="px-4 py-2 rounded-lg border-[#283039] text-[#9dabb9] font-medium text-sm hover:bg-[#283039]"
                      >
                        Hold Request
                      </Button>
                      <Button className="px-6 py-2 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Dispatch Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-[#9dabb9]">
                <p>Select a request to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
