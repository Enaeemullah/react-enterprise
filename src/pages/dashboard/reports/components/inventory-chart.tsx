import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface InventoryChartProps {
  timeRange: string;
}

export function InventoryChart({ timeRange }: InventoryChartProps) {
  // Mock data - replace with real data from your API
  const data = {
    labels: ['Electronics', 'Furniture', 'Clothing', 'Books', 'Food', 'Other'],
    datasets: [
      {
        label: 'Current Stock',
        data: [120, 80, 150, 45, 90, 30],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
      {
        label: 'Reorder Point',
        data: [50, 30, 60, 20, 40, 15],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Inventory Levels by Category',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}