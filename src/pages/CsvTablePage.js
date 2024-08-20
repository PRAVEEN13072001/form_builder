import React, { useEffect, useRef } from 'react';
import { Table, Container, Button } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';

const CsvTablePage = () => {
  const location = useLocation();
  const csvContent = location.state?.csvContent || '';
  const navigate = useNavigate();
  const backButtonRef = useRef(null);
  const params = new URLSearchParams(location.search);
  const id = params.get('formId');
  

  useEffect(() => {
    if (!csvContent) {
      navigate(`/Responses?formId=${id}`); // Navigate back if no CSV content is available
    } else {
      backButtonRef.current?.focus(); // Move focus to the "Back" button
    }
  }, [csvContent, navigate]);

  if (!csvContent) return <div>No CSV content to display</div>;

  const parseCsvContent = (content) => {
    const rows = content.split('\n').map((row) => row.split(','));
    return rows;
  };

  const renderTableHeader = (headers) => (
    <tr>
      <th>#</th> {/* Placeholder for row numbers */}
      {headers.map((header, index) => (
        <th key={index}>{header}</th>
      ))}
    </tr>
  );

  const renderTableBody = (rows) =>
    rows.slice(1).map((row, rowIndex) => (
      <tr key={rowIndex}>
        <td>{rowIndex + 1}</td> {/* Row number */}
        {row.map((cell, cellIndex) => (
          <td key={cellIndex}>{cell}</td>
        ))}
      </tr>
    ));

  const rows = parseCsvContent(csvContent);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <Container>
        <Button 
          ref={backButtonRef} 
          onClick={() => navigate(`/Responses?formId=${id}`)}
          style={{
            backgroundColor: '#ff7043',
            color: '#fff',
            marginBottom: '20px',
            padding: '10px 20px',
            borderRadius: '5px',
            fontSize: '16px',
          }}
        >
          Back
        </Button>
        <Table
          withBorder
          withColumnBorders
          highlightOnHover
          style={{
            border: '2px solid #ddd',
            borderCollapse: 'collapse',
            width: '100%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
          }}
        >
          <thead
            style={{
              backgroundColor: '#4caf50',
              borderBottom: '2px solid #388e3c',
              textAlign: 'center',
              color: '#fff',
              fontWeight: 'bold',
            }}
          >
            {rows[0] && renderTableHeader(rows[0])}
          </thead>
          <tbody style={{ textAlign: 'center' }}>
            {rows.length > 1 && renderTableBody(rows)}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default CsvTablePage;
