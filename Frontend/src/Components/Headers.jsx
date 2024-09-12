import React, { useState } from "react";
import ProfileDetails from "./ProfileDetail"; // Import the ProfileDetails component
import { useSelector, useDispatch } from 'react-redux'; // Redux imports
import { logout } from "../store/authSlice"; // Action to log out
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import "../styles/Header.css"; // Import the CSS file for the header

const Header = () => {
  const [isProfileDetailsOpen, setIsProfileDetailsOpen] = useState(false); // State to handle ProfileDetails visibility
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation
  const user = useSelector((state) => state.auth.user); // Get user from Redux

  // Toggle the ProfileDetails modal
  const toggleProfileDetails = () => {
    setIsProfileDetailsOpen((prevState) => !prevState);
  };

  // Handle close of the ProfileDetails component
  const handleCloseProfileDetails = () => {
    setIsProfileDetailsOpen(false);
  };

  // Handle user sign out
  const handleSignOut = () => {
    dispatch(logout()); // Dispatch logout action
    navigate("/signin"); // Redirect to sign-in page after logout
  };

  // Display initials if user.logo is not available
  const renderLogo = () => {
    if (user?.logo) {
      return <img src={user.logo} alt={`${user.first_name}'s logo`} className="logo" onClick={toggleProfileDetails} />;
    }
    // Display first letter of the first name as fallback
    return (
      <div className="initial-logo" onClick={toggleProfileDetails}>
        {user?.first_name[0]}
      </div>
    );
  };

  return (
    <>
      <header className="header">
        <div className="header-content-left">
          <h2>QuickCalc - Calculator With Logs</h2>
        </div>
        <div className="header-content-right">
          {/* Render either logo or initials */}
          {renderLogo()}
          <div className="user-info" onClick={toggleProfileDetails}>
            <span className="user-name">
              {user?.first_name} {user?.last_name}
            </span>
          </div>
          <button onClick={handleSignOut} className="sign-out-button">
            Sign Out
          </button>
        </div>
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
