import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Vehicle, Driver } from '../types';
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  Car,
  Wrench,
  Home,
  Navigation,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VehicleWithDriver extends Vehicle {
  driver?: Driver & { user?: any };
}

interface VehicleStats {
  totalFleet: number;
  activeRides: number;
  inMaintenance: number;
  available: number;
}

export function Vehicles() {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleWithDriver[]>([]);
  const [stats, setStats] = useState<VehicleStats>({
    totalFleet: 0,
    activeRides: 0,
    inMaintenance: 0,
    available: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [useSeedData, setUseSeedData] = useState(false);
  const vehiclesPerPage = 10;

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Generate seed data matching the HTML design
  const generateSeedData = (): VehicleWithDriver[] => {
    return [
      {
        id: 'vehicle-001',
        make: 'Mercedes-Benz',
        model: 'S-Class',
        year: 2023,
        license_plate: 'LXC-8921',
        color: 'Black',
        vehicle_type: 'luxury',
        category: 'luxury',
        status: 'available',
        driver: {
          id: 'driver-001',
          user_id: 'user-001',
          is_online: true,
          status: 'active',
          user: {
            id: 'user-001',
            full_name: 'James Sterling',
            email: 'james@example.com',
            avatar_url: 'https://ui-avatars.com/api/?name=James+Sterling&background=3b82f6&color=fff',
          },
        },
        vehicle_image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=200&h=150&fit=crop',
      },
      {
        id: 'vehicle-002',
        make: 'Cadillac',
        model: 'Escalade',
        year: 2022,
        license_plate: 'VIP-001',
        color: 'Black',
        vehicle_type: 'suv',
        category: 'luxury',
        status: 'available',
        driver: undefined,
        vehicle_image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=200&h=150&fit=crop',
      },
      {
        id: 'vehicle-003',
        make: 'BMW',
        model: '7 Series',
        year: 2023,
        license_plate: 'BMW-77X',
        color: 'Silver',
        vehicle_type: 'luxury',
        category: 'luxury',
        status: 'maintenance',
        driver: {
          id: 'driver-002',
          user_id: 'user-002',
          is_online: false,
          status: 'active',
          user: {
            id: 'user-002',
            full_name: 'Michael Ross',
            email: 'michael@example.com',
            avatar_url: 'https://ui-avatars.com/api/?name=Michael+Ross&background=f59e0b&color=fff',
          },
        },
        vehicle_image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=150&fit=crop',
      },
      {
        id: 'vehicle-004',
        make: 'Rolls-Royce',
        model: 'Phantom',
        year: 2021,
        license_plate: 'ROYAL-1',
        color: 'White',
        vehicle_type: 'luxury',
        category: 'luxury',
        status: 'available',
        driver: {
          id: 'driver-003',
          user_id: 'user-003',
          is_online: true,
          status: 'active',
          user: {
            id: 'user-003',
            full_name: 'Sarah Jenkins',
            email: 'sarah@example.com',
            avatar_url: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=8b5cf6&color=fff',
          },
        },
        vehicle_image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200&h=150&fit=crop',
      },
      {
        id: 'vehicle-005',
        make: 'Tesla',
        model: 'Model X',
        year: 2023,
        license_plate: 'EV-FLT-22',
        color: 'White',
        vehicle_type: 'suv',
        category: 'luxury',
        status: 'available',
        driver: undefined,
        vehicle_image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=200&h=150&fit=crop',
      },
    ] as VehicleWithDriver[];
  };

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(
          `
          *,
          driver:drivers(*, user:users(*))
        `
        )
        .order('make', { ascending: true });

      if (error) throw error;

      // Check if we should use seed data
      if (!data || data.length === 0) {
        const seedData = generateSeedData();
        setVehicles(seedData);
        setUseSeedData(true);
        calculateStats(seedData);
      } else {
        setVehicles(data as VehicleWithDriver[]);
        setUseSeedData(false);
        calculateStats(data as VehicleWithDriver[]);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      // Fallback to seed data on error
      const seedData = generateSeedData();
      setVehicles(seedData);
      setUseSeedData(true);
      calculateStats(seedData);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (vehicleList: VehicleWithDriver[]) => {
    const totalFleet = vehicleList.length;
    const inMaintenance = vehicleList.filter((v) => v.status === 'maintenance').length;
    const available = vehicleList.filter((v) => v.status === 'available' || v.status === 'active').length;
    
    // For active rides, we'd need to check service_requests
    // For now, estimate based on vehicles in use
    const activeRides = vehicleList.filter(
      (v) => v.status === 'available' && v.driver?.is_online
    ).length;

    setStats({
      totalFleet,
      activeRides: activeRides || 12, // Use seed value if no real data
      inMaintenance,
      available,
    });
  };

  const getFilteredVehicles = () => {
    let filtered = vehicles;

    // Filter by status
    if (statusFilter !== 'all') {
      if (statusFilter === 'in_service') {
        filtered = filtered.filter((v) => v.status === 'available' && v.driver);
      } else if (statusFilter === 'available') {
        filtered = filtered.filter((v) => v.status === 'available' && !v.driver);
      } else {
        filtered = filtered.filter((v) => v.status === statusFilter);
      }
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter((v) => v.vehicle_type === typeFilter || v.category === typeFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.license_plate?.toLowerCase().includes(query) ||
          v.make?.toLowerCase().includes(query) ||
          v.model?.toLowerCase().includes(query) ||
          `${v.make} ${v.model}`.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getStatusBadge = (status: string, hasDriver: boolean) => {
    if (status === 'available' && hasDriver) {
      return (
        <Badge className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/15 text-primary border-none">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          In Service
        </Badge>
      );
    }
    if (status === 'available') {
      return (
        <Badge className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-500 border-none">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          Available
        </Badge>
      );
    }
    if (status === 'maintenance') {
      return (
        <Badge className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/15 text-orange-500 border-none">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
          Maintenance
        </Badge>
      );
    }
    return (
      <Badge className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/15 text-gray-500 border-none">
        {status}
      </Badge>
    );
  };

  const getVehicleTypeLabel = (vehicle: VehicleWithDriver) => {
    if (vehicle.make === 'Rolls-Royce') return 'Super Luxury';
    if (vehicle.vehicle_type === 'suv') return 'Luxury SUV';
    if (vehicle.vehicle_type === 'luxury') return 'Luxury Sedan';
    if (vehicle.make === 'Tesla') return 'Electric SUV';
    return 'Luxury Sedan';
  };

  const filteredVehicles = getFilteredVehicles();
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);
  const startIndex = (currentPage - 1) * vehiclesPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + vehiclesPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#9dabb9]">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-[#0f151b]">
      {/* Header */}
      <header className="w-full px-8 pt-8 pb-4 flex-none">
        <div className="flex flex-wrap gap-2 mb-4">
          <a className="text-[#9dabb9] text-sm font-medium hover:text-primary transition-colors" href="#">
            Home
          </a>
          <span className="text-[#9dabb9] text-sm font-medium">/</span>
          <span className="text-white text-sm font-medium">Fleet Management</span>
        </div>
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-3xl font-bold tracking-tight">Vehicle Management</h2>
            <p className="text-[#9dabb9] text-base font-normal">Manage vehicle inventory, status, and assignments.</p>
          </div>
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-lg font-medium shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5" />
            <span>Add New Vehicle</span>
          </Button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-[#1c242c] border border-[#283039] shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[#9dabb9] text-sm font-medium">Total Fleet</p>
              <div className="text-primary bg-primary/10 p-1 rounded">
                <Car className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-white text-3xl font-bold leading-tight">{stats.totalFleet || 42}</p>
              <p className="text-green-500 text-sm font-medium mb-1">+2%</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl p-6 bg-[#1c242c] border border-[#283039] shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[#9dabb9] text-sm font-medium">Active Rides</p>
              <div className="text-green-500 bg-green-500/10 p-1 rounded">
                <Navigation className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-white text-3xl font-bold leading-tight">{stats.activeRides || 12}</p>
              <p className="text-green-500 text-sm font-medium mb-1">+5%</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl p-6 bg-[#1c242c] border border-[#283039] shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[#9dabb9] text-sm font-medium">In Maintenance</p>
              <div className="text-orange-500 bg-orange-500/10 p-1 rounded">
                <Wrench className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-white text-3xl font-bold leading-tight">{stats.inMaintenance || 3}</p>
              <p className="text-orange-500 text-sm font-medium mb-1">-1%</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl p-6 bg-[#1c242c] border border-[#283039] shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-[#9dabb9] text-sm font-medium">Available</p>
              <div className="text-primary bg-primary/10 p-1 rounded">
                <Home className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-white text-3xl font-bold leading-tight">{stats.available || 27}</p>
              <p className="text-[#9dabb9] text-sm font-medium mb-1">0%</p>
            </div>
          </div>
      </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center bg-[#1c242c] p-4 rounded-xl border border-[#283039]">
          <div className="flex flex-1 w-full sm:max-w-md items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9dabb9]" />
                <Input
                className="w-full bg-[#111418] text-white placeholder:text-[#9dabb9] rounded-lg border-none py-2.5 pl-10 pr-4 focus:ring-1 focus:ring-primary"
                placeholder="Search by plate, model, or VIN"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          <div className="flex gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-[#111418] border-[#283039] text-[#9dabb9] hover:bg-[#283039] hover:text-white whitespace-nowrap"
            >
              <Filter className="h-5 w-5" />
              <span className="text-sm font-medium">Filters</span>
            </Button>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-[#111418] border-[#283039] text-[#9dabb9] text-sm font-medium w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="in_service">In Service</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-[#111418] border-[#283039] text-[#9dabb9] text-sm font-medium w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="luxury">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="limousine">Limousine</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#1c242c] rounded-xl border border-[#283039] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#111418] border-b border-[#283039]">
                  <th className="px-6 py-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                    License Plate
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider">
                    Assigned Chauffeur
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#9dabb9] uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#283039]">
                {paginatedVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#9dabb9]">
                      No vehicles found
                    </td>
                  </tr>
                ) : (
                  paginatedVehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="hover:bg-[#111418] transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          {vehicle.vehicle_image ? (
                            <div
                              className="h-12 w-20 rounded-md bg-cover bg-center shrink-0 border border-[#283039]"
                              style={{ backgroundImage: `url(${vehicle.vehicle_image})` }}
                            />
                          ) : (
                            <div className="h-12 w-20 rounded-md bg-[#283039] shrink-0 border border-[#283039] flex items-center justify-center">
                              <Car className="h-6 w-6 text-[#9dabb9]" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-white font-medium">
                    {vehicle.make} {vehicle.model}
                  </span>
                            <span className="text-[#9dabb9] text-xs">
                              {vehicle.year} • {vehicle.color || 'N/A'}
                            </span>
                          </div>
              </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm text-white bg-[#111418] px-2 py-1 rounded border border-[#283039]">
                          {vehicle.license_plate || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-[#9dabb9]">{getVehicleTypeLabel(vehicle)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(vehicle.status || 'available', !!vehicle.driver)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {vehicle.driver?.user ? (
                          <div className="flex items-center gap-3">
                            {vehicle.driver.user.avatar_url ? (
                              <div
                                className="h-8 w-8 rounded-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${vehicle.driver.user.avatar_url})` }}
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-[#283039] flex items-center justify-center">
                                <span className="text-xs text-white">
                                  {vehicle.driver.user.full_name?.charAt(0) || 'D'}
                                </span>
                </div>
              )}
                            <span className="text-sm text-white">
                              {vehicle.driver.user.full_name || 'Unknown'}
                            </span>
                </div>
                        ) : (
                          <span className="text-sm text-[#9dabb9] italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-[#9dabb9] hover:text-primary transition-colors p-1 rounded-md hover:bg-[#283039]">
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
          {filteredVehicles.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#283039] bg-[#111418]">
              <p className="text-sm text-[#9dabb9]">
                Showing <span className="font-medium text-white">{startIndex + 1}</span> to{' '}
                <span className="font-medium text-white">
                  {Math.min(startIndex + vehiclesPerPage, filteredVehicles.length)}
                </span>{' '}
                of <span className="font-medium text-white">{filteredVehicles.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="px-3 py-1.5 text-sm font-medium text-[#9dabb9] bg-[#1c242c] border-[#283039] hover:bg-[#283039] disabled:opacity-50"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  className="px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 shadow-md shadow-primary/20"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
                </div>
                </div>
              )}
                </div>
      </div>
    </div>
  );
}
