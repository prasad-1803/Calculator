import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EditProfile from './EditProfile';  // Import the EditProfile component
import '../../styles/Header.css';  // Import the new CSS file

const Header = ({ user, onSignOut }) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false); // State to handle Edit Profile visibility

  // Handle profile click to open Edit Profile
  const handleProfileClick = () => {
    setIsEditProfileOpen(true);
  };

  // Handle close of the Edit Profile component
  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <img
            src={user.logo}
            alt={`${user.first_name}'s logo`}
            className="logo"
            onClick={handleProfileClick}  // Open Edit Profile on click
          />
          <div className="user-info" onClick={handleProfileClick}>  {/* Open Edit Profile on click */}
            <span className="user-name">{user.first_name} {user.last_name}</span>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="sign-out-button"
        >
          Sign Out
        </button>
      </header>

      {/* Conditionally render the Edit Profile component */}
      {isEditProfileOpen && (
        <div className="edit-profile-modal">
          <EditProfile onClose={handleCloseEditProfile} />
        </div>
      )}
    </>
  );
};

export default Header;
