// Import necessary types and functions
import { Sale, AggregatedDataPoint } from '../types';
import { parseISO, format, startOfWeek, startOfMonth } from 'date-fns';

/**
 * Aggregates sales data based on the selected timeframe.
 * @param sales Array of sales records.
 * @param timeframe 'daily' | 'weekly' | 'monthly'
 * @returns Array of aggregated data points.
 */
export const aggregateSalesData = (
  sales: Sale[],
  timeframe: 'daily' | 'weekly' | 'monthly'
): AggregatedDataPoint[] => {
  // Initialize an object to store aggregated sales data
  const aggregation: { [key: string]: number } = {};

  // Iterate through each sale in the sales array
  sales.forEach((sale) => {
    // Parse the sale date string into a Date object
    const date = parseISO(sale.sale_date);
    let periodKey = '';

    // Determine the period key based on the selected timeframe
    switch (timeframe) {
      case 'daily':
        // For daily, use the date in 'yyyy-MM-dd' format
        periodKey = format(date, 'yyyy-MM-dd');
        break;
      case 'weekly':
        // For weekly, use the ISO week number starting on Monday
        periodKey = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-\'W\'II');
        break;
      case 'monthly':
        // For monthly, use the year and month in 'yyyy-MM' format
        periodKey = format(startOfMonth(date), 'yyyy-MM');
        break;
      default:
        // Default to daily format if an invalid timeframe is provided
        periodKey = format(date, 'yyyy-MM-dd');
    }

    // Aggregate the sales price for each period
    if (aggregation[periodKey]) {
      // If the period already exists, add the sale price to the existing total
      aggregation[periodKey] += sale.price;
    } else {
      // If it's a new period, initialize it with the sale price
      aggregation[periodKey] = sale.price;
    }
  });

  // Convert the aggregation object to an array of AggregatedDataPoint objects
  const aggregatedData: AggregatedDataPoint[] = Object.keys(aggregation)
    .map((key) => ({
      period: key,
      totalSales: aggregation[key],
    }))
    // Sort the array by period in ascending order
    .sort((a, b) => (a.period > b.period ? 1 : -1));

  // Return the sorted array of aggregated data points
  return aggregatedData;
};