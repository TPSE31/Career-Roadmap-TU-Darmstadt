import React from 'react';

const ErrorMessage = ({ error, onRetry }) => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#fee', 
      border: '1px solid #fcc',
      borderRadius: '8px',
      margin: '20px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</div>
      <h3 style={{ color: '#c33', margin: '10px 0' }}>Error</h3>
      <p style={{ color: '#666', margin: '10px 0' }}>{error}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
