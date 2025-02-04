import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <h1>Welcome to the Admin Dashboard, {user?.email}</h1>
      <p>You have admin privileges.</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default AdminDashboard;