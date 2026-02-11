const difficultyWeights = { Easy: 1, Medium: 1.5, Hard: 2 };
const paceMultipliers = { Slow: 1.2, Medium: 1, Fast: 0.8 };
const baseHoursPerSubject = 10;

function calculateSubjectRequiredHours(subject) {
  const remainingPercent = (100 - subject.completion) / 100;
  const weight = difficultyWeights[subject.difficulty] || 1;
  return remainingPercent * baseHoursPerSubject * weight;
}

function calculateTotalRequiredHours(subjects) {
  return subjects.reduce((total, subject) => total + calculateSubjectRequiredHours(subject), 0);
}

function calculateWeeklyCapacity(hoursPerDay, studyDays) {
  return hoursPerDay * studyDays;
}

function calculateRecoveryDays(subjects, hoursPerDay, studyDays, learningPace) {
  if (!subjects || subjects.length === 0) return 0;

  const totalRequiredHours = calculateTotalRequiredHours(subjects);
  const paceMultiplier = paceMultipliers[learningPace] || 1;
  const adjustedRequiredHours = totalRequiredHours * paceMultiplier;

  const weeklyCapacity = calculateWeeklyCapacity(hoursPerDay, studyDays);
  if (weeklyCapacity === 0) return 0;

  const weeksNeeded = adjustedRequiredHours / weeklyCapacity;
  const daysNeeded = weeksNeeded * 7;

  return Math.ceil(daysNeeded);
}

function calculateRecoveryScore(subjects, hoursPerDay, studyDays) {
  if (!subjects || subjects.length === 0) return 0;

  const totalRequiredHours = calculateTotalRequiredHours(subjects);
  const weeklyCapacity = calculateWeeklyCapacity(hoursPerDay, studyDays);

  if (totalRequiredHours === 0) return 100;

  const score = (weeklyCapacity / totalRequiredHours) * 100;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateStressLevel(subjects, hoursPerDay) {
  if (!subjects || subjects.length === 0) return 0;

  const avgDifficulty = subjects.reduce((sum, sub) => sum + difficultyWeights[sub.difficulty], 0) / subjects.length;
  const avgRemaining = subjects.reduce((sum, sub) => sum + ((100 - sub.completion) / 100), 0) / subjects.length;

  const stressScore = (avgDifficulty * avgRemaining * 100) / hoursPerDay;

  return Math.max(0, Math.min(100, stressScore));
}

function generateTodaysStudyPlan(subjects, hoursPerDay) {
  const totalRequiredHours = calculateTotalRequiredHours(subjects);

  return subjects.map(subject => {
    const subjectRequiredHours = calculateSubjectRequiredHours(subject);
    const subjectShare = totalRequiredHours > 0 ? subjectRequiredHours / totalRequiredHours : 0;
    const todayStudyTime = subjectShare * hoursPerDay;

    return {
      subjectName: subject.name,
      studyTime: Math.max(0.5, Math.round(todayStudyTime * 2) / 2), // Round to nearest 0.5, minimum 0.5
      difficulty: subject.difficulty,
      completion: subject.completion
    };
  }).filter(plan => plan.studyTime > 0);
}

function calculateUrgencyScore(subject) {
  const daysLeft = subject.deadline ? Math.ceil((new Date(subject.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : 7;
  return (difficultyWeights[subject.difficulty] * (100 - subject.completion)) / Math.max(daysLeft, 1);
}

function calculateRiskLevel(subject) {
  const daysLeft = subject.deadline ? Math.ceil((new Date(subject.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : 7;
  if (daysLeft < 3 && subject.completion < 50) return 'High';
  if (daysLeft < 7 && subject.completion < 70) return 'Medium';
  return 'Low';
}

function generateSchedule(user) {
  // Sort subjects: Hard first, then by low completion
  const diffOrder = { Hard: 0, Medium: 1, Easy: 2 };
  const sortedSubjects = user.subjects.sort((a, b) => {
    if (a.difficulty === b.difficulty) return a.completion - b.completion;
    return diffOrder[a.difficulty] - diffOrder[b.difficulty];
  });

  // Use new calculation functions
  const recoveryScore = calculateRecoveryScore(user.subjects, user.hoursPerDay, user.studyDays);
  const days = calculateRecoveryDays(user.subjects, user.hoursPerDay, user.studyDays, user.learningPace);
  const stress = calculateStressLevel(user.subjects, user.hoursPerDay);
  const dailySchedule = generateTodaysStudyPlan(user.subjects, user.hoursPerDay);

  return {
    priorityOrder: sortedSubjects.map(s => s.name),
    dailySchedule,
    recoveryScore,
    days,
    stress,
    overallRisk: sortedSubjects.some(s => calculateRiskLevel(s) === 'High') ? 'High' :
                 sortedSubjects.some(s => calculateRiskLevel(s) === 'Medium') ? 'Medium' : 'Low'
  };
}

module.exports = { generateSchedule };
