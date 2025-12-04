import React from 'react';
import { useModules } from '../hooks/useModules';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const ModuleList = () => {
  const { modules, loading, error, refetch } = useModules();

  if (loading) {
    return <LoadingSpinner message="Loading modules..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0 }}>Available Modules ({modules.length})</h2>
        <button 
          onClick={refetch}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {modules.map((module) => (
          <div 
            key={module.id} 
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: module.completed ? '#e8f5e9' : 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '10px'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>{module.name}</h3>
              {module.completed && <span style={{ fontSize: '24px' }}>✓</span>}
            </div>
            
            <p style={{ 
              color: '#666', 
              fontSize: '12px',
              marginBottom: '10px'
            }}>
              {module.code}
            </p>
            
            <p style={{ 
              color: '#444', 
              fontSize: '14px',
              marginBottom: '15px',
              lineHeight: '1.4'
            }}>
              {module.description}
            </p>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              color: '#666'
            }}>
              <span>
                <strong>Credits:</strong> {module.credits}
              </span>
              <span>
                <strong>Semester:</strong> {module.semester}
              </span>
            </div>
            
            <div style={{ marginTop: '10px' }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                backgroundColor: module.category === 'Core' ? '#3498db' : '#95a5a6',
                color: 'white',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {module.category}
              </span>
              {module.required && (
                <span style={{
                  display: 'inline-block',
                  marginLeft: '8px',
                  padding: '4px 12px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  Required
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleList;
