// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Home/Dashboard';
import InterviewPrep from './pages/InterviewPrep/InterviewPrep';
import InterviewSession from './pages/Interview/InterviewSession'; // Add this import
import SessionReview from './pages/Interview/SessionReview'; // Add this import
import { UserProvider } from './context/userContext';

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/interview-prep/:sessionId" element={<InterviewPrep/>}/>
            {/* Add these new routes */}
            <Route path="/interview/:sessionId" element={<InterviewSession />} />
            <Route path="/interview/:sessionId/review" element={<SessionReview/>}/>
          </Routes>
        </Router>

        <Toaster 
          position="top-center"
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </div>
    </UserProvider>
  );
}

export default App;