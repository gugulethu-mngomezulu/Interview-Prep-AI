import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Code, 
  Brain, 
  Clock, 
  Trash2, 
  Play, 
  Calendar,
  Database,
  GitBranch,
  Server,
  Monitor,
  Layers,
  Zap,
  Loader,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Timer,
  Send,
  RotateCcw,
  FileText,
  Award
} from "lucide-react";

// Mock card background styles
const CARD_BG = [
  {
    gradient: "bg-gradient-to-br from-blue-50 to-indigo-100",
    shadowColor: "shadow-blue-200/50",
    hoverShadow: "hover:shadow-blue-300/50"
  },
  {
    gradient: "bg-gradient-to-br from-purple-50 to-pink-100",
    shadowColor: "shadow-purple-200/50",
    hoverShadow: "hover:shadow-purple-300/50"
  },
  {
    gradient: "bg-gradient-to-br from-emerald-50 to-teal-100",
    shadowColor: "shadow-emerald-200/50",
    hoverShadow: "hover:shadow-emerald-300/50"
  },
  {
    gradient: "bg-gradient-to-br from-orange-50 to-red-100",
    shadowColor: "shadow-orange-200/50",
    hoverShadow: "hover:shadow-orange-300/50"
  },
  {
    gradient: "bg-gradient-to-br from-yellow-50 to-amber-100",
    shadowColor: "shadow-yellow-200/50",
    hoverShadow: "hover:shadow-yellow-300/50"
  },
  {
    gradient: "bg-gradient-to-br from-gray-50 to-slate-100",
    shadowColor: "shadow-gray-200/50",
    hoverShadow: "hover:shadow-gray-300/50"
  }
];

// Interview Questions Modal Component
const InterviewQuestionsModal = ({ isOpen, onClose, session, questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeSpent, setTimeSpent] = useState({});
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");

  // Initialize session
  useEffect(() => {
    if (isOpen && questions.length > 0) {
      setSessionStartTime(Date.now());
      setQuestionStartTime(Date.now());
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTimeSpent({});
      setIsCompleted(false);
      setShowResults(false);
      setCurrentAnswer("");
    }
  }, [isOpen, questions]);

  // Update question start time when question changes
  useEffect(() => {
    if (isOpen && !isCompleted) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, isOpen]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (value) => {
    setCurrentAnswer(value);
  };

  const handleNextQuestion = () => {
    // Save current answer and time
    const questionTime = Date.now() - questionStartTime;
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: currentAnswer
    }));
    setTimeSpent(prev => ({
      ...prev,
      [currentQuestionIndex]: questionTime
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer(answers[currentQuestionIndex + 1] || "");
    } else {
      // Complete the interview
      setIsCompleted(true);
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setCurrentAnswer(answers[currentQuestionIndex - 1] || "");
    }
  };

  const handleSkipQuestion = () => {
    const questionTime = Date.now() - questionStartTime;
    setTimeSpent(prev => ({
      ...prev,
      [currentQuestionIndex]: questionTime
    }));
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer(answers[currentQuestionIndex + 1] || "");
    } else {
      setIsCompleted(true);
      setShowResults(true);
    }
  };

  const calculateResults = () => {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).filter(key => answers[key].trim()).length;
    const totalTime = Object.values(timeSpent).reduce((acc, time) => acc + time, 0);
    const avgTimePerQuestion = totalTime / totalQuestions;
    const completionRate = (answeredQuestions / totalQuestions) * 100;
    
    // Simple scoring based on completion rate and average time
    let score = completionRate;
    if (avgTimePerQuestion < 60000) score += 10; // Bonus for quick responses
    if (avgTimePerQuestion < 30000) score += 5;  // Extra bonus for very quick responses
    
    return {
      score: Math.min(100, Math.round(score)),
      totalQuestions,
      answeredQuestions,
      totalTime: Math.round(totalTime / 1000), // Convert to seconds
      avgTimePerQuestion: Math.round(avgTimePerQuestion / 1000),
      completionRate: Math.round(completionRate)
    };
  };

  const results = isCompleted ? calculateResults() : null;

  const resetInterview = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeSpent({});
    setIsCompleted(false);
    setShowResults(false);
    setCurrentAnswer("");
    setSessionStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{session?.title}</h2>
              <p className="text-gray-600 mt-1">
                {session?.category} • {session?.difficulty} Level
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {!showResults && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  {Math.round((Date.now() - sessionStartTime) / 1000)}s elapsed
                </span>
              </div>
              <div className="w-48 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {showResults ? (
            /* Results View */
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                  <Award className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Interview Completed! 🎉
                </h3>
                <p className="text-gray-600 text-lg">
                  Great job on completing your practice session
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-blue-700 mb-2">
                    {results.score}%
                  </div>
                  <div className="text-sm text-blue-600 font-medium">Overall Score</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-green-700 mb-2">
                    {results.answeredQuestions}/{results.totalQuestions}
                  </div>
                  <div className="text-sm text-green-600 font-medium">Questions Answered</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-purple-700 mb-2">
                    {results.totalTime}s
                  </div>
                  <div className="text-sm text-purple-600 font-medium">Total Time</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-orange-700 mb-2">
                    {results.avgTimePerQuestion}s
                  </div>
                  <div className="text-sm text-orange-600 font-medium">Avg per Question</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Performance Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completion Rate</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${results.completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{results.completionRate}%</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 bg-white p-4 rounded-lg">
                    <p className="mb-2">
                      <strong>🎯 Great work!</strong> You've completed your {session?.category} practice session.
                    </p>
                    {results.score >= 80 && <p>🌟 Excellent performance! You're well-prepared for interviews in this area.</p>}
                    {results.score >= 60 && results.score < 80 && <p>👍 Good job! Consider reviewing some topics and practicing more.</p>}
                    {results.score < 60 && <p>💪 Keep practicing! Focus on the areas you found challenging.</p>}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetInterview}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Practice Again
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Question View */
            <div className="p-8">
              {currentQuestion && (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {session?.category}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {session?.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {currentQuestion.question}
                    </h3>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Answer:
                    </label>
                    <textarea
                      value={currentAnswer}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="Type your answer here... Be detailed and explain your reasoning."
                      className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Tip: Explain your thought process and provide examples where applicable
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSkipQuestion}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                      >
                        Skip
                      </button>
                      
                      <button
                        onClick={handleNextQuestion}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        {currentQuestionIndex === questions.length - 1 ? (
                          <>
                            <Send className="w-4 h-4" />
                            Complete Interview
                          </>
                        ) : (
                          <>
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Question Navigation */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-3">Question Progress:</p>
                    <div className="flex gap-2 flex-wrap">
                      {questions.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setAnswers(prev => ({
                              ...prev,
                              [currentQuestionIndex]: currentAnswer
                            }));
                            setCurrentQuestionIndex(index);
                            setCurrentAnswer(answers[index] || "");
                          }}
                          className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                            index === currentQuestionIndex
                              ? 'bg-blue-600 text-white'
                              : answers[index]
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Create Session Modal Component
const CreateSessionModal = ({ isOpen, onClose, onCreateSession }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    questionsCount: 10,
    duration: 30,
    difficulty: 'Intermediate'
  });

  const categories = [
    'React.js', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript',
    'Node.js', 'Python', 'Java', 'PHP', 'Go',
    'Full Stack', 'Frontend', 'Backend', 'DevOps',
    'System Design', 'Database', 'Git', 'Testing'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }
    onCreateSession(formData);
    setFormData({
      title: '',
      category: '',
      description: '',
      questionsCount: 10,
      duration: 30,
      difficulty: 'Intermediate'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create New Practice Session</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Frontend React Interview"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of what this session covers..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Questions Count
              </label>
              <input
                type="number"
                name="questionsCount"
                value={formData.questionsCount}
                onChange={handleChange}
                min="5"
                max="50"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="15"
                max="180"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Create Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });
  const [notification, setNotification] = useState('');
  const [interviewModal, setInterviewModal] = useState({
    isOpen: false,
    session: null,
    questions: []
  });

  // Category icons mapping
  const categoryIcons = {
    'react.js': <Monitor className="w-8 h-8 text-gray-800" />,
    'vue.js': <Monitor className="w-8 h-8 text-gray-800" />,
    'angular': <Monitor className="w-8 h-8 text-gray-800" />,
    'frontend': <Monitor className="w-8 h-8 text-gray-800" />,
    'node.js': <Server className="w-8 h-8 text-gray-800" />,
    'backend': <Server className="w-8 h-8 text-gray-800" />,
    'full stack': <Layers className="w-8 h-8 text-gray-800" />,
    'javascript': <Code className="w-8 h-8 text-gray-800" />,
    'typescript': <Code className="w-8 h-8 text-gray-800" />,
    'system design': <Database className="w-8 h-8 text-gray-800" />,
    'database': <Database className="w-8 h-8 text-gray-800" />,
    'python': <Zap className="w-8 h-8 text-gray-800" />,
    'java': <Zap className="w-8 h-8 text-gray-800" />,
    'php': <Zap className="w-8 h-8 text-gray-800" />,
    'go': <Zap className="w-8 h-8 text-gray-800" />,
    'git': <GitBranch className="w-8 h-8 text-gray-800" />,
    'devops': <Server className="w-8 h-8 text-gray-800" />,
    'testing': <Check className="w-8 h-8 text-gray-800" />
  };

  // Initial mock sessions
  const initialSessions = [
    {
      id: 1,
      title: "Frontend Developer Interview",
      category: "React.js",
      description: "Practice React hooks, state management, and component lifecycle",
      questionsCount: 15,
      duration: 45,
      difficulty: "Intermediate",
      createdAt: "2024-01-15",
      completedAt: null,
      score: null,
      status: "pending"
    },
    {
      id: 2,
      title: "Backend Node.js Interview",
      category: "Node.js",
      description: "Express.js, MongoDB, REST APIs, and server-side development",
      questionsCount: 20,
      duration: 60,
      difficulty: "Advanced",
      createdAt: "2024-01-14",
      completedAt: "2024-01-14",
      score: 85,
      status: "completed"
    }
  ];

  // Show notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    return categoryIcons[category.toLowerCase()] || <Code className="w-8 h-8 text-gray-800" />;
  };

  // Enhanced AI question generation
  const generateQuestionsWithAI = async (session) => {
    setGeneratingQuestions(true);
    setCurrentSessionId(session.id);
    
    try {
      showNotification(`🤖 Generating ${session.questionsCount} AI questions...`);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate questions based on category, difficulty, and count
      const generatedQuestions = generateQuestionsForCategory(
        session.category, 
        session.difficulty, 
        session.questionsCount
      );
      
      // Update session status
      setSessions(prev => 
        prev.map(s => 
          s.id === session.id 
            ? { ...s, status: 'ready', questions: generatedQuestions }
            : s
        )
      );
      
      showNotification(`✅ Generated ${generatedQuestions.length} questions successfully!`);
      
      // Auto-start interview after generation
      setTimeout(() => {
        setInterviewModal({
          isOpen: true,
          session: { ...session, questions: generatedQuestions },
          questions: generatedQuestions
        });
      }, 1000);
      
    } catch (error) {
      showNotification("❌ Failed to generate questions. Please try again.");
    } finally {
      setGeneratingQuestions(false);
      setCurrentSessionId(null);
    }
  };

  // Enhanced question generation based on category and difficulty
  const generateQuestionsForCategory = (category, difficulty, count) => {
    const questionBanks = {
      'React.js': {
        'Beginner': [
          "What is React and what are its main features?",
          "Explain the difference between functional and class components.",
          "What is JSX and why is it used in React?",
          "How do you handle events in React?",
          "What are React props and how do you use them?",
          "Explain the concept of state in React.",
          "What is the virtual DOM?",
          "How do you conditionally render elements in React?",
          "What are React keys and why are they important?",
          "How do you style components in React?"
        ],
        'Intermediate': [
          "Explain React hooks and their benefits.",
          "What is the useEffect hook and when would you use it?",
          "How does React handle state management?",
          "Explain the component lifecycle methods.",
          "What is context API and when would you use it?",
          "How do you optimize React performance?",
          "What are higher-order components (HOCs)?",
          "Explain React Router and how to implement routing.",
          "What is the difference between controlled and uncontrolled components?",
          "How do you handle forms in React?"
        ],
        'Advanced': [
          "Explain React Fiber architecture.",
          "How would you implement a custom hook?",
          "What are the performance implications of re-renders?",
          "How do you implement code splitting in React?",
          "Explain React Suspense and lazy loading.",
          "What are render props and how do they work?",
          "How do you test React components?",
          "Explain React's reconciliation process.",
          "How would you implement a global state management solution?",
          "What are the best practices for React performance optimization?"
        ],
        'Expert': [
          "Design a scalable React architecture for a large application.",
          "How would you implement server-side rendering with React?",
          "Explain the internals of React's reconciliation algorithm.",
          "How do you handle memory leaks in React applications?",
          "What are the trade-offs between different state management solutions?",
          "How would you implement micro-frontends with React?",
          "Explain React's concurrent features and their benefits.",
          "How do you optimize bundle size in large React applications?",
          "What are the security considerations in React applications?",
          "How would you implement a design system in React?"
        ]
      },
      'JavaScript': {
        'Beginner': [
          "What are the primitive data types in JavaScript?",
          "Explain the difference between let, const, and var.",
          "What is hoisting in JavaScript?",
          "How do you create and call a function?",
          "What are arrays and how do you use them?",
          "Explain if-else statements and loops.",
          "What is the DOM and how do you manipulate it?",
          "How do you handle user input in JavaScript?",
          "What are objects in JavaScript?",
          "Explain type conversion in JavaScript."
        ],
        'Intermediate': [
          "What are closures and how do they work?",
          "Explain the concept of 'this' in JavaScript.",
          "What are promises and how do you use them?",
          "What is async/await and how does it work?",
          "Explain prototypal inheritance.",
          "What are arrow functions and how do they differ from regular functions?",
          "How does JavaScript handle asynchronous operations?",
          "What are callback functions?",
          "Explain event bubbling and capturing.",
          "What is destructuring assignment?"
        ],
        'Advanced': [
          "Explain the JavaScript event loop.",
          "What are generators and iterators?",
          "How does garbage collection work in JavaScript?",
          "What are Web Workers and when would you use them?",
          "Explain the module system in JavaScript.",
          "What are Symbols and when would you use them?",
          "How do you implement inheritance in JavaScript?",
          "What are design patterns commonly used in JavaScript?",
          "Explain memory leaks and how to prevent them.",
          "What are the performance implications of different JavaScript features?"
        ],
        'Expert': [
          "How would you implement a JavaScript engine?",
          "Explain V8's optimization techniques.",
          "How do you debug performance issues in JavaScript?",
          "What are the internals of JavaScript's type system?",
          "How would you implement a custom Promise library?",
          "Explain JavaScript's compilation and execution phases.",
          "How do you handle large-scale JavaScript applications?",
          "What are the security implications of different JavaScript features?",
          "How would you implement a JavaScript framework?",
          "Explain the trade-offs between different JavaScript patterns."
        ]
      },
      'Node.js': {
        'Beginner': [
          "What is Node.js and what is it used for?",
          "How do you create a simple HTTP server?",
          "What is npm and how do you use it?",
          "Explain the difference between Node.js and browser JavaScript.",
          "How do you read files in Node.js?",
          "What are modules in Node.js?",
          "How do you handle command line arguments?",
          "What is package.json?",
          "How do you install and use external packages?",
          "What is the difference between global and local packages?"
        ],
        'Intermediate': [
          "Explain the Node.js event loop.",
          "What are streams in Node.js?",
          "How do you handle errors in Node.js?",
          "What is Express.js and how do you use it?",
          "How do you create REST APIs with Node.js?",
          "What is middleware in Express?",
          "How do you connect to databases in Node.js?",
          "What are environment variables and how do you use them?",
          "How do you handle file uploads?",
          "What is authentication and how do you implement it?"
        ],
        'Advanced': [
          "How do you scale Node.js applications?",
          "What are child processes in Node.js?",
          "How do you implement clustering?",
          "What are the security best practices for Node.js?",
          "How do you monitor and debug Node.js applications?",
          "What are microservices and how do you implement them?",
          "How do you optimize Node.js performance?",
          "What are worker threads?",
          "How do you implement caching strategies?",
          "What are the best practices for Node.js architecture?"
        ],
        'Expert': [
          "How would you design a high-performance Node.js system?",
          "What are the internals of the Node.js event loop?",
          "How do you implement custom streams in Node.js?",
          "How would you build a Node.js framework?",
          "What are the memory management strategies in Node.js?",
          "How do you implement distributed systems with Node.js?",
          "How would you optimize Node.js for IoT applications?",
          "What are the trade-offs of different Node.js deployment strategies?",
          "How do you implement real-time systems with Node.js?",
          "How would you contribute to the Node.js core?"
        ]
      },
      'Python': {
        'Beginner': [
          "What are the basic data types in Python?",
          "How do you create and use lists?",
          "What are functions and how do you define them?",
          "Explain if statements and loops in Python.",
          "What are dictionaries and how do you use them?",
          "How do you handle strings in Python?",
          "What is the difference between lists and tuples?",
          "How do you read from and write to files?",
          "What are modules and how do you import them?",
          "How do you handle user input?"
        ],
        'Intermediate': [
          "What are classes and objects in Python?",
          "Explain inheritance and polymorphism.",
          "What are decorators and how do you use them?",
          "How do you handle exceptions in Python?",
          "What are list comprehensions?",
          "What is the difference between shallow and deep copy?",
          "How do you work with APIs in Python?",
          "What are lambda functions?",
          "How do you work with databases using Python?",
          "What are context managers?"
        ],
        'Advanced': [
          "Explain the Global Interpreter Lock (GIL).",
          "What are metaclasses in Python?",
          "How does memory management work in Python?",
          "What are generators and yield?",
          "How do you implement multithreading and multiprocessing?",
          "What are async/await in Python?",
          "How do you optimize Python performance?",
          "What are descriptors?",
          "How do you implement design patterns in Python?",
          "What are the best practices for Python code organization?"
        ],
        'Expert': [
          "How would you extend Python with C/C++?",
          "What are the internals of Python's interpreter?",
          "How do you profile and optimize Python applications?",
          "How would you implement a Python web framework?",
          "What are the advanced features of Python's type system?",
          "How do you implement distributed computing in Python?",
          "How would you contribute to Python's core development?",
          "What are the trade-offs of different Python implementations?",
          "How do you implement machine learning algorithms from scratch?",
          "How would you design a Python-based microservices architecture?"
        ]
      }
    };

    // Get questions for the category and difficulty
    const categoryQuestions = questionBanks[category] || questionBanks['JavaScript'];
    const difficultyQuestions = categoryQuestions[difficulty] || categoryQuestions['Intermediate'];
    
    // Generate the requested number of questions
    const questions = [];
    for (let i = 0; i < count; i++) {
      const questionIndex = i % difficultyQuestions.length;
      const baseQuestion = difficultyQuestions[questionIndex];
      
      questions.push({
        id: i + 1,
        question: `${baseQuestion}${i >= difficultyQuestions.length ? ` (Variation ${Math.floor(i / difficultyQuestions.length) + 1})` : ''}`,
        answer: "",
        timeSpent: 0,
        difficulty: difficulty,
        category: category
      });
    }
    
    return questions;
  };

  // Handle creating a new session
  const handleCreateSession = (newSessionData) => {
    const newSession = {
      ...newSessionData,
      id: Math.max(...sessions.map(s => s.id), 0) + 1,
      createdAt: new Date().toISOString().split('T')[0],
      status: "pending",
      completedAt: null,
      score: null
    };
    
    setSessions(prev => [newSession, ...prev]);
    setOpenCreateModal(false);
    showNotification("✅ New session created successfully!");
    
    // Auto-generate questions for the new session
    setTimeout(() => {
      generateQuestionsWithAI(newSession);
    }, 500);
  };

  // Start a session
  const startSession = async (session) => {
    if (session.questions && session.questions.length > 0) {
      // Questions already exist, start directly
      setInterviewModal({
        isOpen: true,
        session: session,
        questions: session.questions
      });
    } else {
      // Need to generate questions first
      await generateQuestionsWithAI(session);
    }
  };

  // Delete a session
  const deleteSession = (sessionId) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    showNotification("🗑️ Session deleted successfully");
    setOpenDeleteAlert({ open: false, data: null });
  };

  // Close interview modal
  const closeInterviewModal = () => {
    setInterviewModal({ isOpen: false, session: null, questions: [] });
  };

  // Get difficulty color class
  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'bg-green-100 text-green-800 border-green-200',
      'intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'advanced': 'bg-orange-100 text-orange-800 border-orange-200',
      'expert': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[difficulty.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get status color class
  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-500',
      'in-progress': 'bg-blue-500',
      'ready': 'bg-purple-500',
      'pending': 'bg-gray-400'
    };
    return colors[status] || 'bg-gray-400';
  };

  // Initialize with mock data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSessions(initialSessions);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-sm">
          <p className="text-sm font-medium">{notification}</p>
        </div>
      )}

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🚀 AI Interview Practice Dashboard
              </h1>
              <p className="text-gray-600">
                Prepare for your software developer interviews with AI-powered practice sessions
              </p>
            </div>
            
            <button
              onClick={() => setOpenCreateModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              New Practice Session
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Play className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready to Start</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.status === 'ready').length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(sessions.reduce((acc, s) => acc + s.duration, 0) / 60)}h
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session, index) => {
              const cardBg = CARD_BG[index % CARD_BG.length];
              const isGenerating = generatingQuestions && currentSessionId === session.id;
              
              return (
                <div
                  key={session.id}
                  className={`${cardBg.gradient} ${cardBg.shadowColor} ${cardBg.hoverShadow} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden`}
                >
                  {/* Card Header */}
                  <div className="p-6 text-gray-800 relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Category Icon */}
                        <div className="flex-shrink-0 p-3 bg-white/50 backdrop-blur-sm rounded-lg">
                          {getCategoryIcon(session.category)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold mb-2 line-clamp-2">
                            {session.title}
                          </h3>
                          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                            {session.description}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setOpenDeleteAlert({ open: true, data: session })}
                        className="p-2 hover:bg-white/30 rounded-lg transition-colors ml-2 flex-shrink-0"
                        disabled={isGenerating}
                      >
                        <Trash2 className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>

                    {/* Status indicator */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`}></div>
                      <span className="text-sm text-gray-800 font-medium capitalize">
                        {session.status.replace('-', ' ')}
                        {session.status === 'ready' && ' 🎯'}
                        {session.status === 'completed' && ' ✅'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="bg-white p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(session.difficulty)}`}>
                        {session.difficulty}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">{session.category}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Brain className="w-4 h-4" />
                        <span>{session.questionsCount} Questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{session.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                      </div>
                      {session.score && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Score: {session.score}%</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {session.status === 'completed' ? (
                        <button
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                          disabled={isGenerating}
                        >
                          Review Results
                        </button>
                      ) : (
                        <button
                          onClick={() => startSession(session)}
                          disabled={isGenerating}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isGenerating ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              Generating AI Questions...
                            </>
                          ) : session.status === 'ready' ? (
                            <>
                              <Play className="w-4 h-4" />
                              Start Interview
                            </>
                          ) : session.status === 'in-progress' ? (
                            <>
                              <Play className="w-4 h-4" />
                              Continue
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4" />
                              Generate Questions
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* AI Generation Progress */}
                    {isGenerating && currentSessionId === session.id && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-700 text-sm">
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>AI is generating {session.questionsCount} tailored questions...</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                    )}

                    {/* Questions Preview for Ready Sessions */}
                    {session.status === 'ready' && session.questions && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-green-700 text-sm font-medium mb-2">
                          ✅ {session.questions.length} AI questions ready!
                        </p>
                        <p className="text-green-600 text-xs">
                          Click "Start Interview" to begin your practice session
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && sessions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <Brain className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No practice sessions yet</h3>
            <p className="text-gray-600 mb-6">Create your first AI-powered interview practice session to get started</p>
            <button
              onClick={() => setOpenCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
            >
              🚀 Create First Session
            </button>
          </div>
        )}

        {/* Create Session Modal */}
        <CreateSessionModal
          isOpen={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          onCreateSession={handleCreateSession}
        />

        {/* Interview Questions Modal */}
        <InterviewQuestionsModal
          isOpen={interviewModal.isOpen}
          onClose={closeInterviewModal}
          session={interviewModal.session}
          questions={interviewModal.questions}
        />

        {/* Delete Confirmation Modal */}
        {openDeleteAlert.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Session</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{openDeleteAlert.data?.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setOpenDeleteAlert({ open: false, data: null })}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteSession(openDeleteAlert.data?.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Start Guide */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 How it works:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Create Session</p>
                <p className="text-gray-600">Choose your technology stack, difficulty level, and number of questions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">AI Generation</p>
                <p className="text-gray-600">Our AI generates tailored questions based on your preferences</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Practice & Learn</p>
                <p className="text-gray-600">Answer questions, get feedback, and track your progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;