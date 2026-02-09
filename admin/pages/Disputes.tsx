import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime, formatDate } from '../utils/format';
import type { Dispute, ServiceRequest } from '../types';
import { RouteMap } from '../components/RouteMap';
import {
  Search,
  Bell,
  AlertCircle,
  MessageSquare,
  CheckCircle,
  MapPin,
  Navigation,
  FileText,
  Star,
  Car,
  User,
} from 'lucide-react';

interface DisputeWithDetails extends Dispute {
  service_request?: ServiceRequest & {
    user?: any;
    driver?: any & { user?: any };
    vehicle?: any;
  };
  user?: any;
  driver?: any & { user?: any };
}

export function Disputes() {
  const [disputes, setDisputes] = useState<DisputeWithDetails[]>([]);
  const [selectedDispute, setSelectedDispute] = useState<DisputeWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState<'open' | 'pending' | 'escalated' | 'resolved'>('open');
  const [resolutionType, setResolutionType] = useState<'refund' | 'dismiss' | 'suspend' | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    // Load seed data first if no disputes exist
    loadSeedData();
    fetchDisputes();

    const channel = supabase
      .channel('disputes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'disputes',
        },
        () => {
          fetchDisputes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Generate mock seed data for demonstration (client-side only)
  const generateMockDisputes = (): DisputeWithDetails[] => {
    return [
      {
        id: '83921',
        service_request_id: 'sr-001',
        user_id: 'user-001',
        type: 'fare_discrepancy',
        description:
          "The driver dropped me off at the corner but didn't end the trip on the app. I checked my receipt later and saw I was charged for another 15 minutes of driving. I was already in the restaurant.",
        requested_refund_amount: 1500,
        status: 'open',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: 'user-001',
          full_name: 'Jane Doe',
          email: 'jane.doe@example.com',
          avatar_url: 'https://ui-avatars.com/api/?name=Jane+Doe&background=10b981&color=fff',
          profile_photo: 'https://ui-avatars.com/api/?name=Jane+Doe&background=10b981&color=fff',
        },
        service_request: {
          id: 'sr-001',
          user_id: 'user-001',
          request_type: 'ride',
          pickup_address: '550 Market St, Westlands, Nairobi',
          destination_address: '2200 Mission St, Nairobi CBD',
          status: 'completed',
          created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          pickup_latitude: -1.2625,
          pickup_longitude: 36.8022,
          destination_latitude: -1.2921,
          destination_longitude: 36.8219,
          distance: 12.4,
          duration: 32,
          user: {
            id: 'user-001',
            full_name: 'Jane Doe',
            email: 'jane.doe@example.com',
          },
          driver: {
            id: 'driver-001',
            user_id: 'driver-user-001',
            user: {
              id: 'driver-user-001',
              full_name: 'Mike Smith',
              email: 'mike.smith@example.com',
              avatar_url: 'https://ui-avatars.com/api/?name=Mike+Smith&background=3b82f6&color=fff',
            },
          },
          vehicle: {
            id: 'vehicle-001',
            make: 'Toyota',
            model: 'Prius',
            license_plate: 'XYZ-1234',
          },
        },
      },
      {
        id: '83918',
        service_request_id: 'sr-002',
        user_id: 'user-002',
        type: 'vehicle_issue',
        description: 'Car was dirty and smelled like smoke. Very unprofessional service.',
        requested_refund_amount: 0,
        status: 'under_review',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: 'user-002',
          full_name: 'Mike Rogers',
          email: 'mike.rogers@example.com',
          avatar_url: 'https://ui-avatars.com/api/?name=Mike+Rogers&background=f59e0b&color=fff',
        },
        service_request: {
          id: 'sr-002',
          user_id: 'user-002',
          request_type: 'ride',
          pickup_address: 'Westside Plaza, Nairobi',
          destination_address: 'Central Station, Nairobi',
          status: 'completed',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          pickup_latitude: -1.2725,
          pickup_longitude: 36.8122,
          destination_latitude: -1.2821,
          destination_longitude: 36.8319,
          distance: 8.5,
          duration: 25,
          user: {
            id: 'user-002',
            full_name: 'Mike Rogers',
            email: 'mike.rogers@example.com',
          },
        },
      },
      {
        id: '83892',
        service_request_id: 'sr-003',
        user_id: 'user-003',
        type: 'other',
        description: 'Left umbrella in the backseat. Need help retrieving it.',
        requested_refund_amount: 0,
        status: 'open',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: 'user-003',
          full_name: 'Sarah Lee',
          email: 'sarah.lee@example.com',
          avatar_url: 'https://ui-avatars.com/api/?name=Sarah+Lee&background=8b5cf6&color=fff',
        },
        service_request: {
          id: 'sr-003',
          user_id: 'user-003',
          request_type: 'ride',
          pickup_address: 'North Hills, Nairobi',
          destination_address: 'Tech Park, Nairobi',
          status: 'completed',
          created_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          pickup_latitude: -1.2525,
          pickup_longitude: 36.7922,
          destination_latitude: -1.2721,
          destination_longitude: 36.8119,
          distance: 6.2,
          duration: 18,
          user: {
            id: 'user-003',
            full_name: 'Sarah Lee',
            email: 'sarah.lee@example.com',
          },
        },
      },
    ];
  };

  const loadSeedData = async () => {
    // Skip seed data loading - use mock data client-side instead
    // This avoids RLS policy issues
    return;
  };

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('disputes')
        .select(`
          *,
          user:users!disputes_user_id_fkey(*),
          service_request:service_requests(
            *,
            user:users!service_requests_user_id_fkey(*),
            driver:drivers(*, user:users!drivers_user_id_fkey(*)),
            vehicle:vehicles(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map disputes to include driver from service request if needed
      const disputesWithDetails = (data || []).map((dispute: any) => ({
        ...dispute,
        driver: dispute.service_request?.driver || null,
        // Ensure service request has proper structure with coordinates
        service_request: dispute.service_request
          ? {
              ...dispute.service_request,
              pickup_latitude:
                (dispute.service_request as any).pickup_latitude ||
                dispute.service_request.pickup_location?.coordinates?.[1] ||
                -1.2625,
              pickup_longitude:
                (dispute.service_request as any).pickup_longitude ||
                dispute.service_request.pickup_location?.coordinates?.[0] ||
                36.8022,
              destination_latitude:
                (dispute.service_request as any).destination_latitude ||
                dispute.service_request.destination?.coordinates?.[1] ||
                -1.2921,
              destination_longitude:
                (dispute.service_request as any).destination_longitude ||
                dispute.service_request.destination?.coordinates?.[0] ||
                36.8219,
              distance: (dispute.service_request as any).distance || 12.4,
              duration: (dispute.service_request as any).duration || 32,
            }
          : null,
      }));

      // If no disputes found, use mock data for demonstration
      if (disputesWithDetails.length === 0) {
        const mockDisputes = generateMockDisputes();
        setDisputes(mockDisputes);
        if (!selectedDispute && mockDisputes.length > 0) {
          setSelectedDispute(mockDisputes[0]);
        }
      } else {
        setDisputes(disputesWithDetails);
        if (disputesWithDetails.length > 0 && !selectedDispute) {
          setSelectedDispute(disputesWithDetails[0]);
        } else if (disputesWithDetails.length > 0 && selectedDispute) {
          // Update selected dispute if it exists in the new data
          const updated = disputesWithDetails.find((d) => d.id === selectedDispute.id);
          if (updated) setSelectedDispute(updated);
        }
      }
    } catch (error) {
      console.error('Error fetching disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredDisputes = () => {
    let filtered = disputes;

    // Filter by status tab
    if (statusTab === 'open') {
      filtered = filtered.filter((d) => d.status === 'open');
    } else if (statusTab === 'pending') {
      filtered = filtered.filter((d) => d.status === 'under_review');
    } else if (statusTab === 'resolved') {
      filtered = filtered.filter((d) => d.status === 'resolved' || d.status === 'rejected');
    } else if (statusTab === 'escalated') {
      // You might need to add an escalated status or flag
      filtered = filtered.filter((d) => d.status === 'under_review');
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.id.toLowerCase().includes(query) ||
          d.user?.full_name?.toLowerCase().includes(query) ||
          d.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getSeverity = (dispute: DisputeWithDetails): 'high' | 'medium' | 'low' => {
    // Determine severity based on type or other factors
    if (dispute.type === 'driver_behavior' || dispute.type === 'service_quality') {
      return 'high';
    } else if (dispute.type === 'fare_discrepancy' || dispute.type === 'route_issue') {
      return 'medium';
    }
    return 'low';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'resolved') {
      return (
        <Badge className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
          Resolved
        </Badge>
      );
    } else if (status === 'under_review') {
      return (
        <Badge className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
          Investigation in Progress
        </Badge>
      );
    } else if (status === 'rejected') {
      return (
        <Badge className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
          Rejected
        </Badge>
      );
    }
    return (
      <Badge className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
        Open
      </Badge>
    );
  };

  const handleResolve = async () => {
    if (!selectedDispute || !resolutionType) return;

    setResolving(true);
    try {
      let newStatus = 'resolved';
      let resolution_type: 'full_refund' | 'partial_refund' | 'no_refund' | 'credit' = 'no_refund';

      if (resolutionType === 'refund') {
        resolution_type = 'full_refund';
        newStatus = 'resolved';
      } else if (resolutionType === 'dismiss') {
        resolution_type = 'no_refund';
        newStatus = 'rejected';
      } else if (resolutionType === 'suspend') {
        resolution_type = 'no_refund';
        newStatus = 'resolved';
        // You might want to suspend the driver here
      }

      const { error } = await supabase
        .from('disputes')
        .update({
          status: newStatus,
          resolution_type,
          resolution_notes: resolutionNote,
          resolved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedDispute.id);

      if (error) throw error;

      setResolutionType(null);
      setResolutionNote('');
      fetchDisputes();
    } catch (error) {
      console.error('Error resolving dispute:', error);
      alert('Failed to resolve dispute. Please try again.');
    } finally {
      setResolving(false);
    }
  };

  const filteredDisputes = getFilteredDisputes();
  const openCount = disputes.filter((d) => d.status === 'open').length;

  if (loading && disputes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#9dabb9]">Loading disputes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-[#0f151b]">
      {/* Top Header */}
      <header className="h-16 border-b border-[#283039] bg-[#111418] flex items-center justify-between px-6 flex-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#9dabb9] text-sm font-medium">
            <a className="hover:text-white" href="#">
              Dashboard
            </a>
            <span>/</span>
            <span className="text-white">Dispute Resolution</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-[#9dabb9] hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="h-8 w-8 rounded-full bg-[#283039] ring-2 ring-[#283039]"></div>
        </div>
      </header>

      {/* Main Workspace: Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Dispute List */}
        <div className="w-full md:w-[400px] flex flex-col border-r border-[#283039] bg-[#111418] flex-none z-10">
          {/* Search & Tabs */}
          <div className="p-4 border-b border-[#283039] bg-[#111418]">
            <div className="relative w-full mb-4">
              <Search className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9dabb9] h-5 w-5" />
              <Input
                className="block w-full rounded-lg border-none bg-[#283039] py-2.5 pl-10 pr-3 text-white placeholder-[#9dabb9] focus:ring-2 focus:ring-primary sm:text-sm"
                placeholder="Search ticket ID or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-6 overflow-x-auto no-scrollbar border-b border-[#3b4754]">
              <button
                onClick={() => setStatusTab('open')}
                className={`pb-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  statusTab === 'open'
                    ? 'border-primary text-white'
                    : 'border-transparent text-[#9dabb9] hover:text-white'
                }`}
              >
                Open ({openCount})
              </button>
              <button
                onClick={() => setStatusTab('pending')}
                className={`pb-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  statusTab === 'pending'
                    ? 'border-primary text-white'
                    : 'border-transparent text-[#9dabb9] hover:text-white'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusTab('escalated')}
                className={`pb-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  statusTab === 'escalated'
                    ? 'border-primary text-white'
                    : 'border-transparent text-[#9dabb9] hover:text-white'
                }`}
              >
                Escalated
              </button>
              <button
                onClick={() => setStatusTab('resolved')}
                className={`pb-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  statusTab === 'resolved'
                    ? 'border-primary text-white'
                    : 'border-transparent text-[#9dabb9] hover:text-white'
                }`}
              >
                Resolved
              </button>
            </div>
      </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto">
            {filteredDisputes.length === 0 ? (
              <div className="p-8 text-center text-[#9dabb9]">
                <p className="text-sm">No disputes found</p>
              </div>
            ) : (
              filteredDisputes.map((dispute) => {
                const severity = getSeverity(dispute);
                const isSelected = selectedDispute?.id === dispute.id;

                return (
                  <div
                    key={dispute.id}
                    onClick={() => setSelectedDispute(dispute)}
                    className={`p-4 border-b border-[#283039] cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#1c252e] border-l-4 border-l-primary'
                        : 'hover:bg-[#1c252e]/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-[#9dabb9]">#{dispute.id.substring(0, 5)}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                          severity === 'high'
                            ? 'bg-red-500/20 text-red-400 border-red-500/20'
                            : severity === 'medium'
                            ? 'bg-orange-500/20 text-orange-400 border-orange-500/20'
                            : 'bg-[#3b4754] text-[#9dabb9] border-[#3b4754]'
                        }`}
                      >
                        {severity === 'high' ? 'High' : severity === 'medium' ? 'Medium' : 'Low'} Severity
                      </span>
                    </div>
                    <h3 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-white' : 'text-[#9dabb9]'}`}>
                      {dispute.type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </h3>
                    <p className={`text-xs mb-3 line-clamp-2 ${isSelected ? 'text-[#9dabb9]' : 'text-[#5d6b79]'}`}>
                      {dispute.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {dispute.user?.avatar_url || dispute.user?.profile_photo ? (
                          <div
                            className="w-5 h-5 rounded-full bg-cover"
                            style={{
                              backgroundImage: `url(${dispute.user.avatar_url || dispute.user.profile_photo})`,
                            }}
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#283039] flex items-center justify-center">
                            <User className="h-3 w-3 text-[#9dabb9]" />
                          </div>
                        )}
                        <span className={`text-xs ${isSelected ? 'text-[#9dabb9]' : 'text-[#5d6b79]'}`}>
                          {dispute.user?.full_name || 'Unknown'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#5d6b79]">{formatRelativeTime(dispute.created_at)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Detail View */}
        {selectedDispute ? (
          <div className="flex-1 overflow-y-auto bg-[#0f151b] p-6 md:p-10">
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
              {/* Detail Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-white">Dispute #{selectedDispute.id.substring(0, 5)}</h2>
                    {getStatusBadge(selectedDispute.status)}
                  </div>
                  <p className="text-[#9dabb9]">
                    Created on {formatDate(selectedDispute.created_at)} • Type:{' '}
                    <span className="text-white">{selectedDispute.type.replace(/_/g, ' ')}</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button className="px-4 py-2 rounded-lg bg-[#283039] text-white hover:bg-[#3b4754] font-medium text-sm flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Message Users
                  </Button>
                  <Button
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-medium text-sm shadow-lg shadow-primary/20 flex items-center gap-2"
                    onClick={handleResolve}
                    disabled={!resolutionType || resolving}
                  >
                    <CheckCircle className="h-5 w-5" />
                    Resolve Dispute
                  </Button>
                </div>
              </div>

              {/* Detail Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Column */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  {/* Map Card */}
                  {selectedDispute.service_request && (
                    <div className="bg-[#1c252e] rounded-xl overflow-hidden border border-[#283039] shadow-sm">
                      <div className="relative">
                        <RouteMap
                          pickupLat={
                            (selectedDispute.service_request as any).pickup_latitude ||
                            selectedDispute.service_request.pickup_location?.coordinates?.[1] ||
                            -1.2625
                          }
                          pickupLng={
                            (selectedDispute.service_request as any).pickup_longitude ||
                            selectedDispute.service_request.pickup_location?.coordinates?.[0] ||
                            36.8022
                          }
                          pickupAddress={selectedDispute.service_request.pickup_address || 'Pickup Location'}
                          destinationLat={
                            (selectedDispute.service_request as any).destination_latitude ||
                            selectedDispute.service_request.destination?.coordinates?.[1] ||
                            -1.2921
                          }
                          destinationLng={
                            (selectedDispute.service_request as any).destination_longitude ||
                            selectedDispute.service_request.destination?.coordinates?.[0] ||
                            36.8219
                          }
                          destinationAddress={selectedDispute.service_request.destination_address || 'Destination Location'}
                          distance={(selectedDispute.service_request as any).distance || 12.4}
                          duration={(selectedDispute.service_request as any).duration || 32}
                          height="256px"
                        />
                        <div className="absolute bottom-4 left-4 bg-[#111418]/90 backdrop-blur-md px-3 py-2 rounded-lg border border-[#283039] flex items-center gap-3 z-10">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-[#9dabb9] uppercase tracking-wider font-bold">Distance</span>
                            <span className="text-white text-sm font-semibold">
                              {(selectedDispute.service_request as any).distance?.toFixed(1) || '12.4'} km
                            </span>
                          </div>
                          <div className="w-px h-8 bg-[#283039]"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-[#9dabb9] uppercase tracking-wider font-bold">Duration</span>
                            <span className="text-white text-sm font-semibold">
                              {(selectedDispute.service_request as any).duration || 32} min
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex items-center justify-between bg-[#1c252e]">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Navigation className="text-green-500 h-5 w-5" />
                            <span className="text-sm text-white">
                              {selectedDispute.service_request.pickup_address || 'N/A'}
                            </span>
                          </div>
                          <div className="w-8 h-px bg-[#3b4754]"></div>
                          <div className="flex items-center gap-2">
                            <MapPin className="text-red-500 h-5 w-5" />
                            <span className="text-sm text-white">
                              {selectedDispute.service_request.destination_address || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <button className="text-primary text-xs font-bold uppercase tracking-wide hover:underline">
                          View Full Route Logs
                        </button>
      </div>
            </div>
                  )}

                  {/* Evidence & Statements */}
                  <div className="bg-[#1c252e] rounded-xl border border-[#283039] p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#9dabb9]" />
                      Evidence & Statements
                    </h3>
                    <div className="flex flex-col gap-4">
                      {/* Rider Complaint */}
                      <div className="bg-[#111418] rounded-lg p-4 border border-[#283039]">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-[#9dabb9] uppercase">Rider Complaint</span>
                          <span className="text-[#9dabb9] text-[16px]">"</span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">{selectedDispute.description}</p>
                      </div>

                      {/* Driver Rebuttal */}
                      {selectedDispute.service_request?.driver && (
                        <div className="bg-[#111418] rounded-lg p-4 border border-[#283039]">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-[#9dabb9] uppercase">Driver Rebuttal</span>
                            <span className="text-[#9dabb9] text-[16px]">"</span>
                          </div>
                          <p className="text-white text-sm leading-relaxed">
                            {selectedDispute.resolution_notes || 'No response from driver yet.'}
                          </p>
                        </div>
                )}
              </div>
                  </div>
            </div>

                {/* Sidebar Info Column */}
                <div className="flex flex-col gap-6">
                  {/* Resolution Actions */}
                  <div className="bg-[#1c252e] rounded-xl border border-[#283039] p-5 shadow-lg">
                    <h3 className="text-sm font-bold text-[#9dabb9] uppercase mb-4 tracking-wide">Resolution Actions</h3>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-[#3b4754] bg-[#111418] cursor-pointer hover:border-primary transition-colors">
                        <input
                          type="radio"
                          name="resolution"
                          checked={resolutionType === 'refund'}
                          onChange={() => setResolutionType('refund')}
                          className="text-primary focus:ring-primary bg-[#283039] border-gray-600"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white">Refund Rider</span>
                          <span className="text-xs text-[#9dabb9]">Adjust fare</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-[#3b4754] bg-[#111418] cursor-pointer hover:border-primary transition-colors">
                        <input
                          type="radio"
                          name="resolution"
                          checked={resolutionType === 'dismiss'}
                          onChange={() => setResolutionType('dismiss')}
                          className="text-primary focus:ring-primary bg-[#283039] border-gray-600"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white">Dismiss Claim</span>
                          <span className="text-xs text-[#9dabb9]">No violation found</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-red-900/30 bg-[#111418] cursor-pointer hover:border-red-500 transition-colors">
                        <input
                          type="radio"
                          name="resolution"
                          checked={resolutionType === 'suspend'}
                          onChange={() => setResolutionType('suspend')}
                          className="text-red-500 focus:ring-red-500 bg-[#283039] border-gray-600"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white">Suspend Driver</span>
                          <span className="text-xs text-[#9dabb9]">Temporary ban (24h)</span>
                        </div>
                </label>
                      <Textarea
                        className="w-full mt-2 bg-[#111418] border border-[#3b4754] rounded-lg p-3 text-sm text-white placeholder-[#5d6b79] focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                        placeholder="Add an internal note..."
                        rows={3}
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                      />
                      <Button
                        className="mt-2 w-full bg-primary text-white py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90"
                        onClick={handleResolve}
                        disabled={!resolutionType || resolving}
                      >
                        Submit Decision
                      </Button>
                    </div>
                  </div>

                  {/* Rider Profile */}
                  {selectedDispute.user && (
                    <div className="bg-[#1c252e] rounded-xl border border-[#283039] p-5">
                      <h3 className="text-xs font-bold text-[#9dabb9] uppercase mb-4 tracking-wide">Rider Profile</h3>
                      <div className="flex items-center gap-4 mb-4">
                        {selectedDispute.user.avatar_url || selectedDispute.user.profile_photo ? (
                          <div
                            className="w-12 h-12 rounded-full bg-cover"
                            style={{
                              backgroundImage: `url(${selectedDispute.user.avatar_url || selectedDispute.user.profile_photo})`,
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#283039] flex items-center justify-center">
                            <User className="h-6 w-6 text-[#9dabb9]" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-white font-bold text-base">
                            {selectedDispute.user.full_name || 'Unknown User'}
                          </h4>
                          <div className="flex items-center gap-1 text-[#9dabb9] text-xs">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-white font-medium">4.8</span>
                            <span>• 42 Trips</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 rounded bg-[#283039] text-[#9dabb9]">Premium Member</span>
                        <span className="px-2 py-1 rounded bg-[#283039] text-[#9dabb9]">Verified</span>
                      </div>
              </div>
            )}

                  {/* Driver Profile */}
                  {selectedDispute.service_request?.driver?.user && (
                    <div className="bg-[#1c252e] rounded-xl border border-[#283039] p-5">
                      <h3 className="text-xs font-bold text-[#9dabb9] uppercase mb-4 tracking-wide">Driver Profile</h3>
                      <div className="flex items-center gap-4 mb-4">
                        {selectedDispute.service_request.driver.user.avatar_url ||
                        selectedDispute.service_request.driver.user.profile_photo ? (
                          <div
                            className="w-12 h-12 rounded-full bg-cover"
                            style={{
                              backgroundImage: `url(${selectedDispute.service_request.driver.user.avatar_url || selectedDispute.service_request.driver.user.profile_photo})`,
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#283039] flex items-center justify-center">
                            <User className="h-6 w-6 text-[#9dabb9]" />
                          </div>
                        )}
            <div>
                          <h4 className="text-white font-bold text-base">
                            {selectedDispute.service_request.driver.user.full_name || 'Unknown Driver'}
                          </h4>
                          <div className="flex items-center gap-1 text-[#9dabb9] text-xs">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-white font-medium">4.7</span>
                            <span>• 1,205 Trips</span>
                          </div>
                        </div>
                      </div>
                      {selectedDispute.service_request.vehicle && (
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="bg-[#111418] rounded p-2 border border-[#283039]">
                            <p className="text-[10px] text-[#9dabb9] uppercase">Vehicle</p>
                            <p className="text-xs text-white font-medium">
                              {selectedDispute.service_request.vehicle.make} {selectedDispute.service_request.vehicle.model}
                            </p>
                          </div>
                          <div className="bg-[#111418] rounded p-2 border border-[#283039]">
                            <p className="text-[10px] text-[#9dabb9] uppercase">Plate</p>
                            <p className="text-xs text-white font-medium">
                              {selectedDispute.service_request.vehicle.license_plate || 'N/A'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#0f151b]">
            <div className="text-center text-[#9dabb9]">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a dispute to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
