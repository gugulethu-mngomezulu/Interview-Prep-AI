import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { FaUserCircle } from 'react-icons/fa';

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  // Fallback profile image
  const fallbackImage = "/default-profile.jpg";

  if (!user) {
    return (
      <div className="flex items-center">
        <div className="w-11 h-11 bg-gray-300 rounded-full mr-3 animate-pulse"></div>
        <div>
          <div className="text-[15px] text-black font-bold leading-3">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {user.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt="Profile"
          className="w-11 h-11 bg-gray-300 rounded-full mr-3 object-cover"
          onError={(e) => (e.target.src = fallbackImage)} // fallback if URL fails
        />
      ) : (
        <FaUserCircle className="w-11 h-11 text-gray-400 mr-3" />
      )}
      <div>
        <div className="text-[15px] text-black font-bold leading-3">
          {user.name || user.fullName || 'User'}
        </div>
        <button
          className="text-amber-600 text-sm font-semibold cursor-pointer hover:underline"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoCard;
