import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Mock user data for demo purposes
  const mockUsers = [
    {
      id: 1,
      email: "john@example.com",
      password: "password123",
      name: "John Doe",
      profileImageUrl: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      email: "admin@test.com",
      password: "admin123",
      name: "Admin User",
      profileImageUrl: "https://via.placeholder.com/150"
    }
  ];

  // Handle login form Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      try {
        // Basic validation
        if (!email || !password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        // Check if user exists in mock data
        const user = mockUsers.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (user) {
          // Simulate successful login
          const mockToken = btoa(JSON.stringify({ userId: user.id, email: user.email }));
          const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl
          };

          // Store in localStorage
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Navigate to dashboard
          navigate('/dashboard');
        } else {
          setError('Invalid email or password');
        }
      } catch (error) {
        console.error('Login error:', error);
        setError('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 1000); // 1 second delay to simulate network request
  };

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Welcome Back</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Please enter your details to log in
      </p>
      
      {/* Demo credentials info */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-blue-700 font-medium mb-1">Demo Credentials:</p>
        <p className="text-xs text-blue-600">Email: john@example.com</p>
        <p className="text-xs text-blue-600">Password: password123</p>
      </div>

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            placeholder="john@example.com"
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="Min 6 Characters"
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            required
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#FF9324] to-[#FCD760] text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setCurrentPage('signup')}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>

      {/* Quick login button for demo */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => {
            setEmail("john@example.com");
            setPassword("password123");
          }}
          className="w-full text-sm text-gray-600 hover:text-gray-800 py-2"
        >
          Fill Demo Credentials
        </button>
      </div>
    </div>
  );
};

export default Login;