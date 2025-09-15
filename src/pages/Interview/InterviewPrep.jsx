import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  // Redirect to the new interview system
  React.useEffect(() => {
    navigate(`/interview/${sessionId}`);
  }, [sessionId, navigate]);
  
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default InterviewPrep;