import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxeRideColors } from '../../../shared-config/constants';

export default function MyTripsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="list" size={64} color={LuxeRideColors.primary} />
        <Text style={styles.title}>My Trips</Text>
        <Text style={styles.subtitle}>
          Your trip history will appear here
        </Text>
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
  },
});



