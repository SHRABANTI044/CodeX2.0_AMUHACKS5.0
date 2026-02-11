import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RecoveryForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [semester, setSemester] = useState('');
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Mathematics', difficulty: 'Medium', completion: 40 },
    { id: 2, name: 'Physics', difficulty: 'Hard', completion: 20 },
    { id: 3, name: 'History', difficulty: 'Easy', completion: 50 }
  ]);
  const [hoursPerDay, setHoursPerDay] = useState(1);
  const [studyDays, setStudyDays] = useState(1);
  const [learningPace, setLearningPace] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [editingSubject, setEditingSubject] = useState(null);

  const addSubject = () => {
    if (newSubjectName.trim()) {
      setSubjects([...subjects, { id: Date.now(), name: newSubjectName, difficulty: 'Easy', completion: 0 }]);
      setNewSubjectName('');
    }
  };

  const removeSubject = (id) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  const updateSubject = (id, field, value) => {
    const updatedSubjects = subjects.map((subject) =>
      subject.id === id ? { ...subject, [field]: value } : subject
    );
    setSubjects(updatedSubjects);
  };

  const handleGeneratePlan = () => {
    // Calculations
    const difficultyWeights = { Easy: 1, Medium: 1.5, Hard: 2 };
    const paceMultipliers = { Slow: 0.8, Medium: 1.0, Fast: 1.2 };

    let totalWork = 0;
    subjects.forEach(sub => {
      const remaining = 100 - sub.completion;
      const weight = difficultyWeights[sub.difficulty];
      totalWork += remaining * weight;
    });

    const dailyCapacity = (hoursPerDay * studyDays / 7) * paceMultipliers[learningPace];
    const recoveryDays = Math.ceil(totalWork / dailyCapacity);
    const recoveryScore = Math.max(0, Math.min(100, 100 - (totalWork / (subjects.length * 100 * 2)) * 100));
    const stressScore = (totalWork / (hoursPerDay * studyDays)) * 10;
    const stressLevel = stressScore <= 3 ? 'Low' : stressScore <= 6 ? 'Medium' : 'High';

    const userData = {
      name,
      semester,
      subjects: subjects.map(sub => ({
        subjectName: sub.name,
        difficulty: sub.difficulty,
        completionPercentage: sub.completion
      })),
      hoursPerDay,
      studyDays,
      learningPace,
      totalWork,
      dailyCapacity,
      recoveryDays,
      recoveryScore,
      stressLevel
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    navigate('/recovery');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const CalendarIcon = () => (
    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Personalize Your Recovery Plan</h1>
          <p className="text-gray-600">Share your current study details below. We’ll build a personalized recovery plan to help you catch up without stress.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - 60% */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">General Information</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester/Class</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Semester</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </select>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Subject Backlogs</h3>
              <div className="grid grid-cols-3 gap-4 mb-4 text-sm font-medium text-gray-700">
                <div>Subject Name</div>
                <div>Difficulty</div>
                <div>Completion</div>
              </div>
              <div className="h-56 overflow-y-auto overflow-x-hidden border border-gray-200 rounded-lg p-4">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center gap-4 mb-4">
                    <div className={`w-4 h-4 rounded ${getDifficultyColor(subject.difficulty)}`}></div>
                    <input
                      type="text"
                      value={subject.name}
                      onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Subject name"
                    />
                    <select
                      value={subject.difficulty}
                      onChange={(e) => updateSubject(subject.id, 'difficulty', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{subject.completion}%</span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full relative">
                        <div
                          className="h-2 bg-blue-500 rounded-full absolute left-0 top-0"
                          style={{ width: `${subject.completion}%` }}
                        ></div>
                        <div
                          className="h-2 bg-blue-200 rounded-full absolute right-0 top-0"
                          style={{ width: `${100 - subject.completion}%` }}
                        ></div>
                      </div>
                      <CalendarIcon />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={subject.completion}
                      onChange={(e) => updateSubject(subject.id, 'completion', parseInt(e.target.value))}
                      className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <button
                      onClick={() => removeSubject(subject.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-2">
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                  placeholder="Enter subject name"
                />
                <button
                  onClick={addSubject}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  + Add Subject
                </button>
              </div>
            </div>
          </div>
          {/* Right Column - 40% */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Subject Backlogs</h3>
              <div className="space-y-3">
                {subjects.map((subject) => (
                  <div key={subject.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${getDifficultyColor(subject.difficulty)}`}></div>
                    <span className="flex-1 text-sm">{subject.name}</span>
                    <span className="text-xs">{subject.difficulty}</span>
                    <div className="w-12 h-1 bg-gray-200 rounded-full relative">
                      <div
                        className="h-1 bg-blue-500 rounded-full absolute left-0 top-0"
                        style={{ width: `${subject.completion}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{subject.completion}%</span>
                    <CalendarIcon />
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Time Availability</h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Hours available per day</span>
                  <span className="text-sm">{hoursPerDay}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Study days per week</span>
                  <span className="text-sm">{studyDays}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={studyDays}
                  onChange={(e) => setStudyDays(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Pace</h3>
              <div className="flex space-x-2">
                {['Slow', 'Medium', 'Fast'].map((pace) => (
                  <button
                    key={pace}
                    onClick={() => setLearningPace(pace)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      learningPace === pace
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200'
                    }`}
                  >
                    {pace}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Recovery Plan'}
          </button>
          {loading && <div className="mt-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div></div>}
          {plan && <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">{plan}</div>}
        </div>
      </div>
    </div>
  );
};

export default RecoveryForm;
