// src/components/BarChartComponent.tsx
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { supabase } from '../../lib/supabase'; // Ensure this path is correct based on your project structure
import { AggregatedRevenue, MenuItem, OrderDetail } from '../types';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#A28EFF', '#FF6699'];

const BarChartComponent: React.FC = () => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedRevenue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      setLoading(true);

      try {
        // Fetch Sales data with details column
        const { data: salesData, error: salesError } = await supabase
          .from<OrderDetail>('Sales')
          .select('Details');

        if (salesError) {
          throw salesError;
        }

        // Fetch Menu data
        const { data: menuData, error: menuError } = await supabase
          .from<MenuItem>('Menu')
          .select('*');

        if (menuError) {
          throw menuError;
        }

        if (!salesData || salesData.length === 0) {
          setAggregatedData([]);
          setLoading(false);
          return;
        }

        if (!menuData || menuData.length === 0) {
          setAggregatedData([]);
          setLoading(false);
          return;
        }

        // Create a map for DrinkName to Price
        const menuMap: { [key: string]: number } = {};
        menuData.forEach((item) => {
          menuMap[item.DrinkName.trim().toLowerCase()] = item.price; // Trim and lowercase for consistency
        });

        // Aggregate quantities per DrinkName
        const quantityMap: { [key: string]: number } = {};
        salesData.forEach((sale : Object[]) => {
          sale.Details.forEach((detail : Object) => {
            const drinkNameKey = detail.DrinkName.trim().toLowerCase();
            if (menuMap[drinkNameKey] !== undefined) { // Ensure the drink exists in the menu
              if (quantityMap[drinkNameKey]) {
                quantityMap[drinkNameKey] += detail.quantity;
              } else {
                quantityMap[drinkNameKey] = detail.quantity;
              }
            } else {
              console.warn(`Drink "${detail.DrinkName}" not found in Menu. Skipping.`);
            }
          });
        });

        // Calculate revenue per DrinkName
        const revenueData: AggregatedRevenue[] = Object.keys(quantityMap).map((drinkKey) => {
          const drinkNameOriginal = menuData.find(
            (item) => item.DrinkName.trim().toLowerCase() === drinkKey
          )?.DrinkName || drinkKey; // Retrieve original casing
          return {
            name: drinkNameOriginal,
            revenue: Number((quantityMap[drinkKey] * (menuMap[drinkKey] || 0)).toFixed(2)), // Ensuring two decimal places
          };
        });

        revenueData.sort((a, b) => b.revenue - a.revenue);

        setAggregatedData(revenueData);
      } catch (error: any) {
        console.error('Error fetching or processing data:', error.message);
        setAggregatedData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Loading Bar Chart...</p>
      </div>
    );
  }

  if (aggregatedData.length === 0) {
    return <p style={{ textAlign: 'center' }}>No revenue data available for the Bar Chart.</p>;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Revenue per Drink</h3>
      {/* Fixed Height for the Chart */}
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer>
          <BarChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value}`} />
            <Legend />
            <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)">
              {aggregatedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;