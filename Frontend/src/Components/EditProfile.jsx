import React, { useState, useEffect } from 'react';
import '../../styles/EditProfile.css';
import { ColorPicker, useColor } from 'react-color-palette';

const EditProfile = ({ onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [logo, setLogo] = useState('');
  const [message, setMessage] = useState('');
  const [primaryColor, setPrimaryColor] = useColor('#ffffff'); // Initialize with a default color
  const [secondaryColor, setSecondaryColor] = useColor('#ffffff'); // Initialize with a default color

  const [isPrimaryColorPickerVisible, setPrimaryColorPickerVisible] = useState(false);
  const [isSecondaryColorPickerVisible, setSecondaryColorPickerVisible] = useState(false);

  // Fetch profile data from local storage when the component is mounted
  useEffect(() => {
    const fetchProfile = () => {
      try {
        const profileData = localStorage.getItem('profile');
        if (profileData) {
          const profile = JSON.parse(profileData);
          setFirstName(profile.first_name || '');
          setLastName(profile.last_name || '');
          setAge(profile.age || '');
          setHomeAddress(profile.home_address || '');
          setPrimaryColor(profile.primary_color || '#ffffff'); // Use default color if not available
          setSecondaryColor(profile.secondary_color || '#ffffff'); // Use default color if not available
          setLogo(profile.logo || '');
        }
      } catch (error) {
        setMessage('Error fetching profile data');
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      // Update local storage profile data
      const updatedProfile = {
        first_name: firstName,
        last_name: lastName,
        password: password, // Optional: Only update if provided
        age: age,
        home_address: homeAddress,
        primary_color: primaryColor.hex, // Ensure the color is in HEX format
        secondary_color: secondaryColor.hex, // Ensure the color is in HEX format
        logo: logo
      };
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      setMessage('Profile updated successfully.');

      // Optionally, you can also trigger a function or an event to update other components
      if (window.ProfileUpdated) {
        window.ProfileUpdated(); // This is just an example; you may need to replace it with your own method
      }

    } catch (error) {
      setMessage('Error: ' + (error.message || 'Internal Error'));
    }
  };

  return (
    <div className="edit-profile-container">
      <button className="close-button" onClick={onClose}>X</button>
      <h2>Edit Profile</h2>
      <form onSubmit={handleEditProfile} className="edit-profile-form">
        <div className="form-layout">
          <div className="form-left">
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
          </div>
          <div className="form-right">
            <div className="form-group">
              <label>Primary Color</label>
              <div
                className="color-picker-dropdown"
                onClick={() => setPrimaryColorPickerVisible(!isPrimaryColorPickerVisible)}
              >
                <input
                  type="text"
                  className="input-field"
                  readOnly
                  value={primaryColor.hex}
                  placeholder="Select Primary Color"
                />
                {isPrimaryColorPickerVisible && (
                  <ColorPicker
                    width={50}
                    height={50}
                    color={primaryColor}
                    onChange={setPrimaryColor}
                    hideHSV
                    hideRGB
                    hideHEX
                  />
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Secondary Color</label>
              <div
                className="color-picker-dropdown"
                onClick={() => setSecondaryColorPickerVisible(!isSecondaryColorPickerVisible)}
              >
                <input
                  type="text"
                  className="input-field"
                  readOnly
                  value={secondaryColor.hex}
                  placeholder="Select Secondary Color"
                />
                {isSecondaryColorPickerVisible && (
                  <ColorPicker
                    width={50}
                    height={50}
                    color={secondaryColor}
                    onChange={setSecondaryColor}
                    hideHSV
                    hideRGB
                    hideHEX
                  />
                )}
              </div>
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
          </div>
        </div>
        <button type="submit" className="submit-button">Save Changes</button>
      </form>
      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default EditProfile;
