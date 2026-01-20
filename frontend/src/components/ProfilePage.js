import React, { useState } from 'react';

const ProfilePage = ({ user, onGoalChange, language }) => {
  const brandColor = '#0F6CBF';
  
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(user?.careerGoal || 'Software Engineer');

  const careerGoals = [
    'Software Engineer',
    'Backend Developer',
    'Frontend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Machine Learning Engineer',
    'DevOps Engineer',
    'Cloud Architect',
    'Mobile Developer',
    'Game Developer',
    'Cybersecurity Specialist',
    'AI Researcher',
    'Database Administrator',
    'IT Consultant',
    'Product Manager (Tech)',
  ];

  const translations = {
    en: {
      myProfile: 'My Profile',
      personalInfo: 'Personal Information',
      name: 'Name',
      studentId: 'Student ID',
      email: 'Email',
      program: 'Program',
      semester: 'Current Semester',
      careerGoal: 'Career Goal',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      academicProgress: 'Academic Progress',
      totalCredits: 'Total Credits',
      completedModules: 'Completed Modules',
      expectedGraduation: 'Expected Graduation',
    },
    de: {
      myProfile: 'Mein Profil',
      personalInfo: 'Persönliche Informationen',
      name: 'Name',
      studentId: 'Studenten-ID',
      email: 'E-Mail',
      program: 'Studiengang',
      semester: 'Aktuelles Semester',
      careerGoal: 'Karriereziel',
      edit: 'Bearbeiten',
      save: 'Speichern',
      cancel: 'Abbrechen',
      academicProgress: 'Akademischer Fortschritt',
      totalCredits: 'Gesamt Credits',
      completedModules: 'Abgeschlossene Module',
      expectedGraduation: 'Voraussichtlicher Abschluss',
    }
  };

  const t = translations[language];

  const handleSaveGoal = () => {
    onGoalChange(tempGoal);
    setEditingGoal(false);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: brandColor, marginBottom: '40px', fontSize: '36px' }}>
        {t.myProfile}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        {/* Personal Information Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: brandColor, marginBottom: '25px', fontSize: '24px' }}>
            {t.personalInfo}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <InfoField label={t.name} value={user?.name || 'N/A'} />
            <InfoField label={t.studentId} value={user?.studentId || 'N/A'} />
            <InfoField label={t.email} value={user?.email || 'N/A'} />
            <InfoField label={t.program} value={user?.program || 'N/A'} />
            <InfoField label={t.semester} value={user?.semester || 'N/A'} />
          </div>
        </div>

        {/* Career Goal Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: brandColor, margin: 0, fontSize: '24px' }}>
              🎯 {t.careerGoal}
            </h2>
            {!editingGoal && (
              <button
                onClick={() => setEditingGoal(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: brandColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {t.edit}
              </button>
            )}
          </div>

          {editingGoal ? (
            <div>
              <select
                value={tempGoal}
                onChange={(e) => setTempGoal(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: `2px solid ${brandColor}`,
                  borderRadius: '8px',
                  marginBottom: '15px',
                  cursor: 'pointer'
                }}
              >
                {careerGoals.map(goal => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleSaveGoal}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#27ae60',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  {t.save}
                </button>
                <button
                  onClick={() => {
                    setTempGoal(user?.careerGoal || 'Software Engineer');
                    setEditingGoal(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#2c3e50',
              textAlign: 'center'
            }}>
              {user?.careerGoal || 'Not Set'}
            </div>
          )}
        </div>

        {/* Academic Progress Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: brandColor, marginBottom: '25px', fontSize: '24px' }}>
            {t.academicProgress}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <StatCard label={t.totalCredits} value={`${user?.totalCredits || 0} / ${user?.requiredCredits || 180}`} color="#3498db" />
            <StatCard label={t.completedModules} value="8" color="#27ae60" />
            <StatCard label={t.expectedGraduation} value={user?.expectedGraduation || 'TBD'} color="#9b59b6" />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoField = ({ label, value }) => (
  <div style={{ marginBottom: '15px' }}>
    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px', fontWeight: 'bold', textTransform: 'uppercase' }}>
      {label}
    </div>
    <div style={{ fontSize: '16px', color: '#2c3e50', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
      {value}
    </div>
  </div>
);

const StatCard = ({ label, value, color }) => (
  <div style={{
    padding: '20px',
    backgroundColor: color,
    color: 'white',
    borderRadius: '8px',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
      {value}
    </div>
    <div style={{ fontSize: '14px', opacity: 0.9 }}>
      {label}
    </div>
  </div>
);

export default ProfilePage;
