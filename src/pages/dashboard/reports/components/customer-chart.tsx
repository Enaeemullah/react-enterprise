import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CustomerChartProps {
  timeRange: string;
}

export function CustomerChart({ timeRange }: CustomerChartProps) {
  // Mock data - replace with real data from your API
  const data = {
    labels: ['New', 'Returning', 'Inactive'],
    datasets: [
      {
        data: [300, 450, 100],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 99, 132, 0.5)',
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(255, 99, 132)',
        ],
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
        text: 'Customer Distribution',
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}