import React from 'react';

const ProgressTracker = ({ subjects, daysLeft, recoveryScore }) => {
  const progress = Math.min(recoveryScore || 0, 100);

  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2d3d', margin: '0 0 10px 0' }}>Progress Tracker</h2>
      <div style={{ height: '1px', background: '#edf2fa', margin: '12px 0 20px' }}></div>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ height: '10px', background: '#eaf1fb', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{ height: '100%', background: '#4f8cff', width: `${progress}%`, transition: 'width 0.3s' }}></div>
        </div>
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2d3d', textAlign: 'right' }}>{daysLeft || 0}</div>
      </div>
    </div>
  );
};

export default ProgressTracker;
