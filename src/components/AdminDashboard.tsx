// AdminDashboard.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

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
    <div className="admin-dashboard-container">
      <style>{`
        .admin-dashboard-container {
          max-width: 800px;
          margin: 80px auto 50px auto; /* Adjusted for fixed navbar */
          padding: 30px;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          box-sizing: border-box;
        }

        .admin-dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .admin-dashboard-title {
          font-size: 28px;
          color: #333333;
        }

        .admin-dashboard-button {
          padding: 10px 20px;
          background-color: #007bff;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .admin-dashboard-button:hover {
          background-color: #0056b3;
        }

        .admin-dashboard-section {
          margin-bottom: 25px;
        }

        .admin-dashboard-section-title {
          font-size: 22px;
          color: #555555;
          margin-bottom: 15px;
        }

        .admin-dashboard-info {
          font-size: 18px;
          color: #333333;
          margin-bottom: 10px;
        }

        .admin-dashboard-actions {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        /* Sign Out Button Styling */
        .signout-button {
          padding: 10px 20px;
          background-color: #dc3545;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .signout-button:hover {
          background-color: #c82333;
        }

        /* Responsive Adjustments */
        @media (max-width: 600px) {
          .admin-dashboard-container {
            padding: 20px;
            margin: 60px 20px 30px 20px; /* Adjusted for fixed navbar */
          }

          .admin-dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .admin-dashboard-title {
            font-size: 24px;
          }

          .admin-dashboard-button,
          .signout-button {
            width: 100%;
            text-align: center;
          }

          .admin-dashboard-actions {
            flex-direction: column;
            width: 100%;
          }
        }
      `}</style>

      {/* Header Section */}
      <div className="admin-dashboard-header">
        <h1 className="admin-dashboard-title">Admin Dashboard</h1>
        <button className="signout-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      {/* Welcome Section */}
      <div className="admin-dashboard-section">
        <h2 className="admin-dashboard-section-title">Welcome, {user?.email}</h2>
        <p className="admin-dashboard-info">You have admin privileges.</p>
      </div>

      {/* Manage Menu Section */}
      <div className="admin-dashboard-section">
        <h2 className="admin-dashboard-section-title">Manage Menu</h2>
        <div className="admin-dashboard-actions">
          <Link to="/add-drink" className="admin-dashboard-button">
            Add a New Drink
          </Link>
          <Link to="/dashboard" className="admin-dashboard-button">
            Show Drink Statistics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;