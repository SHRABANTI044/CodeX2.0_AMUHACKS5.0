import React, { useState, useEffect } from 'react';
import { calculateRecoveryDays, calculateRecoveryScore, calculateStressLevel } from '../utils/calculations';

const WhatIfSimulator = ({ hoursPerDay, setHoursPerDay, subjects, studyDays, onUpdate }) => {
  const [selectedHours, setSelectedHours] = useState(hoursPerDay);
  const [simulatedDays, setSimulatedDays] = useState(0);
  const [simulatedScore, setSimulatedScore] = useState(0);
  const [simulatedStress, setSimulatedStress] = useState(0);

  useEffect(() => {
    const days = calculateRecoveryDays(subjects, hoursPerDay, studyDays);
    const score = calculateRecoveryScore(subjects, hoursPerDay, studyDays);
    const stress = calculateStressLevel(subjects, hoursPerDay);
    setSimulatedDays(days);
    setSimulatedScore(score);
    setSimulatedStress(stress);
  }, [hoursPerDay, subjects, studyDays]);

  const handleHoursChange = (newHours) => {
    setSelectedHours(newHours);
    setHoursPerDay(newHours);
    const days = calculateRecoveryDays(subjects, newHours, studyDays);
    const score = calculateRecoveryScore(subjects, newHours, studyDays);
    const stress = calculateStressLevel(subjects, newHours);
    setSimulatedDays(days);
    setSimulatedScore(score);
    setSimulatedStress(stress);
    onUpdate({ days, score, stress });
  };

  const getStressText = () => {
    if (simulatedStress < 30) return 'Low';
    if (simulatedStress < 70) return 'Medium';
    return 'High';
  };

  return (
    <div style={{ background: 'white', padding: '24px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2d3d', margin: '0 0 10px 0' }}>What-If Simulator</h2>
      <div style={{ height: '1px', background: '#edf2fa', margin: '12px 0 20px' }}></div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '14px', color: '#6b7c93', marginBottom: '8px', display: 'block' }}>Hours per day</label>
        <select
          value={selectedHours}
          onChange={(e) => handleHoursChange(parseInt(e.target.value))}
          style={{ width: '100%', padding: '8px', border: '1px solid #cfd8e3', borderRadius: '8px', background: 'white' }}
        >
          {[1, 2, 3, 4, 5, 6].map(hour => (
            <option key={hour} value={hour}>{hour}</option>
          ))}
        </select>
      </div>
      <div style={{ fontSize: '16px', color: '#1f2d3d', marginBottom: '16px' }}>
        Recover in {simulatedDays || 0} days Stress level: {getStressText()}
      </div>
    </div>
  );
};

export default WhatIfSimulator;
