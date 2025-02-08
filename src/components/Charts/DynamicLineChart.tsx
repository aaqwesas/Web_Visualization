// src/components/DynamicLineChart.tsx
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { supabase } from '../../lib/supabase';
import { Sale, AggregatedDataPoint } from '../types';
import { aggregateSalesData } from './utils';
import { FaCalendarDay, FaCalendarWeek, FaCalendarAlt } from 'react-icons/fa'; // Icons for buttons
import toast, { Toaster } from 'react-hot-toast';

const DynamicLineChart: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [aggregatedData, setAggregatedData] = useState<AggregatedDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch sales data from Supabase
  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('Sales').select('*');

      if (error) {
        console.error('Error fetching sales data:', error.message);
        toast.error('Failed to fetch sales data.');
      } else {
        setSales(data as Sale[]);
      }
      setLoading(false);
    };

    fetchSales();
  }, []);

  // Re-aggregate data whenever sales or timeframe changes
  useEffect(() => {
    const updatedAggregatedData = aggregateSalesData(sales, timeframe);
    setAggregatedData(updatedAggregatedData);
  }, [sales, timeframe]);

  // Handler for timeframe selection
  const handleTimeframeChange = (selected: 'daily' | 'weekly' | 'monthly') => {
    setTimeframe(selected);
  };

  if (loading) {
    return <div>Loading chart data...</div>; // You can replace this with a spinner
  }

  return (
    <div style={{ width: '100%', height: 500, padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sales Over Time</h2>

      {/* Timeframe Selection Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
        <button
          onClick={() => handleTimeframeChange('daily')}
          style={{
            padding: '10px 20px',
            backgroundColor: timeframe === 'daily' ? '#007bff' : '#f0f0f0',
            color: timeframe === 'daily' ? '#ffffff' : '#000000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <FaCalendarDay />
          Daily
        </button>
        <button
          onClick={() => handleTimeframeChange('weekly')}
          style={{
            padding: '10px 20px',
            backgroundColor: timeframe === 'weekly' ? '#007bff' : '#f0f0f0',
            color: timeframe === 'weekly' ? '#ffffff' : '#000000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <FaCalendarWeek />
          Weekly
        </button>
        <button
          onClick={() => handleTimeframeChange('monthly')}
          style={{
            padding: '10px 20px',
            backgroundColor: timeframe === 'monthly' ? '#007bff' : '#f0f0f0',
            color: timeframe === 'monthly' ? '#ffffff' : '#000000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <FaCalendarAlt />
          Monthly
        </button>
      </div>

      {/* Line Chart */}
      <ResponsiveContainer>
        <LineChart
          data={aggregatedData}
          margin={{
            top: 20,
            right: 40,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalSales"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="Total Sales ($)"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
};

export default DynamicLineChart;