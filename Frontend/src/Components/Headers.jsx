import React, { useState } from 'react';
import ProfileDetails from './ProfileDetail';  // Import the ProfileDetails component
import '../../styles/Header.css';  // Import the CSS file for the header

const Header = ({ user, onSignOut }) => {
  const [isProfileDetailsOpen, setIsProfileDetailsOpen] = useState(false); // State to handle ProfileDetails visibility

  // Toggle the ProfileDetails modal
  const toggleProfileDetails = () => {
    setIsProfileDetailsOpen(prevState => !prevState);
  };

  // Handle close of the ProfileDetails component
  const handleCloseProfileDetails = () => {
    setIsProfileDetailsOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <img
            src={user.logo}
            alt={`${user.first_name}'s logo`}
            className="logo"
            onClick={toggleProfileDetails}  // Toggle ProfileDetails on click
          />
          <div className="user-info" onClick={toggleProfileDetails}>  {/* Toggle ProfileDetails on click */}
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

      {/* Conditionally render the ProfileDetails component */}
      {isProfileDetailsOpen && (
        <div className="profile-detail-modal">
          <ProfileDetails onClose={handleCloseProfileDetails} />
        </div>
      )}
    </>
  );
};

export default Header;
