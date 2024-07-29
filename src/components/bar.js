import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components with Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ChartComponent = ({ data, flag }) => {
  console.log(flag);
  const [showBarChart, setShowBarChart] = useState(!flag);

  const toggleChart = () => {
    setShowBarChart(!showBarChart);
  };

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Arial, sans-serif',
          },
        },
      },
      title: {
        display: true,
        text: 'Responses Count',
        font: {
          size: 18,
          family: 'Arial, sans-serif',
        },
        color: '#333',
      },
    },
  };

  const pieOptions = {
    ...commonOptions,
    maintainAspectRatio: false,
    aspectRatio: 1,
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  };

  const buttonStyle = {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '10px 0',
  };

  const vividColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED',
  ];

  const updatedData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: vividColors,
      borderColor: vividColors.map(color => darkenColor(color, 0.2)),
      borderWidth: 1,
    })),
  };

  return (
    <div style={containerStyle}>
      <button onClick={toggleChart} style={buttonStyle}>
        {showBarChart ? 'Show Pie Chart' : 'Show Bar Chart'}
      </button>
      <div style={{ padding: '20px' }}>
        {showBarChart ? (
          <Bar data={updatedData} options={commonOptions} />
        ) : (
          <div style={{ height: '400px', width: '400px', margin: '0 auto' }}>
            <Pie data={updatedData} options={pieOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

// Utility function to darken a color
const darkenColor = (color, amount) => {
  let usePound = false;

  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }

  let num = parseInt(color, 16);

  let r = (num >> 16) + amount;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  let g = ((num >> 8) & 0x00FF) + amount;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  let b = (num & 0x0000FF) + amount;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  return (usePound ? "#" : "") + (r.toString(16).padStart(2, '0')) + (g.toString(16).padStart(2, '0')) + (b.toString(16).padStart(2, '0'));
};

export default ChartComponent;
