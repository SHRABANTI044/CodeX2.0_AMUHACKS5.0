const difficultyWeights = { Easy: 1, Medium: 1.5, Hard: 2 };

export const calculateSubjectRequiredHours = (subject) => {
  const remaining = 100 - (subject.completion || 0);
  const difficultyWeight = difficultyWeights[subject.difficulty] || 1;
  return (remaining / 100) * 10 * difficultyWeight;
};

export const calculateTotalRequiredHours = (subjects) => {
  if (!subjects || subjects.length === 0) return 0;
  return subjects.reduce((total, subject) => total + calculateSubjectRequiredHours(subject), 0);
};

export const calculateWeeklyCapacity = (hoursPerDay, studyDays) => {
  const safeHours = hoursPerDay || 0;
  const safeDays = studyDays || 0;
  return safeHours * safeDays;
};

export const calculateRecoveryDays = (subjects, hoursPerDay, studyDays) => {
  const totalRequired = calculateTotalRequiredHours(subjects);
  const weeklyCapacity = calculateWeeklyCapacity(hoursPerDay, studyDays);
  if (weeklyCapacity === 0) return 0;
  const daysNeeded = (totalRequired / weeklyCapacity) * 7;
  return Math.ceil(daysNeeded);
};

export const calculateRecoveryScore = (subjects, hoursPerDay, studyDays) => {
  const totalRequired = calculateTotalRequiredHours(subjects);
  const weeklyCapacity = calculateWeeklyCapacity(hoursPerDay, studyDays);
  if (totalRequired === 0) return 0;
  const score = (weeklyCapacity / totalRequired) * 100;
  return Math.max(0, Math.min(100, Math.round(score)));
};

export const calculateStressLevel = (subjects, hoursPerDay) => {
  if (!subjects || subjects.length === 0) return 0;
  const avgDifficulty = subjects.reduce((sum, sub) => sum + difficultyWeights[sub.difficulty], 0) / subjects.length;
  const avgRemaining = subjects.reduce((sum, sub) => sum + ((100 - (sub.completion || 0)) / 100), 0) / subjects.length;
  const stressScore = (avgDifficulty * avgRemaining * 100) / (hoursPerDay || 1);
  return Math.max(0, Math.min(100, stressScore));
};

export const calculateTodaysStudyPlan = (subjects, hoursPerDay) => {
  if (!subjects || subjects.length === 0) return [];
  const safeHours = hoursPerDay || 0;

  // Sort subjects: Hard first, then by completion (lower first)
  const sortedSubjects = [...subjects].sort((a, b) => {
    const diffOrder = { Hard: 0, Medium: 1, Easy: 2 };
    if (a.difficulty !== b.difficulty) {
      return diffOrder[a.difficulty] - diffOrder[b.difficulty];
    }
    return (a.completion || 0) - (b.completion || 0);
  });

  // Calculate total weight
  const totalWeight = sortedSubjects.reduce((sum, subject) => {
    const weight = difficultyWeights[subject.difficulty] * (1 - (subject.completion || 0) / 100);
    return sum + weight;
  }, 0);

  // Allocate hours based on weight
  const plan = sortedSubjects.map(subject => {
    const weight = difficultyWeights[subject.difficulty] * (1 - (subject.completion || 0) / 100);
    const hours = totalWeight > 0 ? (weight / totalWeight) * safeHours : 0;
    return {
      name: subject.name,
      hours: Math.max(0.25, hours),
      color: subject.difficulty === 'Hard' ? '#ef4444' : subject.difficulty === 'Medium' ? '#f59e0b' : '#10b981'
    };
  });

  return plan;
};
