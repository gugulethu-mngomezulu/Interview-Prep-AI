import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

// Create the context
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Function to clear user data (logout)
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          clearUser();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Fetch user data from API (optional - for when you have backend)
  const fetchUserFromAPI = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axiosInstance.get(API_PATHS.GET_USER);
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } catch (error) {
        console.error('Error fetching user:', error);
        clearUser();
      }
    }
  };

  const value = {
    user,
    loading,
    updateUser,
    clearUser,
    fetchUserFromAPI
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Export UserContext for direct access if needed
export { UserContext };

export default UserProvider;