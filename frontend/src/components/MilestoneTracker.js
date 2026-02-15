import React from 'react';
import { useMilestones } from '../hooks/useMilestones';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const MilestoneTracker = () => {
  const { milestones, loading, error } = useMilestones();

  if (loading) {
    return <LoadingSpinner message="Loading milestones..." />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '10px' }}>Academic Milestones</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Key milestones throughout the B.Sc. Computer Science program
      </p>

      {/* Milestones List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            style={{
              display: 'flex',
              alignItems: 'start',
              padding: '20px',
              backgroundColor: 'white',
              border: '2px solid #ddd',
              borderRadius: '12px'
            }}
          >
            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '8px'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '18px',
                  color: '#2c3e50'
                }}>
                  {milestone.title}
                </h3>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: getTypeColor(milestone.type),
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  marginLeft: '16px'
                }}>
                  {milestone.type}
                </span>
              </div>

              <p style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.5'
              }}>
                {milestone.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
                fontSize: '13px',
                color: '#666'
              }}>
                <div>
                  <strong>Deadline:</strong>
                  <br />
                  {new Date(milestone.deadline).toLocaleDateString('de-DE')}
                </div>
                <div>
                  <strong>Semester:</strong>
                  <br />
                  {milestone.semester}
                </div>
                {milestone.credits_required && (
                  <div>
                    <strong>Credits Required:</strong>
                    <br />
                    {milestone.credits_required} ECTS
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getTypeColor = (type) => {
  const colors = {
    'academic': '#3498db',
    'credit': '#9b59b6',
    'decision': '#e67e22',
    'thesis': '#e74c3c'
  };
  return colors[type] || '#95a5a6';
};

export default MilestoneTracker;
