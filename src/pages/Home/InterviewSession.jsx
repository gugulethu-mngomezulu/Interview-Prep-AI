// src/pages/Interview/Interview.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LuArrowLeft, LuArrowRight, LuCheckCircle, LuClock } from "react-icons/lu";
import toast from "react-hot-toast";

const  InterviewSession = () => {
  const { id } = useParams(); // session id
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0); // track total time

  // Load session & questions from localStorage
  useEffect(() => {
    const storedSession = JSON.parse(localStorage.getItem(`session-${id}`));
    const storedQuestions = JSON.parse(localStorage.getItem(`session-${id}-questions`));

    if (!storedSession || !storedQuestions) {
      toast.error("Session not found. Please start again.");
      navigate("/dashboard");
      return;
    }

    setSession(storedSession);
    setQuestions(storedQuestions);
  }, [id, navigate]);

  // Timer for tracking time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);

      // Track time per question
      setQuestions((prev) => {
        const updated = [...prev];
        if (updated[currentIndex]) {
          updated[currentIndex].timeSpent = (updated[currentIndex].timeSpent || 0) + 1;
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Save answers to localStorage on change
  const handleAnswerChange = (value) => {
    const updated = [...questions];
    updated[currentIndex].answer = value;
    setQuestions(updated);
    localStorage.setItem(`session-${id}-questions`, JSON.stringify(updated));
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const finishInterview = () => {
    const updatedSession = {
      ...session,
      status: "completed",
      completedAt: new Date().toISOString(),
      score: Math.floor(Math.random() * 21) + 80, // fake score for now
    };

    // Save updated session
    localStorage.setItem(`session-${id}`, JSON.stringify(updatedSession));
    setSession(updatedSession);

    toast.success("Interview completed!");
    navigate(`/interview/${id}/review`);
  };

  if (!session || questions.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>Loading session...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{session.title}</h1>
          <p className="text-gray-600">{session.category} • {session.difficulty}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <LuClock className="w-5 h-5" />
          <span>{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <p className="text-lg font-medium text-gray-900 mb-4">
          Question {currentIndex + 1} of {questions.length}
        </p>
        <p className="text-gray-800 mb-4">{currentQuestion.question}</p>

        <textarea
          value={currentQuestion.answer || ""}
          onChange={(e) => handleAnswerChange(e.target.value)}
          className="w-full h-40 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Type your answer here..."
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50"
        >
          <LuArrowLeft className="w-4 h-4" /> Previous
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={finishInterview}
            className="px-4 py-2 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <LuCheckCircle className="w-4 h-4" /> Finish
          </button>
        ) : (
          <button
            onClick={goToNext}
            className="px-4 py-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Next <LuArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewSession;
