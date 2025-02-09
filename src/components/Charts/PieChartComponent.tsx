import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { supabase } from '../../lib/supabase'; 
import { Sale, SaleDetail, PieData } from '../types'; 
import { PostgrestError } from '@supabase/supabase-js'; 
import toast from 'react-hot-toast'; 

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6699'];

const PieChartComponent: React.FC = () => {
  const [data, setData] = useState<PieData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPieData = async () => {
      setLoading(true);
      try {
        // Fetch sales data with 'Details'
        const { data: salesData, error }: { data: Sale[] | null; error: PostgrestError | null } =
          await supabase.from('Sales').select('Details');

        if (error) {
          throw error;
        }

        if (!salesData) {
          throw new Error('No sales data found.');
        }

        console.log('Fetched Sales Data:', salesData);

        // Aggregate drink names and quantities
        const drinkMap: { [key: string]: number } = {};

        salesData.forEach((sale: Sale) => {
          sale.Details.forEach((detail: SaleDetail) => {
            const drinkName = detail.DrinkName.trim();
            if (drinkMap[drinkName]) {
              drinkMap[drinkName] += detail.quantity;
            } else {
              drinkMap[drinkName] = detail.quantity;
            }
          });
        });

        console.log('Aggregated Drink Map:', drinkMap);

        // Convert to PieData type
        const pieData: PieData[] = Object.entries(drinkMap).map(([name, value]) => ({
          name,
          value,
        }));

        console.log('Pie Chart Data:', pieData);

        setData(pieData);
      } catch (error: unknown) {
        // Enhanced error handling
        if (error instanceof PostgrestError) {
          console.error('Postgrest Error:', error.message);
          toast.error(`Failed to load Pie Chart data: ${error.message}`);
        } else if (error instanceof Error) {
          console.error('General Error:', error.message);
          toast.error(`Failed to load Pie Chart data: ${error.message}`);
        } else {
          console.error('Unknown Error:', error);
          toast.error('An unexpected error occurred while loading Pie Chart data.');
        }
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPieData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Loading Pie Chart...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <p style={{ textAlign: 'center' }}>No data available for the Pie Chart.</p>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Drink Distribution
      </h3>
      {/* Fixed Height for the Pie Chart */}
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value}`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartComponent;