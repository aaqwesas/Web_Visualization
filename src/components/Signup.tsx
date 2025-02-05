import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; // Import react-hot-toast

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, role);
      toast.success('Signup successfully, a link is sent to your email.', {
        duration: 3000,
        position: 'top-center',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Failed to log in: '+ error, {
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
    <>
    <Toaster/>
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Sign Up</h2>
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
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          style={styles.input}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={styles.button}>Sign Up</button>
        <Link to="/login" style={styles.link}>Already have an account? Log in</Link>
      </form>
    </div>
    </>
  );
};

export default Signup;
