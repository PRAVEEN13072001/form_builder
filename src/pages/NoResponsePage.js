// NoResponsePage.js
import React from 'react';
import './NoResponsePage.css';

const NoResponsePage = () => {
  return (
    <div className="no-response-container">
      <div className="message-box">
        <h1 className="title">Thank you for your interest!</h1>
        <p className="message">We are no longer accepting responses at this time.</p>
      </div>
    </div>
  );
};

export default NoResponsePage;
