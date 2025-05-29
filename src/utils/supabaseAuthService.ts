
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  company?: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  company?: string;
}

export class SupabaseAuthService {
  private static instance: SupabaseAuthService;
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    session: null
  };

  static getInstance(): SupabaseAuthService {
    if (!SupabaseAuthService.instance) {
      SupabaseAuthService.instance = new SupabaseAuthService();
    }
    return SupabaseAuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    this.authState.isLoading = true;
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        this.authState.isLoading = false;
        return { success: false, error: error.message };
      }

      if (data.user && data.session) {
        // Get user profile from profiles table
        const profile = await this.fetchUserProfile(data.user.id);
        
        if (profile) {
          this.authState = {
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            session: data.session
          };

          // Update last login time
          await this.updateLastLogin(data.user.id);

          return { success: true, user: profile };
        }
      }

      this.authState.isLoading = false;
      return { success: false, error: 'Profile not found' };
    } catch (error) {
      this.authState.isLoading = false;
      return { success: false, error: 'Login failed' };
    }
  }

  async register(data: RegisterData): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    this.authState.isLoading = true;
    
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            company: data.company
          }
        }
      });

      if (error) {
        this.authState.isLoading = false;
        return { success: false, error: error.message };
      }

      if (authData.user) {
        // The profile will be automatically created by the trigger
        // Wait a moment for the trigger to complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const profile = await this.fetchUserProfile(authData.user.id);
        
        if (profile) {
          this.authState = {
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            session: authData.session
          };

          return { success: true, user: profile };
        }
      }

      this.authState.isLoading = false;
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      this.authState.isLoading = false;
      return { success: false, error: 'Registration failed' };
    }
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    this.authState = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      session: null
    };
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profile = await this.fetchUserProfile(session.user.id);
        
        if (profile) {
          this.authState = {
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            session
          };
          return true;
        }
      }

      this.authState = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        session: null
      };
      return false;
    } catch (error) {
      console.error('Auth status check failed:', error);
      return false;
    }
  }

  private async fetchUserProfile(userId: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        console.error('Profile fetch error:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        company: data.company,
        plan: data.plan as 'free' | 'pro' | 'enterprise',
        createdAt: new Date(data.created_at),
        lastLoginAt: data.last_login_at ? new Date(data.last_login_at) : undefined
      };
    } catch (error) {
      console.error('Profile fetch failed:', error);
      return null;
    }
  }

  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await supabase
        .from('profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Failed to update last login:', error);
    }
  }

  getAuthState(): AuthState {
    return { ...this.authState };
  }

  getSession(): Session | null {
    return this.authState.session;
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  getCurrentUser(): AuthUser | null {
    return this.authState.user;
  }

  async updateProfile(updates: Partial<AuthUser>): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    if (!this.authState.user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          company: updates.company,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.authState.user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local state
      this.authState.user = { ...this.authState.user, ...updates };
      
      return { success: true, user: this.authState.user };
    } catch (error) {
      return { success: false, error: 'Profile update failed' };
    }
  }

  async changePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Password change failed' };
    }
  }

  // Set up auth state listener
  onAuthStateChange(callback: (state: AuthState) => void) {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await this.fetchUserProfile(session.user.id);
        if (profile) {
          this.authState = {
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            session
          };
        }
      } else if (event === 'SIGNED_OUT') {
        this.authState = {
          user: null,
          isAuthenticated: false,
          isLoading: false,
          session: null
        };
      }
      
      callback(this.authState);
    });
  }
}

export const supabaseAuthService = SupabaseAuthService.getInstance();
