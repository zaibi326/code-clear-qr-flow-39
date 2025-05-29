
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabaseAuthService, AuthUser, AuthState } from '@/utils/supabaseAuthService';
import { userProfileService } from '@/utils/userProfileService';
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

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    session: null
  });
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await supabaseAuthService.checkAuthStatus();
      const currentAuthState = supabaseAuthService.getAuthState();
      
      setAuthState({
        ...currentAuthState,
        isLoading: false
      });
    };

    checkAuth();

    // Set up auth state listener
    supabaseAuthService.onAuthStateChange((newState) => {
      setAuthState(newState);
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const result = await supabaseAuthService.login({ email, password });
    
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
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const result = await supabaseAuthService.register({ name, email, password, company });
    
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
