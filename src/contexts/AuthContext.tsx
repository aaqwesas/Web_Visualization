// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContextType } from '../components/types';
import { User } from '@supabase/supabase-js';

// Define the shape of our authentication context

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
  // State to hold the current user and their role
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading as true

  useEffect(() => {
    // Function to fetch user role from profiles table
    const fetchUserRole = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error.message);
        setRole(null);
      } else {
        setRole(data.role);
      }
    };

    // Get the current user from Supabase
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error fetching session:', error.message);
        setUser(null);
        setRole(null);
      } else {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setRole(null);
        }
      }
      setLoading(false); // Authentication status determined
    });

    // Set up listener for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setRole(null);
      }
      setLoading(false); // Authentication status determined
      console.log('Auth state changed:', event, session?.user);
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Function to sign up a new user
  const signUp = async (email: string, password: string) => {
    // Use Supabase's signUp method to create a new user with the provided email and password
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:5173', // specify redirect URL
      },
    });

    if (error) throw error;

    if (data.user) {
      // Assign the 'user' role to the new user in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, role: 'user' }]);

      if (profileError) {
        console.error('Error assigning role to new user:', profileError.message);
        throw profileError;
      }
    }
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
    role, // Provided role state
    loading,
    signUp,
    signIn,
    signOut,
  };

  // Provide the authentication context to child components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};