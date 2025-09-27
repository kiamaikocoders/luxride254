import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { LuxeRideColors } from '../../shared-config/constants';
import { supabase } from '../../shared-config/supabase';
import { ServiceRequest, Driver } from '../../shared-config/types';

interface Location {
  latitude: number;
  longitude: number;
}

export default function DriverMapScreen() {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [currentTrip, setCurrentTrip] = useState<ServiceRequest | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    initializeDriver();
    getCurrentLocation();
  }, []);

  const initializeDriver = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get driver profile
      const { data: driverData } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setDriver(driverData);
      setIsOnline(driverData?.is_online || false);

      // Get current trip if any
      const { data: tripData } = await supabase
        .from('service_requests')
        .select('*')
        .eq('assigned_driver_id', driverData?.id)
        .in('status', ['assigned', 'in_progress'])
        .single();

      setCurrentTrip(tripData);
    } catch (error) {
      console.error('Error initializing driver:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setCurrentLocation(newLocation);
      
      // Update driver location in database
      if (driver) {
        await supabase
          .from('drivers')
          .update({ 
            current_location: `POINT(${newLocation.longitude} ${newLocation.latitude})`,
            last_updated: new Date().toISOString()
          })
          .eq('id', driver.id);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      const newStatus = !isOnline;
      setIsOnline(newStatus);
      
      if (driver) {
        await supabase
          .from('drivers')
          .update({ 
            is_online: newStatus,
            last_updated: new Date().toISOString()
          })
          .eq('id', driver.id);
      }
    } catch (error) {
      console.error('Error updating online status:', error);
      setIsOnline(!isOnline); // Revert on error
    }
  };

  const confirmPickup = async () => {
    if (!currentTrip) return;
    
    try {
      await supabase
        .from('service_requests')
        .update({ status: 'in_progress' })
        .eq('id', currentTrip.id);
      
      setCurrentTrip({ ...currentTrip, status: 'in_progress' });
      Alert.alert('Success', 'Pickup confirmed');
    } catch (error) {
      console.error('Error confirming pickup:', error);
      Alert.alert('Error', 'Failed to confirm pickup');
    }
  };

  const completeTrip = async () => {
    if (!currentTrip) return;
    
    try {
      await supabase
        .from('service_requests')
        .update({ status: 'completed' })
        .eq('id', currentTrip.id);
      
      setCurrentTrip(null);
      Alert.alert('Success', 'Trip completed');
    } catch (error) {
      console.error('Error completing trip:', error);
      Alert.alert('Error', 'Failed to complete trip');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="car" size={48} color={LuxeRideColors.primary} />
        <Text style={styles.loadingText}>Loading driver dashboard...</Text>
      </View>
    );
  }

  if (!currentLocation) {
    return (
      <View style={styles.noLocationContainer}>
        <Ionicons name="location-outline" size={48} color={LuxeRideColors.primary} />
        <Text style={styles.noLocationText}>Location access required</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getCurrentLocation}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Online Status Toggle */}
      <View style={styles.statusBar}>
        <TouchableOpacity 
          style={[styles.statusButton, isOnline ? styles.onlineButton : styles.offlineButton]}
          onPress={toggleOnlineStatus}
        >
          <Ionicons 
            name={isOnline ? 'radio-button-on' : 'radio-button-off'} 
            size={16} 
            color={isOnline ? LuxeRideColors.success : LuxeRideColors.graySecondary} 
          />
          <Text style={[styles.statusText, { color: isOnline ? LuxeRideColors.success : LuxeRideColors.graySecondary }]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Current Location Marker */}
        <Marker
          coordinate={currentLocation}
          title="Your Location"
          description="Current position"
        >
          <View style={styles.driverMarker}>
            <Ionicons name="car" size={24} color={LuxeRideColors.white} />
          </View>
        </Marker>

        {/* Trip Markers */}
        {currentTrip && (
          <>
            {currentTrip.pickup_location && (
              <Marker
                coordinate={{
                  latitude: (currentTrip.pickup_location as any).coordinates[1],
                  longitude: (currentTrip.pickup_location as any).coordinates[0],
                }}
                title="Pickup Location"
                description={currentTrip.pickup_address}
              >
                <View style={styles.pickupMarker}>
                  <Ionicons name="location" size={20} color={LuxeRideColors.white} />
                </View>
              </Marker>
            )}
            
            {currentTrip.destination && (
              <Marker
                coordinate={{
                  latitude: (currentTrip.destination as any).coordinates[1],
                  longitude: (currentTrip.destination as any).coordinates[0],
                }}
                title="Destination"
                description={currentTrip.destination_address}
              >
                <View style={styles.destinationMarker}>
                  <Ionicons name="flag" size={20} color={LuxeRideColors.white} />
                </View>
              </Marker>
            )}
          </>
        )}
      </MapView>

      {/* Trip Controls */}
      {currentTrip && (
        <View style={styles.tripControls}>
          <View style={styles.tripInfo}>
            <Text style={styles.tripTitle}>Current Trip</Text>
            <Text style={styles.tripRoute}>
              {currentTrip.pickup_address} → {currentTrip.destination_address}
            </Text>
            <Text style={styles.tripStatus}>
              Status: {currentTrip.status?.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.controlButtons}>
            {currentTrip.status === 'assigned' && (
              <TouchableOpacity style={styles.confirmButton} onPress={confirmPickup}>
                <Text style={styles.buttonText}>Confirm Pickup</Text>
              </TouchableOpacity>
            )}
            
            {currentTrip.status === 'in_progress' && (
              <TouchableOpacity style={styles.completeButton} onPress={completeTrip}>
                <Text style={styles.buttonText}>Complete Trip</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* No Trip Message */}
      {!currentTrip && isOnline && (
        <View style={styles.noTripContainer}>
          <Ionicons name="car-outline" size={48} color={LuxeRideColors.graySecondary} />
          <Text style={styles.noTripText}>No active trips</Text>
          <Text style={styles.noTripSubtext}>Waiting for assignment...</Text>
        </View>
      )}
    </View>
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
  noLocationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LuxeRideColors.background,
    padding: 24,
  },
  noLocationText: {
    fontSize: 18,
    color: LuxeRideColors.white,
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: LuxeRideColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: LuxeRideColors.darkPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusBar: {
    position: 'absolute',
    top: 60,
    left: 16,
    zIndex: 1000,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  onlineButton: {
    backgroundColor: LuxeRideColors.success + '20',
    borderColor: LuxeRideColors.success,
  },
  offlineButton: {
    backgroundColor: LuxeRideColors.graySecondary + '20',
    borderColor: LuxeRideColors.graySecondary,
  },
  statusText: {
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 14,
  },
  map: {
    flex: 1,
  },
  driverMarker: {
    backgroundColor: LuxeRideColors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: LuxeRideColors.white,
  },
  pickupMarker: {
    backgroundColor: LuxeRideColors.success,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: LuxeRideColors.white,
  },
  destinationMarker: {
    backgroundColor: LuxeRideColors.error,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: LuxeRideColors.white,
  },
  tripControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: LuxeRideColors.card,
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderTopColor: LuxeRideColors.darkOutline,
  },
  tripInfo: {
    marginBottom: 16,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: LuxeRideColors.white,
    marginBottom: 8,
  },
  tripRoute: {
    fontSize: 16,
    color: LuxeRideColors.graySecondary,
    marginBottom: 4,
  },
  tripStatus: {
    fontSize: 14,
    color: LuxeRideColors.primary,
    fontWeight: '500',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: LuxeRideColors.success,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButton: {
    flex: 1,
    backgroundColor: LuxeRideColors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: LuxeRideColors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  noTripContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  noTripText: {
    fontSize: 18,
    color: LuxeRideColors.graySecondary,
    marginTop: 16,
  },
  noTripSubtext: {
    fontSize: 14,
    color: LuxeRideColors.graySecondary,
    marginTop: 4,
  },
});



