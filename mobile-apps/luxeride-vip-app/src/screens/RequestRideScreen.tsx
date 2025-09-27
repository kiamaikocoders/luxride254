import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxeRideColors } from '../../../shared-config/constants';

export default function RequestRideScreen() {
  const [loading, setLoading] = useState(false);

  const handleRequestRide = async () => {
    setLoading(true);
    try {
      // TODO: Implement ride request logic
      Alert.alert('Success', 'Ride request submitted!');
    } catch (error) {
      Alert.alert('Error', 'Failed to request ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="car" size={64} color={LuxeRideColors.primary} />
        <Text style={styles.title}>Request VIP Service</Text>
        <Text style={styles.subtitle}>
          Your personal concierge is ready to serve you
        </Text>
        
        <TouchableOpacity
          style={[styles.requestButton, loading && styles.disabledButton]}
          onPress={handleRequestRide}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Requesting...' : 'Request Service'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LuxeRideColors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: LuxeRideColors.white,
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: LuxeRideColors.graySecondary,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 32,
  },
  requestButton: {
    backgroundColor: LuxeRideColors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: LuxeRideColors.darkPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});



