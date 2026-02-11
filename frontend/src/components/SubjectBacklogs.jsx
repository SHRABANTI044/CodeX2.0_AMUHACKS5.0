import React from 'react';

const SubjectBacklogs = ({ subjects }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7c93';
    }
  };

  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2d3d', margin: '0 0 10px 0' }}>Subject Backlogs</h2>
      <div style={{ height: '1px', background: '#edf2fa', margin: '12px 0 20px' }}></div>
      {subjects.map((subject, index) => (
        <div key={index} style={{ background: '#f7faff', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2d3d', marginBottom: '4px' }}>{subject.name}</div>
              <span style={{ fontSize: '12px', color: getDifficultyColor(subject.difficulty), background: 'white', padding: '2px 8px', borderRadius: '10px' }}>{subject.difficulty}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#6b7c93', marginBottom: '4px' }}>{subject.completion || 0}%</div>
              <div style={{ width: '60px', height: '4px', background: '#e6edf7', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#4f8cff', width: `${subject.completion || 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubjectBacklogs;
