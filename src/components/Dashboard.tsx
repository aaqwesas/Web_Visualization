// Dashboard.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaShoppingCart, FaUserShield } from 'react-icons/fa'; // Importing icons for better UI
import toast, { Toaster } from 'react-hot-toast'; // For user feedback

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Successfully signed out!');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out. Please try again.');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Embedded CSS Styles */}
      <style>{`
        .dashboard-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Navigation Bar */
        .navbar {
          background-color: #343a40;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #ffffff;
        }

        .navbar-brand {
          font-size: 24px;
          font-weight: bold;
          text-decoration: none;
          color: #ffffff;
        }

        .navbar-links {
          display: flex;
          gap: 20px;
        }

        .navbar-link {
          text-decoration: none;
          color: #ffffff;
          font-size: 16px;
          display: flex;
          align-items: center;
          transition: color 0.3s ease;
        }

        .navbar-link:hover {
          color: #adb5bd;
        }

        .navbar-link svg {
          margin-right: 5px;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
        }

        .welcome-card {
          background-color: #ffffff;
          padding: 30px 40px;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 500px;
          width: 100%;
        }

        .welcome-message {
          font-size: 28px;
          color: #333333;
          margin-bottom: 10px;
        }

        .welcome-submessage {
          font-size: 18px;
          color: #555555;
          margin-bottom: 30px;
        }

        .action-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .action-button {
          padding: 12px 25px;
          background-color: #007bff;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          transition: background-color 0.3s ease;
        }

        .action-button:hover {
          background-color: #0056b3;
        }

        .action-button svg {
          margin-right: 8px;
        }

        /* Sign Out Button */
        .signout-button {
          padding: 10px 20px;
          background-color: #dc3545;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background-color 0.3s ease;
        }

        .signout-button:hover {
          background-color: #c82333;
        }

        .signout-button svg {
          margin-right: 8px;
        }

        /* Responsive Design */
        @media (max-width: 600px) {
          .navbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .navbar-links {
            flex-direction: column;
            gap: 10px;
          }

          .action-buttons {
            flex-direction: column;
            gap: 15px;
          }

          .action-button, .signout-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          Beverage Shop
        </Link>
        <div className="navbar-links">
          <Link to="/ordering" className="navbar-link">
            <FaShoppingCart />
            Order
          </Link>
          <Link to="/admin" className="navbar-link">
            <FaUserShield />
            Admin
          </Link>
          <button className="signout-button" onClick={handleSignOut}>
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="welcome-card">
          <h1 className="welcome-message">Welcome to Your Dashboard, {user?.email}</h1>
          <p className="welcome-submessage">Manage your orders and admin settings seamlessly.</p>
          <div className="action-buttons">
            <Link to="/ordering" className="action-button">
              <FaShoppingCart />
              Place Your Order
            </Link>
            <Link to="/admin" className="action-button">
              <FaUserShield />
              Admin Panel
            </Link>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Dashboard;