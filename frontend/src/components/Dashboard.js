import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, updateProgress } from '../api';

// Safe calculation functions
const difficultyWeights = { Easy: 1, Medium: 1.5, Hard: 2 };

const calculateSubjectRequiredHours = (subject) => {
  const remaining = 100 - (subject.completionPercentage || 0);
  const difficultyWeight = difficultyWeights[subject.difficulty] || 1;
  return (remaining / 100) * 10 * difficultyWeight;
};

const calculateTotalRequiredHours = (subjects) => {
  if (!subjects || subjects.length === 0) return 0;
  return subjects.reduce((total, subject) => total + calculateSubjectRequiredHours(subject), 0);
};

const calculateWeeklyCapacity = (hoursPerDay, studyDays) => {
  const safeHours = hoursPerDay || 0;
  const safeDays = studyDays || 0;
  return safeHours * safeDays;
};

const calculateRecoveryDays = (subjects, hoursPerDay, studyDays) => {
  const totalRequired = calculateTotalRequiredHours(subjects);
  const weeklyCapacity = calculateWeeklyCapacity(hoursPerDay, studyDays);
  if (weeklyCapacity === 0) return 0;
  const daysNeeded = (totalRequired / weeklyCapacity) * 7;
  return Math.ceil(daysNeeded);
};

const calculateRecoveryScore = (subjects, hoursPerDay, studyDays) => {
  const totalRequired = calculateTotalRequiredHours(subjects);
  const weeklyCapacity = calculateWeeklyCapacity(hoursPerDay, studyDays);
  if (totalRequired === 0) return 0;
  const score = (weeklyCapacity / totalRequired) * 100;
  return Math.max(0, Math.min(100, Math.round(score)));
};

const calculateStressLevel = (subjects, hoursPerDay) => {
  if (!subjects || subjects.length === 0) return 0;
  const avgDifficulty = subjects.reduce((sum, sub) => sum + difficultyWeights[sub.difficulty], 0) / subjects.length;
  const avgRemaining = subjects.reduce((sum, sub) => sum + ((100 - (sub.completionPercentage || 0)) / 100), 0) / subjects.length;
  const stressScore = (avgDifficulty * avgRemaining * 100) / (hoursPerDay || 1);
  return Math.max(0, Math.min(100, stressScore));
};

const calculateTodaysStudyPlan = (subjects, hoursPerDay) => {
  if (!subjects || subjects.length === 0) return [];
  const safeHours = hoursPerDay || 0;

  // Sort subjects: Hard first, then by completion (lower first)
  const sortedSubjects = [...subjects].sort((a, b) => {
    const diffOrder = { Hard: 0, Medium: 1, Easy: 2 };
    if (a.difficulty !== b.difficulty) {
      return diffOrder[a.difficulty] - diffOrder[b.difficulty];
    }
    return (a.completionPercentage || 0) - (b.completionPercentage || 0);
  });

  // Calculate total weight
  const totalWeight = sortedSubjects.reduce((sum, subject) => {
    const weight = difficultyWeights[subject.difficulty] * (1 - (subject.completionPercentage || 0) / 100);
    return sum + weight;
  }, 0);

  // Allocate hours based on weight
  const plan = sortedSubjects.map(subject => {
    const weight = difficultyWeights[subject.difficulty] * (1 - (subject.completionPercentage || 0) / 100);
    const hours = totalWeight > 0 ? (weight / totalWeight) * safeHours : 0;
    return {
      name: subject.subjectName,
      hours: Math.max(0.25, hours),
      color: subject.difficulty === 'Hard' ? '#ef4444' : subject.difficulty === 'Medium' ? '#f59e0b' : '#10b981'
    };
  });

  return plan;
};

const Dashboard = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [studyDays, setStudyDays] = useState(5);
  const [daysNeeded, setDaysNeeded] = useState(0);
  const [recoveryScore, setRecoveryScore] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [todaysPlan, setTodaysPlan] = useState([]);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId === 'test') {
          // Load from localStorage for test/demo mode
          const data = JSON.parse(localStorage.getItem('userData'));
          if (data) {
            console.log('User data loaded from localStorage:', data);
            setUserData(data);
            setHoursPerDay(data.hoursPerDay || 3);
            setStudyDays(data.studyDays || 5);
          } else {
            setError('No user data found in localStorage. Please complete the form first.');
          }
          setLoading(false);
          return;
        }

        console.log('Fetching user data for userId:', userId);
        // Add timeout to API call
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('User data received:', data);
        setUserData(data);
        setHoursPerDay(data.dailyStudyHours || 3);
        setStudyDays(5); // Default study days, could be configurable
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (err.name === 'AbortError') {
          setError('Request timed out. Please check if the backend server is running.');
        } else {
          setError(`Failed to load user data: ${err.message}`);
        }
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    } else {
      console.log('No userId provided');
      setError('No user ID provided');
      setLoading(false);
    }
  }, [userId]);

  // Update calculations when data changes
  useEffect(() => {
    if (userData && userData.subjects) {
      const days = calculateRecoveryDays(userData.subjects, hoursPerDay, studyDays);
      const score = calculateRecoveryScore(userData.subjects, hoursPerDay, studyDays);
      const stress = calculateStressLevel(userData.subjects, hoursPerDay);
      const plan = calculateTodaysStudyPlan(userData.subjects, hoursPerDay);
      setDaysNeeded(days);
      setRecoveryScore(score);
      setStressLevel(stress);
      setTodaysPlan(plan);
    }
  }, [userData, hoursPerDay, studyDays]);

  const handleProgressUpdate = async (subjectId, newCompletion) => {
    try {
      await updateProgress(userId, subjectId, newCompletion);
      // Refresh user data after update
      const updatedData = await getUser(userId);
      setUserData(updatedData);
    } catch (err) {
      setError('Failed to update progress');
    }
  };

  const getScoreText = () => {
    if (recoveryScore >= 70) return 'Good';
    if (recoveryScore >= 40) return 'Moderate';
    return 'Poor';
  };

  const getGaugeColor = () => {
    if (recoveryScore >= 70) return '#10b981';
    if (recoveryScore >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7c93';
    }
  };

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getStressText = () => {
    if (stressLevel < 30) return 'Low';
    if (stressLevel < 70) return 'Medium';
    return 'High';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  const totalHours = todaysPlan.reduce((sum, item) => sum + item.hours, 0);

  return (
    <div style={{ background: 'linear-gradient(135deg, #eaf3ff, #d6e6fb)', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: 'auto', padding: '40px 24px' }}>
        {/* Top Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 600, color: '#1f2d3d', margin: 0 }}>
              Welcome Back, {userData?.name || 'User'}
            </h1>
            <p style={{ fontSize: '15px', color: '#6b7c93', margin: '8px 0 0 0' }}>
              Here's your personalized recovery plan to catch up on your studies.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => navigate('/input')}
              style={{ background: 'white', border: '1px solid #dce6f5', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer' }}
            >
              Personalize Again
            </button>
            <button
              onClick={() => navigate('/')}
              style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer' }}
            >
              Exit
            </button>
          </div>
        </div>

        {/* Main Grid Structure */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column */}
          <div>
            {/* CARD 1 – RECOVERY SCORE */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2d3d', margin: '0 0 10px 0' }}>Recovery Score</h2>
              <div style={{ height: '1px', background: '#edf2fa', margin: '12px 0 20px' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
                  <div style={{ width: '120px', height: '60px', borderRadius: '60px 60px 0 0', background: '#e5e7eb', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: getGaugeColor(), width: `${recoveryScore}%`, transition: 'width 0.3s' }}></div>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px', color: getGaugeColor() }}>{Math.round(recoveryScore)}%</div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7c93', marginBottom: '8px' }}>Score: {getScoreText()}</div>
                  <div style={{ fontSize: '14px', color: '#6b7c93' }}>Recover in {daysNeeded} days if you follow this plan.</div>
                </div>
              </div>
            </div>

            {/* CARD 2 – TODAY'S STUDY PLAN */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2d3d', margin: '0 0 10px 0' }}>Today's Study Plan</h2>
              <div style={{ height: '1px', background: '#edf2fa', margin: '12px 0 20px' }}></div>
              {todaysPlan.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: index < todaysPlan.length - 1 ? '1px solid #f0f4fb' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: '12px', height: '12px', background: item.color, marginRight: '8px', borderRadius: '2px' }}></div>
                    <div style={{ fontSize: '14px', color: '#1f2d3d' }}>{item.name}</div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7c93' }}>{formatTime(item.hours)} ⏰</div>
                </div>
              ))}
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#6b7c93', marginTop: '8px' }}>Based on backlog</div>
              <div style={{ fontWeight: 'bold', marginTop: '16px', textAlign: 'center', fontSize: '14px', color: '#1f2d3d' }}>Total: {formatTime(totalHours)} per day</div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* CARD 1 – PROGRESS TRACKER */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2d3d', margin: '0 0 10px 0' }}>Progress Tracker</h2>
              <div style={{ height: '1px', background: '#edf2fa', margin: '12px 0 20px' }}></div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7c93', marginBottom: '8px' }}>Days Left</div>
                <div style={{ height: '10px', background: '#eaf1fb', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ height: '100%', background: '#4f8cff', width: `${Math.min(recoveryScore, 100)}%`, transition: 'width 0.3s' }}></div>
                </div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2d3d', textAlign: 'right' }}>{daysNeeded}</div>
              </div>
              <div style={{ fontSize: '14px', color: '#6b7c93' }}>Study hours — {studyDays} Days</div>
            </div>

            {/* CARD 2 – SUBJECT BACKLOGS */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2d3d', margin: '0 0 10px 0' }}>Subject Backlogs</h2>
              <div style={{ height: '1px', background: '#edf2fa', margin: '12px 0 20px' }}></div>
              {userData?.subjects?.map((subject, index) => (
                <div key={index} style={{ background: '#f7faff', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2d3d', marginBottom: '4px' }}>{subject.subjectName}</div>
                      <span style={{ fontSize: '12px', color: getDifficultyColor(subject.difficulty), background: 'white', padding: '2px 8px', borderRadius: '10px' }}>{subject.difficulty}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: '#6b7c93', marginBottom: '4px' }}>{subject.completionPercentage || 0}%</div>
                      <div style={{ width: '60px', height: '4px', background: '#e6edf7', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#4f8cff', width: `${subject.completionPercentage || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CARD 3 – WHAT-IF SIMULATOR */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2d3d', margin: '0 0 10px 0' }}>What-If Simulator</h2>
              <div style={{ height: '1px', background: '#edf2fa', margin: '12px 0 20px' }}></div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', color: '#6b7c93', marginBottom: '8px', display: 'block' }}>Hours per day</label>
                <select
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px', border: '1px solid #cfd8e3', borderRadius: '8px', background: 'white' }}
                >
                  {[1, 2, 3, 4, 5, 6].map(hour => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
              </div>
              <div style={{ fontSize: '16px', color: '#1f2d3d' }}>
                Recover in {daysNeeded} days. Stress level: {getStressText()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
