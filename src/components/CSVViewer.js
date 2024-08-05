import React from 'react';
import { Table } from '@mantine/core';

const CSVViewer = ({ csvData }) => {
  if (!csvData) {
    return <div>No data available</div>;
  }

  const rows = csvData.split('\n').map(row => row.split(','));

  if (rows.length === 0 || rows[0].length === 0) {
    return <div>Invalid CSV data</div>;
  }

  return (
    <Table>
      <thead>
        <tr>
          {rows[0].map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.slice(1).map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CSVViewer;
