// utils/apiPaths.js
export const API_PATHS = {
  // Auth endpoints
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  GET_USER: '/api/auth/me',
  
  // Session endpoints
  SESSIONS: '/api/sessions',
  SESSION_BY_ID: (id) => `/api/sessions/${id}`,
  
  // Question endpoints
  QUESTIONS: '/api/questions',
  QUESTION_BY_ID: (id) => `/api/questions/${id}`,
  
  // AI endpoints
  AI_GENERATE_QUESTIONS: '/api/ai/generate-questions',
  AI_GENERATE_EXPLANATION: '/api/ai/generate-explanation',
  
  // Upload endpoints
  UPLOAD: '/api/upload',
};

export default API_PATHS;