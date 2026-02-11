import React from 'react';
import { calculateTodaysStudyPlan } from '../utils/calculations';

const StudyPlan = ({ subjects, hoursPerDay }) => {
  const todaysPlan = calculateTodaysStudyPlan(subjects, hoursPerDay);

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const totalHours = todaysPlan.reduce((sum, item) => sum + item.hours, 0);

  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2d3d', margin: '0 0 10px 0' }}>Today’s Study Plan</h2>
      <div style={{ height: '1px', background: '#edf2fa', margin: '12px 0 20px' }}></div>
      {todaysPlan.map((item, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f4fb' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', background: item.color || '#4f8cff', marginRight: '8px', borderRadius: '2px' }}></div>
            <div style={{ fontSize: '14px', color: '#1f2d3d' }}>{item.name}</div>
          </div>
          <div style={{ fontSize: '14px', color: '#6b7c93' }}>{formatTime(item.hours)}</div>
        </div>
      ))}
      <div style={{ fontWeight: 'bold', marginTop: '16px', textAlign: 'center', fontSize: '14px', color: '#1f2d3d' }}>Total: {formatTime(totalHours) || '0h 0m'} per day</div>
    </div>
  );
};

export default StudyPlan;
