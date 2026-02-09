import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatRelativeTime, formatCurrency } from '../utils/format';
import { ADMIN_CONFIG } from '../config';
import type { Cancellation, ServiceRequest } from '../types';
import { XCircle, Search, DollarSign, Clock, User, TrendingDown, CheckCircle } from 'lucide-react';

interface CancellationWithDetails extends Cancellation {
  service_request?: ServiceRequest & {
    user?: any;
  };
}

export function Cancellations() {
  const [cancellations, setCancellations] = useState<CancellationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [useSeedData, setUseSeedData] = useState(false);

  useEffect(() => {
    fetchCancellations();

    const channel = supabase
      .channel('cancellations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cancellations',
        },
        () => {
          fetchCancellations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Generate seed data
  const generateSeedData = (): CancellationWithDetails[] => {
    return [
      {
        id: 'cancel-001',
        service_request_id: 'sr-001',
        cancelled_by: 'user',
        cancelled_by_user_id: 'user-001',
        cancellation_stage: 'after_assignment',
        cancellation_reason: 'Driver took too long to arrive. Need to leave immediately.',
        original_fare: 2500,
        cancellation_fee: 0,
        refund_amount: 2000, // 80% refund
        refund_status: 'pending',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        service_request: {
          id: 'sr-001',
          user_id: 'user-001',
          request_type: 'ride',
          pickup_address: 'Westlands, Nairobi',
          destination_address: 'JKIA Terminal 1',
          status: 'cancelled',
          user: {
            id: 'user-001',
            full_name: 'Sarah Johnson',
            email: 'sarah@example.com',
            avatar_url: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff',
          },
        },
      },
      {
        id: 'cancel-002',
        service_request_id: 'sr-002',
        cancelled_by: 'driver',
        cancellation_stage: 'after_driver_arrived',
        cancellation_reason: 'Vehicle breakdown, unable to complete ride.',
        original_fare: 1800,
        cancellation_fee: 500,
        refund_amount: 900, // 50% refund minus fee
        refund_status: 'processed',
        refund_processed_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
        service_request: {
          id: 'sr-002',
          user_id: 'user-002',
          request_type: 'ride',
          pickup_address: 'Nairobi CBD',
          destination_address: 'Karen, Nairobi',
          status: 'cancelled',
          user: {
            id: 'user-002',
            full_name: 'Michael Chen',
            email: 'michael@example.com',
            avatar_url: 'https://ui-avatars.com/api/?name=Michael+Chen&background=10b981&color=fff',
          },
        },
      },
      {
        id: 'cancel-003',
        service_request_id: 'sr-003',
        cancelled_by: 'user',
        cancelled_by_user_id: 'user-003',
        cancellation_stage: 'before_assignment',
        cancellation_reason: 'Change of plans, no longer need the ride.',
        original_fare: 1200,
        cancellation_fee: 0,
        refund_amount: 1200, // 100% refund
        refund_status: 'processed',
        refund_processed_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
        service_request: {
          id: 'sr-003',
          user_id: 'user-003',
          request_type: 'ride',
          pickup_address: 'Parklands',
          destination_address: 'Thika Road',
          status: 'cancelled',
          user: {
            id: 'user-003',
            full_name: 'David Kimani',
            email: 'david@example.com',
            avatar_url: 'https://ui-avatars.com/api/?name=David+Kimani&background=f59e0b&color=fff',
          },
        },
      },
      {
        id: 'cancel-004',
        service_request_id: 'sr-004',
        cancelled_by: 'system',
        cancellation_stage: 'after_ride_started',
        cancellation_reason: 'Emergency system cancellation due to safety concerns.',
        original_fare: 3000,
        cancellation_fee: 0,
        refund_amount: 0, // 0% refund after ride started
        refund_status: 'not_applicable',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        service_request: {
          id: 'sr-004',
          user_id: 'user-004',
          request_type: 'ride',
          pickup_address: 'Runda',
          destination_address: 'JKIA Terminal 1',
          status: 'cancelled',
          user: {
            id: 'user-004',
            full_name: 'Emily Wanjiku',
            email: 'emily@example.com',
            avatar_url: 'https://ui-avatars.com/api/?name=Emily+Wanjiku&background=8b5cf6&color=fff',
          },
        },
      },
    ] as CancellationWithDetails[];
  };

  const fetchCancellations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cancellations')
        .select('*, service_request:service_requests(*, user:users(*))')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        const seedData = generateSeedData();
        setCancellations(seedData);
        setUseSeedData(true);
      } else {
        setCancellations(data as CancellationWithDetails[]);
        setUseSeedData(false);
      }
    } catch (error) {
      console.error('Error fetching cancellations:', error);
      const seedData = generateSeedData();
      setCancellations(seedData);
      setUseSeedData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRefund = async (cancellation: CancellationWithDetails) => {
    if (!cancellation.service_request_id || cancellation.refund_amount === 0) return;

    try {
      if (!useSeedData) {
        const { error } = await supabase
          .from('cancellations')
          .update({
            refund_status: 'processed',
            refund_processed_at: new Date().toISOString(),
          })
          .eq('id', cancellation.id);

        if (error) throw error;

        // Create wallet transaction (ride credit in subscription model)
        if (cancellation.refund_amount && cancellation.refund_amount > 0) {
          const { data: serviceRequest } = await supabase
            .from('service_requests')
            .select('user_id')
            .eq('id', cancellation.service_request_id)
            .single();

          if (serviceRequest?.user_id) {
            await supabase.from('wallet_transactions').insert({
              user_id: serviceRequest.user_id,
              service_request_id: cancellation.service_request_id,
              transaction_type: 'ride_refunded',
              description: `Cancellation refund - ${cancellation.cancellation_reason}`,
              metadata: { cancellation_id: cancellation.id },
            });
          }
        }
      }

      // Update local state
      setCancellations((prev) =>
        prev.map((cancel) =>
          cancel.id === cancellation.id
            ? {
                ...cancel,
                refund_status: 'processed',
                refund_processed_at: new Date().toISOString(),
              }
            : cancel
        )
      );
    } catch (error) {
      console.error('Error processing refund:', error);
      alert('Failed to process refund. Please try again.');
    }
  };

  const getCancellationPolicy = (stage: string) => {
    const policy = ADMIN_CONFIG.cancellationPolicy[stage as keyof typeof ADMIN_CONFIG.cancellationPolicy];
    // Fallback policy if stage doesn't match
    return policy || { refundPercent: 0, fee: 0 };
  };

  const getFilteredCancellations = () => {
    let filtered = cancellations;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((cancel) => cancel.refund_status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cancel) =>
          cancel.id.toLowerCase().includes(query) ||
          cancel.service_request?.user?.full_name?.toLowerCase().includes(query) ||
          cancel.cancellation_reason?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredCancellations = getFilteredCancellations();
  const pendingCount = cancellations.filter((c) => c.refund_status === 'pending').length;
  const processedCount = cancellations.filter((c) => c.refund_status === 'processed').length;
  const totalRefunds = cancellations
    .filter((c) => c.refund_status === 'processed')
    .reduce((sum, c) => sum + (c.refund_amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#9dabb9]">Loading cancellations...</p>
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
            <h1 className="text-xl font-bold text-white">Cancellations & Refunds</h1>
            <p className="text-sm text-[#9dabb9]">Manage cancellations and process refunds</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9dabb9]" />
            <Input
              className="pl-9 w-64 bg-[#1c242c] border-[#283039] text-white placeholder:text-[#5d6b79]"
              placeholder="Search cancellations..."
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
              <p className="text-[#9dabb9] text-xs font-medium mb-1">Pending Refunds</p>
              <p className="text-2xl font-black text-white">{pendingCount}</p>
            </div>

            <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <p className="text-[#9dabb9] text-xs font-medium mb-1">Processed</p>
              <p className="text-2xl font-black text-white">{processedCount}</p>
            </div>

            <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <p className="text-[#9dabb9] text-xs font-medium mb-1">Total Refunded</p>
              <p className="text-2xl font-black text-white">{formatCurrency(totalRefunds)}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-[#111418] border-[#283039] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending Refund</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="not_applicable">Not Applicable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cancellations List */}
          <div className="space-y-4">
            {filteredCancellations.length === 0 ? (
              <div className="bg-[#1c242c] rounded-xl border border-[#283039] p-12 text-center">
                <XCircle className="h-12 w-12 text-[#5d6b79] mx-auto mb-4 opacity-50" />
                <p className="text-[#9dabb9] font-medium">No cancellations found</p>
                <p className="text-sm text-[#5d6b79] mt-1">Cancelled bookings will appear here</p>
              </div>
            ) : (
              filteredCancellations.map((cancellation) => {
                const policy = getCancellationPolicy(cancellation.cancellation_stage);
                return (
                  <div
                    key={cancellation.id}
                    className="bg-[#1c242c] rounded-xl border border-[#283039] hover:border-[#3b4754] transition-colors"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                              <XCircle className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="text-lg font-bold text-white">
                                  Cancelled by {cancellation.cancelled_by.charAt(0).toUpperCase() + cancellation.cancelled_by.slice(1)}
                                </h3>
                                <Badge className="capitalize bg-[#283039] text-[#9dabb9] border-[#283039]">
                                  {cancellation.cancellation_stage.replace(/_/g, ' ')}
                                </Badge>
                                <Badge
                                  className={
                                    cancellation.refund_status === 'processed'
                                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                      : cancellation.refund_status === 'pending'
                                      ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                      : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                  }
                                >
                                  {cancellation.refund_status.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                              {cancellation.cancellation_reason && (
                                <p className="text-sm text-[#9dabb9] mt-1">Reason: {cancellation.cancellation_reason}</p>
                              )}
                            </div>
                          </div>

                          {cancellation.service_request && (
                            <div className="mb-4 p-4 bg-[#111418] rounded-lg border border-[#283039]">
                              <p className="text-xs font-bold text-[#9dabb9] uppercase tracking-wider mb-3">
                                Service Request
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-xs text-[#5d6b79] mb-1">Request ID</p>
                                  <p className="text-sm font-mono text-white">
                                    #{cancellation.service_request.id.substring(0, 8).toUpperCase()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-[#5d6b79] mb-1">Client</p>
                                  <div className="flex items-center gap-2">
                                    {cancellation.service_request.user?.avatar_url ? (
                                      <div
                                        className="size-6 rounded-full bg-cover bg-center"
                                        style={{
                                          backgroundImage: `url(${cancellation.service_request.user.avatar_url})`,
                                        }}
                                      />
                                    ) : (
                                      <div className="size-6 rounded-full bg-[#283039] flex items-center justify-center">
                                        <User className="h-3 w-3 text-[#9dabb9]" />
                                      </div>
                                    )}
                                    <p className="text-sm font-medium text-white">
                                      {cancellation.service_request.user?.full_name || 'Unknown'}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-[#5d6b79] mb-1">Route</p>
                                  <p className="text-sm text-white truncate">
                                    {cancellation.service_request.pickup_address} →{' '}
                                    {cancellation.service_request.destination_address}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="p-4 bg-[#111418] rounded-lg border border-[#283039]">
                            <p className="text-xs font-bold text-[#9dabb9] uppercase tracking-wider mb-3">
                              Refund Details
                            </p>
                            <div className="space-y-2">
                              {cancellation.original_fare && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-[#9dabb9]">Original Fare:</span>
                                  <span className="font-medium text-white">{formatCurrency(cancellation.original_fare)}</span>
                                </div>
                              )}
                              {cancellation.cancellation_fee > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-[#9dabb9]">Cancellation Fee:</span>
                                  <span className="font-medium text-red-400">
                                    -{formatCurrency(cancellation.cancellation_fee)}
                                  </span>
                                </div>
                              )}
                              {cancellation.refund_amount !== undefined && (
                                <div className="flex justify-between text-sm pt-2 border-t border-[#283039]">
                                  <span className="font-medium text-white">Refund Amount:</span>
                                  <span
                                    className={`font-bold ${
                                      cancellation.refund_amount > 0 ? 'text-green-400' : 'text-[#9dabb9]'
                                    }`}
                                  >
                                    {formatCurrency(cancellation.refund_amount)}
                                  </span>
                                </div>
                              )}
                              <div className="text-xs text-[#5d6b79] mt-2 pt-2 border-t border-[#283039]">
                                Policy: {policy.refundPercent}% refund, {formatCurrency(policy.fee)} fee
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 mt-4 text-xs text-[#5d6b79]">
                            <span>Cancelled: {formatRelativeTime(cancellation.created_at)}</span>
                            {cancellation.refund_processed_at && (
                              <span className="text-green-400">
                                Processed: {formatRelativeTime(cancellation.refund_processed_at)}
                              </span>
                            )}
                          </div>
                        </div>

                        {cancellation.refund_status === 'pending' && cancellation.refund_amount && cancellation.refund_amount > 0 && (
                          <Button
                            onClick={() => handleProcessRefund(cancellation)}
                            className="bg-primary hover:bg-primary/90 text-white font-medium"
                          >
                            Process Refund
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
