import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LuArrowLeft, LuCheck } from "react-icons/lu";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const SessionReview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessionData = () => {
      try {
        // Load questions and session metadata from localStorage
        const storedQuestions = localStorage.getItem(`session-${sessionId}-questions`);
        const storedMetadata = localStorage.getItem(`session-${sessionId}-metadata`);
        
        if (!storedQuestions || !storedMetadata) {
          navigate("/dashboard");
          return;
        }
        
        setQuestions(JSON.parse(storedQuestions));
        setSessionData(JSON.parse(storedMetadata));
        setLoading(false);
      } catch (error) {
        console.error("Error loading session data:", error);
        navigate("/dashboard");
      }
    };
    
    loadSessionData();
  }, [sessionId, navigate]);

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

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <LuArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Review: {sessionData.title}</h1>
            <p className="text-gray-600 mb-4">{sessionData.description}</p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Difficulty</p>
                <p className="text-lg font-semibold text-blue-800 capitalize">{sessionData.difficulty}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Questions Answered</p>
                <p className="text-lg font-semibold text-green-800">
                  {questions.filter(q => q.answer.trim() !== "").length}/{questions.length}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Category</p>
                <p className="text-lg font-semibold text-purple-800">{sessionData.category}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Question {index + 1}
                </h3>
                <div className={`flex items-center gap-1 ${question.answer ? 'text-green-600' : 'text-red-600'}`}>
                  {question.answer ? (
                    <>
                      <LuCheck className="w-4 h-4" />
                      <span className="text-sm">Answered</span>
                    </>
                  ) : (
                    <span className="text-sm">Not answered</span>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-2 font-medium">Question:</p>
                <p className="text-gray-900">{question.question}</p>
              </div>
              
              <div>
                <p className="text-gray-700 mb-2 font-medium">Your Answer:</p>
                {question.answer ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{question.answer}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No answer provided</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SessionReview; 
 