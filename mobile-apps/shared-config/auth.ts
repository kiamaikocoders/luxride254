import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';
import { UserRoles } from './constants';

export interface AuthUser {
  user: User | null;
  role: string | null;
  isVIP: boolean;
  isDriver: boolean;
  isAdmin: boolean;
}

export class AuthService {
  static async signIn(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('No user data returned');
    }

    // Get user role from users table
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    const role = userData?.role || 'user';
    
    // Check for active subscription instead of role-based VIP check
    const hasSubscription = await AuthService.checkVIPAccess(data.user.id);
    
    return {
      user: data.user,
      role,
      isVIP: hasSubscription, // Subscription-based, not role-based
      isDriver: role === UserRoles.DRIVER,
      isAdmin: role === UserRoles.ADMIN,
    };
  }

  static async signUp(email: string, password: string, userData?: any): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('No user data returned');
    }

    // Create user record in users table
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: userData?.full_name || null,
        role: userData?.role || UserRoles.USER,
      });

    if (insertError) {
      console.error('Error creating user record:', insertError);
    }

    const role = userData?.role || UserRoles.USER;
    
    // Check for active subscription instead of role-based VIP check
    const hasSubscription = await AuthService.checkVIPAccess(data.user.id);
    
    return {
      user: data.user,
      role,
      isVIP: hasSubscription, // Subscription-based, not role-based
      isDriver: role === UserRoles.DRIVER,
      isAdmin: role === UserRoles.ADMIN,
    };
  }

  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    // Get user role from users table
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = userData?.role || 'user';
    
    // Check for active subscription instead of role-based VIP check
    const hasSubscription = await AuthService.checkVIPAccess(user.id);
    
    return {
      user,
      role,
      isVIP: hasSubscription, // Subscription-based, not role-based
      isDriver: role === UserRoles.DRIVER,
      isAdmin: role === UserRoles.ADMIN,
    };
  }

  static async checkVIPAccess(userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('package_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    return !!data;
  }
}



