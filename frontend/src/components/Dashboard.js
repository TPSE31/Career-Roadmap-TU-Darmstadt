import React from 'react';
import { useUserProgress } from '../hooks/useUserProgress';
import { useUpcomingMilestones } from '../hooks/useMilestones';
import { useHighPriorityRecommendations } from '../hooks/useRecommendations';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const Dashboard = () => {
  const { progress, loading: progressLoading, error: progressError } = useUserProgress();
  const { milestones, loading: milestonesLoading, error: milestonesError } = useUpcomingMilestones();
  const { recommendations, loading: recsLoading, error: recsError } = useHighPriorityRecommendations();

  if (progressLoading || milestonesLoading || recsLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (progressError || milestonesError || recsError) {
    return <ErrorMessage error={progressError || milestonesError || recsError} />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>
          Welcome back, {progress?.student_name}! 👋
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          {progress?.program} • Semester {progress?.current_semester}
        </p>
      </div>

      {/* Progress Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Credits Card */}
        <div style={{
          backgroundColor: '#3498db',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>
            Total Credits
          </h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
            {progress?.total_credits}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
            of {progress?.required_credits} required
          </p>
        </div>

        {/* Completion Card */}
        <div style={{
          backgroundColor: '#2ecc71',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>
            Completion
          </h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
            {progress?.completion_percentage}%
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
            of your degree
          </p>
        </div>

        {/* Status Card */}
        <div style={{
          backgroundColor: progress?.on_track ? '#27ae60' : '#e74c3c',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>
            Status
          </h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
            {progress?.on_track ? '✓' : '⚠'}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
            {progress?.on_track ? 'On Track' : 'Behind Schedule'}
          </p>
        </div>

        {/* Modules Card */}
        <div style={{
          backgroundColor: '#9b59b6',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>
            Completed Modules
          </h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
            {progress?.completed_modules}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
            {progress?.in_progress_modules} in progress
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px'
      }}>
        {/* Upcoming Milestones */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>
            📅 Upcoming Milestones
          </h2>
          {milestones.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
              No upcoming milestones. Great job! 🎉
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {milestones.map(milestone => (
                <div 
                  key={milestone.id}
                  style={{
                    padding: '16px',
                    backgroundColor: '#f8f9fa',
                    borderLeft: '4px solid #3498db',
                    borderRadius: '4px'
                  }}
                >
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                    {milestone.title}
                  </h4>
                  <p style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '14px', 
                    color: '#666' 
                  }}>
                    {milestone.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#999'
                  }}>
                    <span>⏰ Deadline: {milestone.deadline}</span>
                    <span>📍 Semester {milestone.semester}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Important Recommendations */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>
            ⚡ Important Recommendations
          </h2>
          {recommendations.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
              No recommendations at the moment.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendations.map(rec => (
                <div 
                  key={rec.id}
                  style={{
                    padding: '16px',
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '8px'
                  }}>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>
                      {rec.title}
                    </h4>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: rec.priority === 'high' ? '#e74c3c' : '#f39c12',
                      color: 'white',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '14px', 
                    color: '#666' 
                  }}>
                    {rec.description}
                  </p>
                  <p style={{ 
                    margin: 0,
                    fontSize: '12px',
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    💡 {rec.reason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Career Goal Section */}
      <div style={{
        marginTop: '30px',
        padding: '24px',
        backgroundColor: '#ecf0f1',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#555' }}>
          🎯 Your Career Goal
        </h3>
        <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
          {progress?.career_goal}
        </p>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#7f8c8d' }}>
          Expected Graduation: {progress?.expected_graduation}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
