import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxeRideColors } from '../../../shared-config/constants';

interface DriverProfileScreenProps {
  onSignOut?: () => void;
}

export default function DriverProfileScreen({ onSignOut }: DriverProfileScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="person" size={64} color={LuxeRideColors.primary} />
        <Text style={styles.title}>Driver Profile</Text>
        <Text style={styles.subtitle}>
          Manage your driver account
        </Text>
        
        {onSignOut && (
          <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        )}
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
  signOutButton: {
    backgroundColor: LuxeRideColors.error,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signOutText: {
    color: LuxeRideColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});



