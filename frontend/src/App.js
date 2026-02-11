import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './components/LandingPage';
import RecoveryForm from './components/RecoveryForm';
import AcademicRecoveryDashboard from './components/AcademicRecoveryDashboard';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/input" element={<RecoveryForm />} />
          <Route path="/recovery" element={<AcademicRecoveryDashboard />} />
          <Route path="/dashboard/:userId" element={<Dashboard />} />
          <Route path="/dashboard/test" element={<Dashboard />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
