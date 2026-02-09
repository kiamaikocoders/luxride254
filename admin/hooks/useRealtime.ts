import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { ServiceRequest, Escalation, Dispute } from '../types';

export function useRealtimeServiceRequests(onUpdate?: (request: ServiceRequest) => void) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetchRequests();

    // Subscribe to changes
    const channel = supabase
      .channel('service_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_requests',
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            fetchRequests();
            if (onUpdate && payload.new) {
              onUpdate(payload.new as ServiceRequest);
            }
          } else if (payload.eventType === 'DELETE') {
            setRequests(prev => prev.filter(r => r.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          user:users(*),
          driver:drivers(*, user:users(*)),
          vehicle:vehicles(*),
          security:security_personnel(*),
          subscription:package_subscriptions(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data as ServiceRequest[]);
    } catch (error) {
      console.error('Error fetching service requests:', error);
    } finally {
      setLoading(false);
    }
  };

  return { requests, loading, refetch: fetchRequests };
}

export function useRealtimeEscalations(onUpdate?: (escalation: Escalation) => void) {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);

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

  const fetchEscalations = async () => {
    try {
      const { data, error } = await supabase
        .from('escalations')
        .select(`
          *,
          service_request:service_requests(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEscalations(data as Escalation[]);
    } catch (error) {
      console.error('Error fetching escalations:', error);
    } finally {
      setLoading(false);
    }
  };

  return { escalations, loading, refetch: fetchEscalations };
}

export function useRealtimeDisputes(onUpdate?: (dispute: Dispute) => void) {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const fetchDisputes = async () => {
    try {
      const { data, error } = await supabase
        .from('disputes')
        .select(`
          *,
          user:users(*),
          service_request:service_requests(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDisputes(data as Dispute[]);
    } catch (error) {
      console.error('Error fetching disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  return { disputes, loading, refetch: fetchDisputes };
}

