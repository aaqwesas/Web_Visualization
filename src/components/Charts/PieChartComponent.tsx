// src/components/PieChartComponent.tsx
import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { supabase } from '../../lib/supabase'; // Adjust the import path as necessary
import { SaleDetail, Sale } from '../types'; // Ensure correct path

interface PieData {
  name: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6699'];

const PieChartComponent: React.FC = () => {
  const [data, setData] = useState<PieData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPieData = async () => {
      setLoading(true);
      try {
        const { data: salesData, error } = await supabase
          .from('Sales')
          .select('Details');

        if (error) {
          throw error;
        }

        console.log('Fetched Sales Data:', salesData);

        // Aggregate drink names and quantities
        const drinkMap: { [key: string]: number } = {};

        salesData?.forEach((sale: Sale) => {
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

        const pieData: PieData[] = Object.keys(drinkMap).map((drink) => ({
          name: drink,
          value: drinkMap[drink],
        }));

        console.log('Pie Chart Data:', pieData);

        setData(pieData);
      } catch (error: any) {
        console.error('Error fetching sales data for Pie Chart:', error.message);
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
        {/* You can replace this with a spinner or loader component if desired */}
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