import React from 'react';
import { useMilestones } from '../hooks/useMilestones';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const MilestoneTracker = () => {
  const { milestones, loading, error, updateMilestone } = useMilestones();

  if (loading) {
    return <LoadingSpinner message="Loading milestones..." />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const completedCount = milestones.filter(m => m.completed).length;
  const totalCount = milestones.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '10px' }}>Milestone Tracker</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Track your academic progress through key milestones
      </p>

      {/* Progress Bar */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
            Overall Progress
          </span>
          <span style={{ fontSize: '14px', color: '#666' }}>
            {completedCount} of {totalCount} milestones completed
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '24px',
          backgroundColor: '#ecf0f1',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: '#2ecc71',
            transition: 'width 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '10px',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {progressPercent > 10 && `${Math.round(progressPercent)}%`}
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {milestones.map((milestone, index) => (
          <div 
            key={milestone.id}
            style={{
              display: 'flex',
              alignItems: 'start',
              padding: '20px',
              backgroundColor: milestone.completed ? '#e8f5e9' : 'white',
              border: `2px solid ${milestone.completed ? '#2ecc71' : '#ddd'}`,
              borderRadius: '12px',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Checkbox */}
            <div style={{ 
              marginRight: '16px',
              marginTop: '4px'
            }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={milestone.completed}
                  onChange={() => updateMilestone(milestone.id, !milestone.completed)}
                  style={{
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer'
                  }}
                />
              </label>
            </div>

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
                  textDecoration: milestone.completed ? 'line-through' : 'none',
                  color: milestone.completed ? '#666' : '#2c3e50'
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
                  <strong>📅 Deadline:</strong>
                  <br />
                  {new Date(milestone.deadline).toLocaleDateString('de-DE')}
                </div>
                <div>
                  <strong>📚 Semester:</strong>
                  <br />
                  {milestone.semester}
                </div>
                {milestone.credits_required && (
                  <div>
                    <strong>⭐ Credits Required:</strong>
                    <br />
                    {milestone.credits_required} ECTS
                  </div>
                )}
                {milestone.completed && milestone.completion_date && (
                  <div style={{ color: '#2ecc71' }}>
                    <strong>✓ Completed:</strong>
                    <br />
                    {new Date(milestone.completion_date).toLocaleDateString('de-DE')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Celebration Message */}
      {completedCount === totalCount && (
        <div style={{
          marginTop: '40px',
          padding: '30px',
          backgroundColor: '#fff9e6',
          border: '2px solid #ffc107',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#f39c12' }}>
            Congratulations!
          </h3>
          <p style={{ margin: 0, color: '#666' }}>
            You've completed all your milestones. Keep up the great work!
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to get color based on milestone type
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
