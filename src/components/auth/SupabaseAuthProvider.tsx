
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabaseAuthService, AuthUser, AuthState } from '@/utils/supabaseAuthService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, company?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface SupabaseAuthProviderProps {
  children: React.ReactNode;
}

export const SupabaseAuthProvider: React.FC<SupabaseAuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    session: null
  });
  const { toast } = useToast();

  useEffect(() => {
    console.log('SupabaseAuthProvider: Setting up auth');
    
    const checkAuth = async () => {
      console.log('SupabaseAuthProvider: Checking auth status');
      const isAuth = await supabaseAuthService.checkAuthStatus();
      const currentAuthState = supabaseAuthService.getAuthState();
      
      console.log('SupabaseAuthProvider: Auth check result:', { isAuth, currentAuthState });
      
      setAuthState({
        ...currentAuthState,
        isLoading: false
      });
    };

    checkAuth();

    // Set up auth state listener
    supabaseAuthService.onAuthStateChange((newState) => {
      console.log('SupabaseAuthProvider: Auth state changed:', newState);
      setAuthState(newState);
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('SupabaseAuthProvider: Login attempt for:', email);
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const result = await supabaseAuthService.login({ email, password });
    console.log('SupabaseAuthProvider: Login result:', result);
    
    if (result.success && result.user) {
      setAuthState(supabaseAuthService.getAuthState());
      toast({
        title: "Welcome back!",
        description: `Hello ${result.user.name}! You have successfully logged in.`,
      });
      return true;
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Login failed",
        description: result.error || "Please check your credentials.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, company?: string): Promise<boolean> => {
    console.log('SupabaseAuthProvider: Register attempt for:', email);
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const result = await supabaseAuthService.register({ name, email, password, company });
    console.log('SupabaseAuthProvider: Register result:', result);
    
    if (result.success && result.user) {
      setAuthState(supabaseAuthService.getAuthState());
      toast({
        title: "Account created!",
        description: `Welcome to ClearQR.io, ${result.user.name}!`,
      });
      return true;
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Registration failed",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    console.log('SupabaseAuthProvider: Logout attempt');
    const currentUser = authState.user;
    await supabaseAuthService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      session: null
    });
    toast({
      title: "Logged out",
      description: `Goodbye ${currentUser?.name || 'User'}! You have been successfully logged out.`,
    });
  };

  const updateProfile = async (updates: Partial<AuthUser>): Promise<boolean> => {
    console.log('SupabaseAuthProvider: Update profile attempt');
    const result = await supabaseAuthService.updateProfile(updates);
    
    if (result.success && result.user) {
      setAuthState(supabaseAuthService.getAuthState());
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      return true;
    } else {
      toast({
        title: "Update failed",
        description: result.error || "Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfile
  };

  console.log('SupabaseAuthProvider: Rendering with state:', authState);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
