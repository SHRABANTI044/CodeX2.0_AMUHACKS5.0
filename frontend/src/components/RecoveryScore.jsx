import React from 'react';
import { calculateRecoveryScore } from '../utils/calculations';

const RecoveryScore = ({ subjects, hoursPerDay, studyDays, daysNeeded }) => {
  const score = calculateRecoveryScore(subjects, hoursPerDay, studyDays);

  const getGaugeColor = () => {
    if (score >= 70) return '#10b981'; // Green
    if (score >= 40) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreText = () => {
    if (score >= 70) return 'Good';
    if (score >= 40) return 'Moderate';
    return 'Poor';
  };

  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2d3d', margin: '0 0 10px 0' }}>Recovery Score</h2>
      <div style={{ height: '1px', background: '#edf2fa', margin: '12px 0 20px' }}></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ width: '120px', height: '60px', borderRadius: '60px 60px 0 0', background: '#e5e7eb', position: 'relative', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: getGaugeColor(), width: `${score}%`, transition: 'width 0.3s' }}></div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px', color: getGaugeColor() }}>{Math.round(score) || 0}%</div>
        </div>
        <div>
          <div style={{ fontSize: '14px', color: '#6b7c93', marginBottom: '8px' }}>Score: {getScoreText()}</div>
          <div style={{ fontSize: '14px', color: '#6b7c93' }}>You can recover your syllabus in {daysNeeded || 0} days if you follow this plan.</div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryScore;
