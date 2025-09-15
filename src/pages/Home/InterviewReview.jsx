import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  LuTrophy, 
  LuClock, 
  LuBrain, 
  LuCheck, 
  LuX, 
  LuArrowLeft,
  LuTarget,
  LuBookOpen,
  LuChevronDown,
  LuChevronUp
} from 'react-icons/lu';
import DashboardLayout from '../../components/layouts/DashboardLayout';

const InterviewReview = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  
  // Get data from localStorage if not passed via navigation
  useEffect(() => {
    const loadSessionData = () => {
      try {
        setLoading(true);
        
        // Try to get data from navigation state first
        if (location.state?.userAnswers && location.state?.questions) {
          setUserAnswers(location.state.userAnswers);
          setScore(location.state.score || 0);
          setQuestions(location.state.questions);
          setSessionData(location.state.sessionData || null);
          setLoading(false);
          return;
        }
        
        // If not in navigation state, try to get from localStorage
        const storedAnswers = localStorage.getItem(`session-${sessionId}-answers`);
        const storedQuestions = localStorage.getItem(`session-${sessionId}-questions`);
        const storedMetadata = localStorage.getItem(`session-${sessionId}-metadata`);
        
        if (storedAnswers) setUserAnswers(JSON.parse(storedAnswers));
        if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
        if (storedMetadata) setSessionData(JSON.parse(storedMetadata));
        
        // Calculate score if not provided
        if (!location.state?.score && storedQuestions && storedAnswers) {
          const questions = JSON.parse(storedQuestions);
          const answers = JSON.parse(storedAnswers);
          calculateScore(questions, answers);
        }
        
      } catch (error) {
        console.error("Error loading session data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSessionData();
  }, [sessionId, location.state]);

  // Calculate score based on answers
  const calculateScore = (questions, answers) => {
    if (!questions || !answers) return 0;
    
    let totalScore = 0;
    let answeredCount = 0;
    
    Object.keys(answers).forEach(questionId => {
      if (answers[questionId] && answers[questionId].trim() !== '') {
        answeredCount++;
        // Simple scoring - give points for answering
        totalScore += 70; // Base points for answering
        
        // Bonus points for longer answers
        const answerLength = answers[questionId].length;
        if (answerLength > 100) totalScore += 15;
        if (answerLength > 200) totalScore += 15;
      }
    });
    
    const finalScore = answeredCount > 0 
      ? Math.min(100, Math.round(totalScore / answeredCount)) 
      : 0;
    
    setScore(finalScore);
    return finalScore;
  };

  const toggleQuestionExpanded = (questionId) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent performance! You\'re well-prepared.';
    if (score >= 60) return 'Good job! Keep practicing to improve further.';
    return 'Keep learning and practicing. You\'ll improve with time!';
  };

  // Simulate AI feedback generation
  const generateFeedback = (question, userAnswer) => {
    if (!userAnswer || userAnswer.trim() === '') {
      return {
        score: 0,
        feedback: "No answer provided. Consider reviewing this topic and practicing similar questions.",
        strengths: [],
        improvements: ["Provide a complete answer", "Include relevant examples", "Explain key concepts"]
      };
    }

    // Simple feedback generation (in real app, this would use AI)
    const answerLength = userAnswer.length;
    const hasExamples = userAnswer.toLowerCase().includes('example') || userAnswer.toLowerCase().includes('for instance');
    const hasKeywords = question.expectedPoints?.some(point => 
      userAnswer.toLowerCase().includes(point.toLowerCase())
    ) || false;

    let score = 0;
    const strengths = [];
    const improvements = [];

    if (answerLength > 50) {
      score += 30;
      strengths.push("Provided detailed explanation");
    } else {
      improvements.push("Provide more detailed explanations");
    }

    if (hasExamples) {
      score += 25;
      strengths.push("Included practical examples");
    } else {
      improvements.push("Include practical examples to illustrate concepts");
    }

    if (hasKeywords) {
      score += 35;
      strengths.push("Covered key technical concepts");
    } else {
      improvements.push("Address more core concepts related to the question");
    }

    if (answerLength > 200) {
      score += 10;
      strengths.push("Comprehensive answer");
    }

    const feedbackMessages = [
      "Your answer demonstrates good understanding of the concepts.",
      "Consider expanding on certain points for a more complete response.",
      "Good technical knowledge shown in your response.",
      "Try to structure your answer more clearly with key points."
    ];

    return {
      score: Math.min(score, 100),
      feedback: feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)],
      strengths,
      improvements
    };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading review data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!userAnswers || !questions || questions.length === 0) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Interview review not available</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const answeredQuestions = Object.keys(userAnswers).length;
  const completionRate = (answeredQuestions / questions.length) * 100;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LuArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Interview Review</h1>
                  <p className="text-gray-600">Session #{sessionId} • Results & Feedback</p>
                  {sessionData && (
                    <p className="text-sm text-gray-500 mt-1">{sessionData.title}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overall Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(score).split(' ')[0]}`}>
                    {score}%
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${getScoreColor(score)}`}>
                  <LuTrophy className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{getScoreMessage(score)}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Questions Answered</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {answeredQuestions}/{questions.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <LuBrain className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {completionRate.toFixed(0)}% completion rate
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Time Efficiency</p>
                  <p className="text-3xl font-bold text-gray-900">Good</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <LuClock className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Managed time well</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Areas to Focus</p>
                  <p className="text-3xl font-bold text-gray-900">3</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <LuTarget className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Key improvement areas</p>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <LuBookOpen className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Question-by-Question Review</h2>
              </div>
              <p className="text-gray-600 mt-1">Detailed feedback on each question</p>
            </div>

            <div className="divide-y divide-gray-200">
              {questions.map((question, index) => {
                const userAnswer = userAnswers[question.id] || '';
                const feedback = generateFeedback(question, userAnswer);
                const isExpanded = expandedQuestions.has(question.id);

                return (
                  <div key={question.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <h3 className="text-lg font-medium text-gray-900 pr-4">
                            {question.question}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 ml-11">
                          <span className="capitalize">Difficulty: {question.difficulty || 'Medium'}</span>
                          <div className="flex items-center gap-1">
                            <span>Score:</span>
                            <span className={`font-semibold ${
                              feedback.score >= 70 ? 'text-green-600' : 
                              feedback.score >= 40 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {feedback.score}/100
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleQuestionExpanded(question.id)}
                        className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <LuChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <LuChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="ml-11 space-y-6">
                        {/* User's Answer */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Your Answer:</h4>
                          <div className="bg-gray-50 rounded-lg p-4 border">
                            {userAnswer ? (
                              <p className="text-gray-700 whitespace-pre-wrap">{userAnswer}</p>
                            ) : (
                              <p className="text-gray-500 italic">No answer provided</p>
                            )}
                          </div>
                        </div>

                        {/* AI Feedback */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">AI Feedback:</h4>
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-gray-700 mb-3">{feedback.feedback}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Strengths */}
                              {feedback.strengths.length > 0 && (
                                <div>
                                  <h5 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                                    <LuCheck className="w-4 h-4" />
                                    Strengths
                                  </h5>
                                  <ul className="space-y-1">
                                    {feedback.strengths.map((strength, idx) => (
                                      <li key={idx} className="text-sm text-green-600 flex items-start gap-1">
                                        <span className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                                        {strength}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Areas for Improvement */}
                              {feedback.improvements.length > 0 && (
                                <div>
                                  <h5 className="text-sm font-medium text-yellow-700 mb-2 flex items-center gap-1">
                                    <LuTarget className="w-4 h-4" />
                                    Areas for Improvement
                                  </h5>
                                  <ul className="space-y-1">
                                    {feedback.improvements.map((improvement, idx) => (
                                      <li key={idx} className="text-sm text-yellow-600 flex items-start gap-1">
                                        <span className="w-1 h-1 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                                        {improvement}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expected Key Points */}
                        {question.expectedPoints && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Topics to Cover:</h4>
                            <div className="flex flex-wrap gap-2">
                              {question.expectedPoints.map((point, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                >
                                  {point}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Start New Practice Session
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewReview;