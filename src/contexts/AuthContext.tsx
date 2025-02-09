// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContextType } from '../components/types'; // Ensure this path is correct
import { User } from '@supabase/supabase-js';
import { Toaster, toast } from 'react-hot-toast'; // Correct import

// Create the Authentication Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
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
    // Function to fetch user role from user_metadata
    const fetchUserRole = (user: User) => {
      if (user?.user_metadata && user.user_metadata.role) {
        setRole(user.user_metadata.role);
      } else {
        console.error('User role not found in metadata');
        setRole(null);
      }
    };

    // Async function to get the current session and user
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserRole(session.user);
        }
      } catch (error: any) {
        console.error('Error fetching session:', error.message);
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false); // Authentication status determined
      }
    };

    // Call the async function to get the session
    getSession();

    // Set up listener for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user);
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
  const signUp = async (email: string, password: string, role: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'http://localhost:5173', // specify redirect URL
          data: { role }, // Add role to user_metadata
        },
      });

      if (error) {
        // Enhanced error handling based on error codes or messages
        if (error.message.includes('duplicate')) {
          toast.error('This email is already registered. Please sign in or use a different email.');
        } else {
          toast.error(`Sign Up Error: ${error.message}`);
        }
        throw error;
      }

      toast.success('Signup successful! Please check your email for confirmation.');
    } catch (error: any) {
      // Log the entire error object for debugging purposes
      console.error('Error during sign up:', error);
      // Re-throw the error if you want to handle it further up the call stack
      throw error;
    }
  };

  // Function to sign in an existing user
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password.');
        } else {
          toast.error(`Sign In Error: ${error.message}`);
        }
        throw error;
      }
      toast.success('Signed in successfully!');
    } catch (error: any) {
      console.error('Error during sign in:', error);
      throw error;
    }
  };

  // Function to sign out the current user
  const signOutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(`Sign Out Error: ${error.message}`);
        throw error;
      }
      toast.success('Signed out successfully!');
    } catch (error: any) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };

  // Create the value object to be provided to consumers of this context
  const value: AuthContextType = {
    user,
    role, // Provided role state
    loading,
    signUp,
    signIn,
    signOut: signOutUser,
  };

  // Provide the authentication context to child components
  return (
    <AuthContext.Provider value={value}>
      {children}
      <Toaster position="top-right" reverseOrder={false} />
    </AuthContext.Provider>
  );
};