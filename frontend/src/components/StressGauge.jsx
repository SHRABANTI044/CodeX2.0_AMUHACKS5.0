import React from 'react';
import { calculateStressLevel } from '../utils/calculations';

const StressGauge = ({ subjects, hoursPerDay }) => {
  const stress = calculateStressLevel(subjects, hoursPerDay);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
      <h4 className="font-bold text-lg mb-2">Stress Level</h4>
      <div className="relative w-32 h-16">
        <svg viewBox="0 0 64 32" className="w-full h-full">
          <path d="M8 28 Q32 0 56 28" fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <path d="M8 28 Q32 0 56 28" fill="none" stroke="#f87171" strokeWidth="6" strokeDasharray="48" strokeDashoffset={48 - (stress / 100) * 48} />
          <circle cx={8 + (stress / 100) * 48} cy={28 - (stress / 100) * 28} r="4" fill="#f87171" />
        </svg>
        <div className="absolute left-0 right-0 bottom-0 flex justify-between text-xs text-gray-400">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
      <div className="text-sm text-gray-500 mt-1">{stress < 33 ? 'Low' : stress < 66 ? 'Medium' : 'High'}</div>
    </div>
  );
};

export default StressGauge;
