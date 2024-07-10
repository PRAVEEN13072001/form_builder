import React, { useState } from 'react';
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

const ChartComponent = ({ data }) => {
  const [showBarChart, setShowBarChart] = useState(true);

  const toggleChart = () => {
    setShowBarChart(!showBarChart);
  };

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Responses Count',
      },
    },
  };

  return (
    <div>
      <button onClick={toggleChart} style={{ backgroundColor: 'green', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        {showBarChart ? 'Show Pie Chart' : 'Show Bar Chart'}
      </button>
      {showBarChart ? (
        <Bar data={data} options={commonOptions} />
      ) : (
        <Pie data={data} options={commonOptions} />
      )}
    </div>
  );
};

export default ChartComponent;
