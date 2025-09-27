import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxeRideColors } from '../../shared-config/constants';
import { supabase } from '../../shared-config/supabase';
import { PackageSubscription, ServiceRequest } from '../../shared-config/types';

export default function DashboardScreen() {
  const [subscription, setSubscription] = useState<PackageSubscription | null>(null);
  const [recentTrips, setRecentTrips] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load package subscription
      const { data: packageData } = await supabase
        .from('package_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      setSubscription(packageData);

      // Load recent trips
      const { data: tripsData } = await supabase
        .from('service_requests')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false })
        .limit(3);

      setRecentTrips(tripsData || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRide = () => {
    // Navigate to request ride screen
    // This will be handled by navigation
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="car" size={48} color={LuxeRideColors.primary} />
        <Text style={styles.loadingText}>Loading your VIP dashboard...</Text>
      </View>
    );
  }

  if (!subscription) {
    return (
      <View style={styles.noSubscriptionContainer}>
        <Ionicons name="car" size={48} color={LuxeRideColors.primary} />
        <Text style={styles.noSubscriptionTitle}>No Active VIP Package</Text>
        <Text style={styles.noSubscriptionText}>
          Contact our concierge team to activate your VIP membership
        </Text>
        <Text style={styles.contactInfo}>
          Email: concierge@luxeride.com{'\n'}
          Phone: +254 700 000 000
        </Text>
      </View>
    );
  }

  const ridesRemaining = subscription.rides_included - (subscription.rides_used || 0);
  const usagePercentage = ((subscription.rides_used || 0) / subscription.rides_included) * 100;

  return (
    <ScrollView style={styles.container}>
      {/* Package Status Card */}
      <View style={styles.packageCard}>
        <View style={styles.packageHeader}>
          <Ionicons name="shield-checkmark" size={24} color={LuxeRideColors.primary} />
          <Text style={styles.packageTitle}>
            {subscription.package_type.toUpperCase()} Package
          </Text>
        </View>
        
        <View style={styles.ridesContainer}>
          <Text style={styles.ridesRemaining}>{ridesRemaining}</Text>
          <Text style={styles.ridesLabel}>Rides Remaining</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${100 - usagePercentage}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.packageDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Security Detail</Text>
            <Text style={[
              styles.detailValue,
              { color: subscription.security_included ? LuxeRideColors.success : LuxeRideColors.graySecondary }
            ]}>
              {subscription.security_included ? 'Included' : 'Not Included'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Monthly Fee</Text>
            <Text style={styles.detailValue}>KSH {subscription.monthly_fee.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Quick Action - Request Ride */}
      <TouchableOpacity style={styles.requestRideCard} onPress={handleRequestRide}>
        <View style={styles.requestRideContent}>
          <Ionicons name="car" size={32} color={LuxeRideColors.primary} />
          <View style={styles.requestRideText}>
            <Text style={styles.requestRideTitle}>Request VIP Service</Text>
            <Text style={styles.requestRideSubtitle}>
              Your personal concierge is ready to serve you
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={LuxeRideColors.graySecondary} />
        </View>
      </TouchableOpacity>

      {/* Recent Trips */}
      <View style={styles.recentTripsCard}>
        <Text style={styles.sectionTitle}>Recent Trips</Text>
        {recentTrips.length === 0 ? (
          <Text style={styles.noTripsText}>No completed trips yet</Text>
        ) : (
          recentTrips.map((trip) => (
            <View key={trip.id} style={styles.tripItem}>
              <View style={styles.tripIcon}>
                <Ionicons name="car" size={20} color={LuxeRideColors.primary} />
              </View>
              <View style={styles.tripDetails}>
                <Text style={styles.tripRoute}>
                  {trip.pickup_address} → {trip.destination_address}
                </Text>
                <Text style={styles.tripDate}>
                  {new Date(trip.updated_at || '').toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.tripStatus}>
                <Text style={styles.completedStatus}>Completed</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LuxeRideColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LuxeRideColors.background,
  },
  loadingText: {
    color: LuxeRideColors.graySecondary,
    marginTop: 16,
    fontSize: 16,
  },
  noSubscriptionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LuxeRideColors.background,
    padding: 24,
  },
  noSubscriptionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: LuxeRideColors.white,
    marginTop: 16,
    textAlign: 'center',
  },
  noSubscriptionText: {
    fontSize: 16,
    color: LuxeRideColors.graySecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  contactInfo: {
    fontSize: 14,
    color: LuxeRideColors.graySecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  packageCard: {
    backgroundColor: LuxeRideColors.card,
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LuxeRideColors.darkOutline,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: LuxeRideColors.white,
    marginLeft: 8,
  },
  ridesContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  ridesRemaining: {
    fontSize: 36,
    fontWeight: 'bold',
    color: LuxeRideColors.primary,
  },
  ridesLabel: {
    fontSize: 14,
    color: LuxeRideColors.graySecondary,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: LuxeRideColors.muted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: LuxeRideColors.primary,
  },
  packageDetails: {
    marginTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: LuxeRideColors.graySecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: LuxeRideColors.white,
  },
  requestRideCard: {
    backgroundColor: LuxeRideColors.card,
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LuxeRideColors.primary + '20',
  },
  requestRideContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestRideText: {
    flex: 1,
    marginLeft: 16,
  },
  requestRideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: LuxeRideColors.white,
  },
  requestRideSubtitle: {
    fontSize: 14,
    color: LuxeRideColors.graySecondary,
    marginTop: 4,
  },
  recentTripsCard: {
    backgroundColor: LuxeRideColors.card,
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LuxeRideColors.darkOutline,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: LuxeRideColors.white,
    marginBottom: 16,
  },
  noTripsText: {
    fontSize: 14,
    color: LuxeRideColors.graySecondary,
    textAlign: 'center',
    padding: 20,
  },
  tripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: LuxeRideColors.darkOutline,
  },
  tripIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: LuxeRideColors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tripDetails: {
    flex: 1,
  },
  tripRoute: {
    fontSize: 16,
    fontWeight: '500',
    color: LuxeRideColors.white,
  },
  tripDate: {
    fontSize: 14,
    color: LuxeRideColors.graySecondary,
    marginTop: 2,
  },
  tripStatus: {
    marginLeft: 12,
  },
  completedStatus: {
    fontSize: 12,
    color: LuxeRideColors.success,
    fontWeight: '500',
  },
});



