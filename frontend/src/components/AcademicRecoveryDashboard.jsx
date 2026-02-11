import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AcademicRecoveryDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('userData'));
    if (data) {
      setUserData(data);
    } else {
      // If no data, redirect to form
      navigate('/input');
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Found</h2>
          <button
            onClick={() => navigate('/input')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Go to Form
          </button>
        </div>
      </div>
    );
  }

  const { name, semester, subjects, hoursPerDay, studyDays, learningPace } = userData;

  // Calculations
  const totalSubjects = subjects.length;
  const highDifficulty = subjects.filter(s => s.difficulty === 'Hard').length;
  const mediumDifficulty = subjects.filter(s => s.difficulty === 'Medium').length;
  const easyDifficulty = subjects.filter(s => s.difficulty === 'Easy').length;
  const weeklyHours = hoursPerDay * studyDays;

  // Smart Study Distribution Plan
  const difficultyWeights = { Easy: 1, Medium: 1.5, Hard: 2 };
  const paceMultipliers = { Slow: 0.8, Medium: 1.0, Fast: 1.2 };

  const totalWeight = subjects.reduce((sum, sub) => {
    const remaining = 100 - (sub.completionPercentage || 0);
    return sum + (remaining / 100) * difficultyWeights[sub.difficulty];
  }, 0);

  const studyDistribution = subjects.map(sub => {
    const remaining = 100 - (sub.completionPercentage || 0);
    const weight = (remaining / 100) * difficultyWeights[sub.difficulty];
    const hoursPerWeek = totalWeight > 0 ? (weight / totalWeight) * weeklyHours * paceMultipliers[learningPace] : 0;
    return {
      ...sub,
      hoursPerWeek: Math.max(0.5, hoursPerWeek),
      priority: sub.difficulty === 'Hard' ? 'High 🔴' : sub.difficulty === 'Medium' ? 'Medium 🟡' : 'Low 🟢'
    };
  }).sort((a, b) => difficultyWeights[b.difficulty] - difficultyWeights[a.difficulty]);

  // Weekly Timetable
  const generateWeeklyTimetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timetable = {};

    days.forEach((day, index) => {
      if (index < studyDays) {
        // Study days
        const daySubjects = studyDistribution.slice(0, Math.min(2, studyDistribution.length));
        timetable[day] = daySubjects.map(sub => `${sub.subjectName} (${Math.round(sub.hoursPerWeek / studyDays * 10) / 10}h)`).join(' + ');
      } else if (index === studyDays) {
        timetable[day] = 'Revision Day';
      } else if (index === 6) {
        timetable[day] = 'Rest / Light Review';
      } else {
        timetable[day] = 'Mock Test / Practice';
      }
    });

    return timetable;
  };

  const weeklyTimetable = generateWeeklyTimetable();

  // Progress Tracking
  const totalCompletion = subjects.reduce((sum, sub) => sum + (sub.completionPercentage || 0), 0) / subjects.length;
  const estimatedWeeks = Math.ceil((100 - totalCompletion) / (weeklyHours * 7 / 100));

  // Smart Suggestions
  const getSmartSuggestions = () => {
    const suggestions = [];
    subjects.forEach(sub => {
      if (sub.difficulty === 'Hard') {
        suggestions.push(`For ${sub.subjectName}: Practice 10 problems daily, watch 1 concept video, take weekly mock tests`);
      } else if (sub.difficulty === 'Medium') {
        suggestions.push(`For ${sub.subjectName}: Focus on understanding core concepts, practice 5-7 problems daily`);
      } else {
        suggestions.push(`For ${sub.subjectName}: Quick revision sessions, focus on weak areas`);
      }
    });
    return suggestions;
  };

  const smartSuggestions = getSmartSuggestions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        {/* 1. Welcome Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Hello, {name} 👋
          </h1>
          <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
            <span>Semester: {semester}th Semester</span>
            <span>•</span>
            <span>Learning Pace: {learningPace}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* 2. Backlog Analysis */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                📊 Backlog Analysis
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalSubjects}</div>
                  <div className="text-xs text-gray-600">Total Subjects</div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-red-600">⚠️ Hard</span>
                    <span className="font-bold">{highDifficulty}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-yellow-600">✅ Medium</span>
                    <span className="font-bold">{mediumDifficulty}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-600">🟢 Easy</span>
                    <span className="font-bold">{easyDifficulty}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {subjects.map((subject, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="truncate">{subject.subjectName}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      subject.difficulty === 'Hard' ? 'bg-red-100 text-red-800' :
                      subject.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {subject.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Time Analysis */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                ⏱️ Time Analysis
              </h3>
              <div className="text-center mb-3">
                <div className="text-3xl font-bold text-indigo-600">{weeklyHours}</div>
                <div className="text-sm text-gray-600">hours/week</div>
              </div>
              <div className="text-xs text-gray-500 text-center mb-2">
                {hoursPerDay}h × {studyDays} days
              </div>
              <div className="bg-indigo-50 p-2 rounded text-center">
                <div className="text-sm font-medium text-indigo-700">
                  {weeklyHours} productive hours/week! 📈
                </div>
              </div>
            </div>

            {/* 6. Daily Study Structure */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                🕐 Daily Structure
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">⏱️</div>
                  <span>45m Study</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">☕</div>
                  <span>10m Break</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs">📘</div>
                  <span>45m Study</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs">🔁</div>
                  <span>20m Revision</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-4">
            {/* 4. Smart Study Distribution */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                🎯 Study Distribution
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {studyDistribution.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium truncate flex-1">{item.subjectName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-indigo-600">
                        {Math.round(item.hoursPerWeek * 10) / 10}h
                      </span>
                      <span className="text-xs">{item.priority.split(' ')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Weekly Timetable */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                📅 Weekly Timetable
              </h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {Object.entries(weeklyTimetable).map(([day, schedule]) => (
                  <div key={day} className="flex justify-between items-center py-1 text-sm">
                    <span className="font-medium w-20">{day.slice(0, 3)}</span>
                    <span className="text-gray-600 truncate flex-1 ml-2">{schedule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Smart Suggestions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                💡 Smart Tips
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {smartSuggestions.slice(0, 3).map((suggestion, index) => (
                  <div key={index} className="text-xs text-gray-700 bg-blue-50 p-2 rounded border-l-2 border-blue-500">
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* 7. Progress Tracking */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                📊 Progress Tracking
              </h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {subjects.map((subject, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium truncate">{subject.subjectName}</span>
                      <span className="text-xs text-gray-600">{subject.completionPercentage || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          subject.difficulty === 'Hard' ? 'bg-red-500' :
                          subject.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${subject.completionPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 p-2 bg-green-50 rounded text-center">
                <div className="text-sm font-bold text-green-700">💪</div>
                <div className="text-xs text-gray-700">
                  Clear in {estimatedWeeks} weeks!
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center">
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => navigate('/input')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-200"
                >
                  Personalize Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-200"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicRecoveryDashboard;
