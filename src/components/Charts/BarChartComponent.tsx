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
import { supabase } from '../../lib/supabase';
import { AggregatedRevenue, MenuItem, Sale, SaleDetail } from '../types';
import { PostgrestError } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#A28EFF', '#FF6699'];

const BarChartComponent: React.FC = () => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedRevenue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      setLoading(true);

      try {
        // Fetch Sales data with 'Details'
        const { data: salesData, error: salesError }: { data: Sale[] | null; error: PostgrestError | null } =
          await supabase.from('Sales').select('Details');

        if (salesError) {
          throw salesError;
        }

        // Fetch Menu data
        const { data: menuData, error: menuError }: { data: MenuItem[] | null; error: PostgrestError | null } =
          await supabase.from('Menu').select('*');

        if (menuError) {
          throw menuError;
        }

        if (!salesData || salesData.length === 0) {
          toast.error('No sales data available for the Bar Chart.');
          setAggregatedData([]);
          setLoading(false);
          return;
        }

        if (!menuData || menuData.length === 0) {
          toast.error('No menu data available to calculate revenue.');
          setAggregatedData([]);
          setLoading(false);
          return;
        }

        // Create a map for DrinkName to Price (normalized)
        const menuMap: { [key: string]: number } = {};
        menuData.forEach((item) => {
          const normalizedDrinkName = item.DrinkName.trim().toLowerCase();
          menuMap[normalizedDrinkName] = item.price;
        });

        // Aggregate quantities per DrinkName
        const quantityMap: { [key: string]: number } = {};
        salesData.forEach((sale: Sale) => {
          sale.Details.forEach((detail: SaleDetail) => {
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
          // Retrieve original casing from menuData
          const originalDrinkName = menuData.find(
            (item) => item.DrinkName.trim().toLowerCase() === drinkKey
          )?.DrinkName || drinkKey; // Fallback to key if not found

          return {
            name: originalDrinkName,
            revenue: Number((quantityMap[drinkKey] * menuMap[drinkKey]).toFixed(2)),
          };
        });

        revenueData.sort((a, b) => b.revenue - a.revenue);

        setAggregatedData(revenueData);
      } catch (error: unknown) {
        if (error instanceof PostgrestError) {
          console.error('Postgrest Error:', error.message);
          toast.error(`Failed to load Bar Chart data: ${error.message}`);
        } else if (error instanceof Error) {
          console.error('General Error:', error.message);
          toast.error(`Failed to load Bar Chart data: ${error.message}`);
        } else {
          console.error('Unknown Error:', error);
          toast.error('An unexpected error occurred while loading Bar Chart data.');
        }
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
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer>
          <BarChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value}`} />
            <Legend />
            <Bar dataKey="revenue" name="Revenue ($)">
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