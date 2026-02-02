import React from 'react';
import { mockCareerPaths } from '../mocks/mockData';

const Dashboard = ({ onNavigate }) => {
  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#004E8A' }}>
          B.Sc. Informatik - Career Roadmap
        </h1>
        <p style={{ color: '#666', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
          Entdecke Module, Karrierewege und den Studienplan des B.Sc. Informatik an der TU Darmstadt.
        </p>
      </div>

      {/* Quick Links */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <QuickLink
          title="Modulkatalog"
          description="Alle Pflicht-, Wahlpflicht- und Wahlbereich-Module mit CP und Semesterempfehlung."
          color="#004E8A"
          onClick={() => onNavigate('modules')}
        />
        <QuickLink
          title="Roadmap & Karrierewege"
          description="Studienphasen, Meilensteine und welche Module zu welchem Beruf passen."
          color="#009CDE"
          onClick={() => onNavigate('roadmap')}
        />
      </div>

      {/* Career Paths Grid */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', color: '#004E8A' }}>
          Karrierewege
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {mockCareerPaths.map((career) => (
            <div
              key={career.id}
              onClick={() => onNavigate('roadmap')}
              style={{
                padding: '20px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderLeft: '4px solid #004E8A',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{career.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#004E8A' }}>
                {career.name}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                {career.salary}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const QuickLink = ({ title, description, color, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: '24px',
      backgroundColor: color,
      color: 'white',
      borderRadius: '12px',
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease'
    }}
    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{title}</h3>
    <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>{description}</p>
  </div>
);

export default Dashboard;
