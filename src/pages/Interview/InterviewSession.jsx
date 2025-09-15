import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LuClock, LuCheck, LuArrowLeft, LuSave } from "react-icons/lu"; // Replaced LuCheckCircle with LuCheck
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const InterviewSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessionData = () => {
      try {
        // Load questions and session metadata from localStorage
        const storedQuestions = localStorage.getItem(`session-${sessionId}-questions`);
        const storedMetadata = localStorage.getItem(`session-${sessionId}`);
        
        if (!storedQuestions || !storedMetadata) {
          toast.error("Session data not found. Please start a new session.");
          navigate("/dashboard");
          return;
        }
        
        setQuestions(JSON.parse(storedQuestions));
        setSessionData(JSON.parse(storedMetadata));
        setTimeRemaining(JSON.parse(storedMetadata).duration * 60); // Convert minutes to seconds
        setLoading(false);
      } catch (error) {
        console.error("Error loading session data:", error);
        toast.error("Failed to load session data");
        navigate("/dashboard");
      }
    };
    
    loadSessionData();
  }, [sessionId, navigate]);

  useEffect(() => {
    // Timer countdown
    if (timeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isCompleted) {
      handleCompleteSession();
    }
  }, [timeRemaining, isCompleted]);

  const handleAnswerChange = (answer) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].answer = answer;
    setQuestions(updatedQuestions);
    
    // Auto-save answer
    localStorage.setItem(`session-${sessionId}-questions`, JSON.stringify(updatedQuestions));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleCompleteSession();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleCompleteSession = () => {
    setIsCompleted(true);
    
    // Calculate score based on answers
    const answeredCount = questions.filter(q => q.answer && q.answer.trim() !== "").length;
    const score = Math.min(100, Math.round((answeredCount / questions.length) * 100));
    
    // Update session status to completed
    const updatedMetadata = { 
      ...sessionData, 
      status: "completed", 
      completedAt: new Date().toISOString(),
      score: score
    };
    
    localStorage.setItem(`session-${sessionId}`, JSON.stringify(updatedMetadata));
    
    // Save answers for review
    const answers = questions.reduce((acc, q) => {
      acc[q.id] = q.answer || "";
      return acc;
    }, {});
    
    localStorage.setItem(`session-${sessionId}-answers`, JSON.stringify(answers));
    
    toast.success("Interview session completed!");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isCompleted) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <LuCheck className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Interview Completed!</h1>
            <p className="text-gray-600 mb-6">
              You've completed the {sessionData.title} interview session.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Questions Answered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {questions.filter(q => q.answer && q.answer.trim() !== "").length}/{questions.length}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatTime(sessionData.duration * 60 - timeRemaining)}
                </p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => navigate(`/interview/${sessionId}/review`)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Review Answers
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
            >
              <LuArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{sessionData.title}</h1>
            <p className="text-gray-600">{sessionData.description}</p>
          </div>
          
          <div className="flex items-center gap-4 bg-red-100 text-red-800 px-4 py-2 rounded-lg">
            <LuClock className="w-5 h-5" />
            <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {questions[currentQuestionIndex].question}
          </h2>
          
          <div className="mb-6">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer
            </label>
            <textarea
              id="answer"
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your answer here..."
              value={questions[currentQuestionIndex].answer || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <LuSave className="w-4 h-4" />
              Auto-saved
            </div>
            
            <button
              onClick={handleNextQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Complete Session' : 'Next Question'}
            </button>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Questions</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`h-10 rounded-lg flex items-center justify-center ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : question.answer && question.answer.trim() !== ""
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewSession;