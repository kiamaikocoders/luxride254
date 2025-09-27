import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxeRideColors } from '../../../shared-config/constants';

interface SignInScreenProps {
  onSignIn: (email: string, password: string) => Promise<void>;
}

export default function SignInScreen({ onSignIn }: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await onSignIn(email, password);
    } catch (error) {
      Alert.alert('Sign In Failed', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Ionicons name="car" size={64} color={LuxeRideColors.primary} />
          <Text style={styles.logoText}>LuxeRide VIP</Text>
          <Text style={styles.subtitle}>Exclusive Concierge Service</Text>
        </View>

        {/* Sign In Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={LuxeRideColors.graySecondary} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={LuxeRideColors.graySecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={LuxeRideColors.graySecondary} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={LuxeRideColors.graySecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Ionicons 
                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color={LuxeRideColors.graySecondary} 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.signInButton, loading && styles.disabledButton]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.signInButtonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have VIP access?{'\n'}
            Contact concierge@luxeride.com
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LuxeRideColors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: LuxeRideColors.white,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: LuxeRideColors.graySecondary,
    marginTop: 4,
  },
  formContainer: {
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: LuxeRideColors.white,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LuxeRideColors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LuxeRideColors.darkOutline,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: LuxeRideColors.white,
    fontSize: 16,
    marginLeft: 12,
  },
  eyeButton: {
    padding: 4,
  },
  signInButton: {
    backgroundColor: LuxeRideColors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: LuxeRideColors.darkPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: LuxeRideColors.graySecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});



