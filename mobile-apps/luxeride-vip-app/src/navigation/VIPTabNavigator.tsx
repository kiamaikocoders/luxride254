import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LuxeRideColors } from '../../shared-config/constants';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import RequestRideScreen from '../screens/RequestRideScreen';
import MyTripsScreen from '../screens/MyTripsScreen';
import FamilyScreen from '../screens/FamilyScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

interface VIPTabNavigatorProps {
  onSignOut?: () => void;
}

export function VIPTabNavigator({ onSignOut }: VIPTabNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Request') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'Trips') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Family') {
            iconName = focused ? 'people' : 'people-outline';
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
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'VIP Dashboard' }}
      />
      <Tab.Screen 
        name="Request" 
        component={RequestRideScreen}
        options={{ title: 'Request Ride' }}
      />
      <Tab.Screen 
        name="Trips" 
        component={MyTripsScreen}
        options={{ title: 'My Trips' }}
      />
      <Tab.Screen 
        name="Family" 
        component={FamilyScreen}
        options={{ title: 'Family' }}
      />
      <Tab.Screen 
        name="Profile" 
        options={{ title: 'Profile' }}
      >
        {() => <ProfileScreen onSignOut={onSignOut} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
