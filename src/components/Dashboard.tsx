// src/components/Dashboard.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaShoppingCart, FaChartLine } from 'react-icons/fa'; // Updated icon (FaChartLine for analytics)
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import DynamicLineChart from './Charts/DynamicLineChart'; // Import the DynamicLineChart component
import PieChartComponent from './Charts/PieChartComponent'; // Import the PieChartComponent
import BarChartComponent from './Charts/BarChartComponent'; // Import the BarChartComponent
import toast, { Toaster } from 'react-hot-toast'; // For user feedback

const Dashboard: React.FC = () => {
  const { user, signOut, loading } = useAuth();
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
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
          display: flex;
          align-items: center;
          gap: 8px;
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

        /* Main Content Layout */
        .main-content {
          flex: 1;
          display: grid;
          grid-template-columns: 3fr 2fr;
          grid-template-rows: 1fr 1fr;
          gap: 20px;
          padding: 20px 20px;
        }

        /* Individual Chart Containers */
        .line-chart-container {
          grid-column: 1 / 2;
          grid-row: 1 / 3;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .pie-chart-container, .bar-chart-container {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .pie-chart-container {
          grid-column: 2 / 3;
          grid-row: 1 / 2;
        }

        .bar-chart-container {
          grid-column: 2 / 3;
          grid-row: 2 / 3;
        }

        /* Responsive Design */
        @media (max-width: 900px) {
          .main-content {
            grid-template-columns: 1fr;
            grid-template-rows: 3fr 2fr 2fr;
          }

          .line-chart-container {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
          }

          .pie-chart-container, .bar-chart-container {
            grid-column: 1 / 2;
            grid-row: auto;
          }
        }

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

          .signout-button {
            width: 100%;
            justify-content: center;
          }

          .main-content {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(3, auto);
            padding: 10px 20px;
          }
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <FaChartLine />
          Shop Statistics
        </Link>
        <div className="navbar-links">
          {user?.user_metadata?.role  == "admin" ? <Link to="/admin" className="navbar-link">
            <MdOutlineAdminPanelSettings />
            Admin
          </Link> : ""}
          
          <Link to="/ordering" className="navbar-link">
            <FaShoppingCart />
            Order
          </Link>
          <button className="signout-button" onClick={handleSignOut}>
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="main-content">
        {/* Line Chart on the Left */}
        <div className="line-chart-container">
          <DynamicLineChart />
        </div>

        {/* Pie Chart on the Top Right */}
        <div className="pie-chart-container">
          <PieChartComponent />
        </div>

        {/* Bar Chart on the Bottom Right */}
        <div className="bar-chart-container">
          <BarChartComponent />
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Dashboard;