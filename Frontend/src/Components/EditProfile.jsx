import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import '../../styles/EditProfile.css';

const EditProfile = ({onClose}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [logo, setLogo] = useState('');
  const [message, setMessage] = useState('');

  // Fetch profile data when the component is mounted
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/profile'); // Fetch current profile
        const profile = response.data;
        setFirstName(profile.first_name);
        setLastName(profile.last_name);
        setAge(profile.age);
        setHomeAddress(profile.home_address);
        setPrimaryColor(profile.primary_color);
        setSecondaryColor(profile.secondary_color);
        setLogo(profile.logo);
      } catch (error) {
        setMessage('Error fetching profile data');
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:3000/api/profile', {
        first_name: firstName,
        last_name: lastName,
        password: password, // Optional: Only update if provided
        age: age,
        home_address: homeAddress,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        logo: logo
      });
      setMessage('Profile updated successfully.');
    } catch (error) {
      setMessage('Error: ' + error.response?.data?.message || 'Internal Server Error');
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleEditProfile} className="edit-profile-form">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            className="input-field"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            className="input-field"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password (Optional)</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            className="input-field"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Home Address</label>
          <input
            type="text"
            className="input-field"
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Primary Color</label>
          <input
            type="text"
            className="input-field"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Secondary Color</label>
          <input
            type="text"
            className="input-field"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Logo URL</label>
          <input
            type="text"
            className="input-field"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Save Changes</button>
      </form>

      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default EditProfile;
