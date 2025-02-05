import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Import react-hot-toast

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, user } = useAuth(); // Destructure currentUser from useAuth
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing user session on component mount
    if (user) {
      // If user is already authenticated, navigate to dashboard
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      toast.success('Logged in successfully!', {
        duration: 3000,
        position: 'top-center',
      });
      navigate('/dashboard');
    } catch (error: any) { // Type as any to handle different error types
      console.error('Error signing in:', error);
      // Show an error toast with a user-friendly message
      const errorMessage =
        error?.message || 'An unexpected error occurred. Please try again.';
      toast.error(`Failed to log in: ${errorMessage}`, {
        icon: '❌',
        duration: 4000, // Display for 4 seconds
        position: 'top-center', // Position the toast at the top center
        style: {
          backgroundColor: '#ff4d4f', // Red background for error
          color: '#fff', // White text
          padding: '16px',
          borderRadius: '8px',
        },
      });
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      width: '300px',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    input: {
      margin: '10px 0',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    button: {
      margin: '10px 0',
      padding: '10px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#1877f2',
      color: 'white',
      cursor: 'pointer',
    },
    link: {
      textDecoration: 'none',
      color: '#1877f2',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Add the Toaster component to render the toasts */}
      <Toaster />

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Log In</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Log In</button>
        <Link to="/signup" style={styles.link}>Don't have an account? Sign up</Link>
      </form>
    </div>
  );
};

export default Login;