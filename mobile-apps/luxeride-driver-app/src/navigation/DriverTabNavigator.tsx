import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LuxeRideColors } from '../../shared-config/constants';

// Import screens
import DriverMapScreen from '../screens/DriverMapScreen';
import DriverTripsScreen from '../screens/DriverTripsScreen';
import DriverProfileScreen from '../screens/DriverProfileScreen';

const Tab = createBottomTabNavigator();

interface DriverTabNavigatorProps {
  onSignOut?: () => void;
}

export function DriverTabNavigator({ onSignOut }: DriverTabNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          
          if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Trips') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: LuxeRideColors.primary,
        tabBarInactiveTintColor: LuxeRideColors.graySecondary,
        tabBarStyle: {
          backgroundColor: LuxeRideColors.darkPrimary,
          borderTopColor: LuxeRideColors.darkOutline,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: LuxeRideColors.darkPrimary,
        },
        headerTintColor: LuxeRideColors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Map" 
        component={DriverMapScreen}
        options={{ title: 'Navigation' }}
      />
      <Tab.Screen 
        name="Trips" 
        component={DriverTripsScreen}
        options={{ title: 'My Trips' }}
      />
      <Tab.Screen 
        name="Profile" 
        options={{ title: 'Profile' }}
      >
        {() => <DriverProfileScreen onSignOut={onSignOut} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
