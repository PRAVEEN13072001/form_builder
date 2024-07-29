import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MatplotlibPlot = () => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchPlot = async () => {
      try {
        // Make a request to your Flask server
        const response = await axios.get('http://127.0.0.1:5000/plot', {
          responseType: 'blob', // Important to handle binary data
        });
        const imageObjectURL = URL.createObjectURL(response.data);
        setImageUrl(imageObjectURL);
      } catch (error) {
        console.error('Error fetching the plot:', error);
      }
    };

    fetchPlot();
  }, []);

  return (
    <div>
      {imageUrl ? (
        <img src={imageUrl} alt="Matplotlib Plot" />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MatplotlibPlot;
