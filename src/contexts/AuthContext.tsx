import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

// Define the shape of our authentication context
type AuthContextType = {
  user: User | null;
  signUp: (email: string, password: string, role: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the context with undefined as default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to wrap the app and provide authentication context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to hold the current user
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set up listener for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Function to sign up a new user
  const signUp = async (email: string, password: string, role: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role } // Store the user's role in Supabase auth metadata
      }
    });
    if (error) throw error;
  };

  // Function to sign in an existing user
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  // Function to sign out the current user
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Create the value object to be provided to consumers of this context
  const value = {
    user,
    signUp,
    signIn,
    signOut
  };

  // Provide the authentication context to child components

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};