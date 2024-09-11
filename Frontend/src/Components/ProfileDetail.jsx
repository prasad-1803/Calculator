import React, { useState, useEffect } from 'react';
import EditProfile from './EditProfile'; // Adjust the import path as needed
import "../../styles/ProfileDetails.css";

const ProfileDetails = ({ onClose }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile data from local storage when the component is mounted
  useEffect(() => {
    const fetchProfile = () => {
      try {
        const profileData = localStorage.getItem('profile'); // Change 'profile' to the key used to store your profile data
        if (profileData) {
          setProfile(JSON.parse(profileData));
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClose = () => {
    setIsEditing(false);
    // Optionally, you can refetch the profile here if needed
    // fetchProfile();
  };

  if (isEditing) {
    return <EditProfile onClose={handleEditClose} />;
  }

  return (
    <div className="profile-details-container">
      <button className="close-button" onClick={onClose}>X</button>
      {profile ? (
        <div className="profile-details">
          <h2>Profile Details</h2>
          <div className="profile-info">
            <p><strong>First Name :</strong> {profile.first_name}</p>
            <p><strong>Last Name :</strong> {profile.last_name}</p>
            <p><strong>Age :</strong> {profile.age}</p>
            <p><strong>Home Address :</strong> {profile.home_address}</p>
            <p><strong>Primary Color :</strong> <span style={{ color: profile.primary_color }}>{profile.primary_color}</span></p>
            <p><strong>Secondary Color :</strong> <span style={{ color: profile.secondary_color }}>{profile.secondary_color}</span></p>
            <p><strong>Logo :</strong> <img src={profile.logo} alt="Profile Logo" className="profile-logo" /></p>
          </div>
          <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfileDetails;
