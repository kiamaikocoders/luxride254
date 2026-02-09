import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { formatRelativeTime, formatDate } from '../utils/format';
import type { Escalation, ServiceRequest } from '../types';
import {
  AlertTriangle,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Filter,
  User,
  MapPin,
} from 'lucide-react';

interface EscalationWithDetails extends Escalation {
  service_request?: ServiceRequest & {
    user?: any;
    driver?: any & { user?: any };
  };
}

export function Escalations() {
  const [escalations, setEscalations] = useState<EscalationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEscalation, setSelectedEscalation] = useState<EscalationWithDetails | null>(null);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [resolving, setResolving] = useState(false);
  const [useSeedData, setUseSeedData] = useState(false);

  useEffect(() => {
    fetchEscalations();

    const channel = supabase
      .channel('escalations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'escalations',
        },
        () => {
          fetchEscalations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Generate seed data
  const generateSeedData = (): EscalationWithDetails[] => {
    return [
      {
        id: 'esc-001',
        service_request_id: 'sr-001',
        type: 'dispatch_timeout',
        priority: 'critical',
        status: 'open',
        description: 'Service request has been pending for over 5 minutes without driver assignment. Urgent action required.',
        created_at: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        service_request: {
          id: 'sr-001',
          user_id: 'user-001',
          request_type: 'ride',
          pickup_address: 'Jomo Kenyatta International Airport, Terminal 1A',
          destination_address: 'Westlands, Nairobi',
          status: 'pending',
          created_at: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
          user: {
            id: 'user-001',
            full_name: 'Sarah Johnson',
            email: 'sarah@example.com',
            avatar_url: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff',
          },
        },
      },
      {
        id: 'esc-002',
        service_request_id: 'sr-002',
        type: 'driver_timeout',
        priority: 'high',
        status: 'open',
        description: 'Assigned driver has not accepted the ride request within the 3-minute timeout period.',
        created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        service_request: {
          id: 'sr-002',
          user_id: 'user-002',
          request_type: 'ride',
          pickup_address: 'Nairobi CBD, Kenyatta Avenue',
          destination_address: 'Kenyatta University, Thika Road',
          status: 'assigned',
          created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
          user: {
            id: 'user-002',
            full_name: 'Michael Chen',
            email: 'michael@example.com',
            avatar_url: 'https://ui-avatars.com/api/?name=Michael+Chen&background=10b981&color=fff',
          },
          driver: {
            id: 'driver-001',
            user: {
              full_name: 'John Driver',
            },
          },
        },
      },
      {
        id: 'esc-003',
        service_request_id: 'sr-003',
        type: 'payment_failure',
        priority: 'high',
        status: 'in_progress',
        description: 'Payment verification failed for subscription renewal. User account needs attention.',
        created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        service_request: {
          id: 'sr-003',
          user_id: 'user-003',
          request_type: 'ride',
          pickup_address: 'Karen, Nairobi',
          destination_address: 'JKIA Terminal 1',
          status: 'pending',
          created_at: new Date(Date.now() - 46 * 60 * 1000).toISOString(),
          user: {
            id: 'user-003',
            full_name: 'David Kimani',
            email: 'david@example.com',
            avatar_url: 'https://ui-avatars.com/api/?name=David+Kimani&background=f59e0b&color=fff',
          },
        },
      },
      {
        id: 'esc-004',
        service_request_id: 'sr-004',
        type: 'ride_timeout',
        priority: 'medium',
        status: 'resolved',
        description: 'Ride duration exceeded expected time by more than 30 minutes. Driver contacted and issue resolved.',
        resolution_notes: 'Driver encountered heavy traffic on Mombasa Road. Passengers informed and arrived safely. No further action needed.',
        resolved_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        service_request: {
          id: 'sr-004',
          user_id: 'user-004',
          request_type: 'ride',
          pickup_address: 'Westlands, Ring Road',
          destination_address: 'Thika Road, Kasarani',
          status: 'completed',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'user-004',
            full_name: 'Emily Wanjiku',
            email: 'emily@example.com',
            avatar_url: 'https://ui-avatars.com/api/?name=Emily+Wanjiku&background=8b5cf6&color=fff',
          },
        },
      },
      {
        id: 'esc-005',
        service_request_id: 'sr-005',
        type: 'technical_problem',
        priority: 'medium',
        status: 'open',
        description: 'GPS tracking malfunction detected for vehicle XYZ-1234. Real-time location updates not working.',
        created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        service_request: {
          id: 'sr-005',
          user_id: 'user-005',
          request_type: 'ride',
          pickup_address: 'Parklands, Nairobi',
          destination_address: 'Runda, Kiambu',
          status: 'in_progress',
          created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          user: {
            id: 'user-005',
            full_name: 'James Otieno',
            email: 'james@example.com',
            avatar_url: 'https://ui-avatars.com/api/?name=James+Otieno&background=ef4444&color=fff',
          },
        },
      },
    ] as EscalationWithDetails[];
  };

  const fetchEscalations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('escalations')
        .select(
          `
          *,
          service_request:service_requests(*, user:users(*), driver:drivers(*, user:users(*)))
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        const seedData = generateSeedData();
        setEscalations(seedData);
        setUseSeedData(true);
      } else {
        setEscalations(data as EscalationWithDetails[]);
        setUseSeedData(false);
      }
    } catch (error) {
      console.error('Error fetching escalations:', error);
      const seedData = generateSeedData();
      setEscalations(seedData);
      setUseSeedData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedEscalation || !resolutionNotes.trim()) return;

    setResolving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!useSeedData) {
        const { error } = await supabase
          .from('escalations')
          .update({
            status: 'resolved',
            resolved_by: user?.id,
            resolution_notes: resolutionNotes,
            resolved_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedEscalation.id);

        if (error) throw error;
      }

      // Update local state
      setEscalations((prev) =>
        prev.map((esc) =>
          esc.id === selectedEscalation.id
            ? {
                ...esc,
                status: 'resolved',
                resolution_notes: resolutionNotes,
                resolved_at: new Date().toISOString(),
              }
            : esc
        )
      );

      setResolveDialogOpen(false);
      setResolutionNotes('');
      setSelectedEscalation(null);
    } catch (error) {
      console.error('Error resolving escalation:', error);
      alert('Failed to resolve escalation. Please try again.');
    } finally {
      setResolving(false);
    }
  };

  const getFilteredEscalations = () => {
    let filtered = escalations;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((esc) => esc.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter((esc) => esc.priority === priorityFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (esc) =>
          esc.id.toLowerCase().includes(query) ||
          esc.type.toLowerCase().includes(query) ||
          esc.description?.toLowerCase().includes(query) ||
          esc.service_request?.user?.full_name?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { bg: string; text: string; border: string; icon: any }> = {
      critical: {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/20',
        icon: AlertTriangle,
      },
      high: {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/20',
        icon: Zap,
      },
      medium: {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-500/20',
        icon: AlertCircle,
      },
      low: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/20',
        icon: Clock,
      },
    };

    const style = config[priority] || config.medium;
    const Icon = style.icon;

    return (
      <Badge className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text} border ${style.border}`}>
        <Icon className="h-3 w-3" />
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === 'resolved') {
      return (
        <Badge className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
          Resolved
        </Badge>
      );
    } else if (status === 'in_progress') {
      return (
        <Badge className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          In Progress
        </Badge>
      );
    } else if (status === 'closed') {
      return (
        <Badge className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">
          Closed
        </Badge>
      );
    }
    return (
      <Badge className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
        Open
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const filteredEscalations = getFilteredEscalations();
  const openCount = escalations.filter((e) => e.status === 'open').length;
  const criticalCount = escalations.filter((e) => e.priority === 'critical' && e.status !== 'resolved').length;
  const inProgressCount = escalations.filter((e) => e.status === 'in_progress').length;
  const resolvedCount = escalations.filter((e) => e.status === 'resolved').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#9dabb9]">Loading escalations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-[#0f151b]">
      {/* Header */}
      <header className="h-16 border-b border-[#283039] bg-[#111418] px-6 flex items-center justify-between flex-none">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">Escalations Queue</h1>
            <p className="text-sm text-[#9dabb9]">Manage and resolve platform escalations</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm font-bold text-red-400">{criticalCount} Critical</span>
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9dabb9]" />
            <Input
              className="pl-9 w-64 bg-[#1c242c] border-[#283039] text-white placeholder:text-[#5d6b79]"
              placeholder="Search escalations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
              <p className="text-[#9dabb9] text-xs font-medium mb-1">Open Escalations</p>
              <p className="text-2xl font-black text-white">{openCount}</p>
            </div>

            <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
              </div>
              <p className="text-[#9dabb9] text-xs font-medium mb-1">Critical Priority</p>
              <p className="text-2xl font-black text-white">{criticalCount}</p>
            </div>

            <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <p className="text-[#9dabb9] text-xs font-medium mb-1">In Progress</p>
              <p className="text-2xl font-black text-white">{inProgressCount}</p>
            </div>

            <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <p className="text-[#9dabb9] text-xs font-medium mb-1">Resolved</p>
              <p className="text-2xl font-black text-white">{resolvedCount}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-4 flex flex-wrap gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-[#111418] border-[#283039] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40 bg-[#111418] border-[#283039] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Escalations List */}
          <div className="space-y-4">
            {filteredEscalations.length === 0 ? (
              <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-12 text-center">
                <AlertTriangle className="h-12 w-12 text-[#5d6b79] mx-auto mb-4 opacity-50" />
                <p className="text-[#9dabb9] font-medium">No escalations found</p>
                <p className="text-sm text-[#5d6b79] mt-1">All escalations have been resolved</p>
              </div>
            ) : (
              filteredEscalations.map((escalation) => (
                <div
                  key={escalation.id}
                  className={`bg-[#1c242c] rounded-xl border transition-colors ${
                    escalation.priority === 'critical' && escalation.status === 'open'
                      ? 'border-red-500/30 bg-red-500/5'
                      : escalation.priority === 'high' && escalation.status === 'open'
                      ? 'border-orange-500/30 bg-orange-500/5'
                      : 'border-[#283039] hover:border-[#3b4754]'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`p-2 rounded-lg ${
                              escalation.priority === 'critical'
                                ? 'bg-red-500/10'
                                : escalation.priority === 'high'
                                ? 'bg-orange-500/10'
                                : escalation.priority === 'medium'
                                ? 'bg-yellow-500/10'
                                : 'bg-blue-500/10'
                            }`}
                          >
                            <AlertTriangle
                              className={`h-5 w-5 ${
                                escalation.priority === 'critical'
                                  ? 'text-red-400'
                                  : escalation.priority === 'high'
                                  ? 'text-orange-400'
                                  : escalation.priority === 'medium'
                                  ? 'text-yellow-400'
                                  : 'text-blue-400'
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-lg font-bold text-white">{getTypeLabel(escalation.type)}</h3>
                              {getPriorityBadge(escalation.priority)}
                              {getStatusBadge(escalation.status)}
                            </div>
                            <p className="text-sm text-[#9dabb9]">{escalation.description}</p>
                          </div>
                        </div>

                        {escalation.service_request && (
                          <div className="mt-4 p-4 bg-[#111418] rounded-lg border border-[#283039]">
                            <p className="text-xs font-bold text-[#9dabb9] uppercase tracking-wider mb-3">
                              Service Request Details
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-[#5d6b79] mb-1">Request ID</p>
                                <p className="text-sm font-mono text-white">
                                  #{escalation.service_request.id.substring(0, 8).toUpperCase()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-[#5d6b79] mb-1">Client</p>
                                <div className="flex items-center gap-2">
                                  {escalation.service_request.user?.avatar_url ? (
                                    <div
                                      className="size-6 rounded-full bg-cover bg-center"
                                      style={{
                                        backgroundImage: `url(${escalation.service_request.user.avatar_url})`,
                                      }}
                                    />
                                  ) : (
                                    <div className="size-6 rounded-full bg-[#283039] flex items-center justify-center">
                                      <User className="h-3 w-3 text-[#9dabb9]" />
                                    </div>
                                  )}
                                  <p className="text-sm font-medium text-white">
                                    {escalation.service_request.user?.full_name || 'Unknown'}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-[#5d6b79] mb-1">Route</p>
                                <div className="flex items-center gap-1 text-sm text-white">
                                  <MapPin className="h-3 w-3 text-[#5d6b79]" />
                                  <span className="truncate">{escalation.service_request.pickup_address}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-[#9dabb9] mt-1">
                                  <span className="mx-1">→</span>
                                  <span className="truncate">{escalation.service_request.destination_address}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 mt-4 text-xs text-[#5d6b79]">
                          <span>Escalated: {formatRelativeTime(escalation.created_at)}</span>
                          {escalation.resolved_at && (
                            <span>Resolved: {formatRelativeTime(escalation.resolved_at)}</span>
                          )}
                        </div>

                        {escalation.resolution_notes && (
                          <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                            <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2">
                              Resolution Notes
                            </p>
                            <p className="text-sm text-green-300">{escalation.resolution_notes}</p>
                          </div>
                        )}
                      </div>

                      {escalation.status === 'open' && (
                        <Button
                          onClick={() => {
                            setSelectedEscalation(escalation);
                            setResolveDialogOpen(true);
                          }}
                          className="bg-primary hover:bg-primary/90 text-white font-medium"
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent className="bg-[#1c242c] border-[#283039] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Resolve Escalation</DialogTitle>
            <DialogDescription className="text-[#9dabb9]">
              Add resolution notes for this escalation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-[#9dabb9] mb-2">Resolution Notes</label>
              <Textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Describe how this escalation was resolved..."
                rows={5}
                className="bg-[#111418] border-[#283039] text-white placeholder:text-[#5d6b79] focus:ring-primary"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResolveDialogOpen(false)}
              className="border-[#283039] text-[#9dabb9] hover:bg-[#283039]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleResolve}
              disabled={resolving || !resolutionNotes.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {resolving ? 'Resolving...' : 'Mark as Resolved'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
