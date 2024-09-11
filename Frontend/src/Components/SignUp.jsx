import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';

import '../../styles/SignUp.css';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [logo, setLogo] = useState('');
  const [message, setMessage] = useState('');

  const [primaryColor, setPrimaryColor] = useColor('#ffffff'); // Initialize with a default color
  const [secondaryColor, setSecondaryColor] = useColor('#ffffff'); // Initialize with a default color

  const [isPrimaryColorPickerVisible, setPrimaryColorPickerVisible] = useState(false);
  const [isSecondaryColorPickerVisible, setSecondaryColorPickerVisible] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/signup', {
        first_name: firstName,
        last_name: lastName,
        email_address: email,
        password: password,
        age: age,
        home_address: homeAddress,
        primary_color: primaryColor.hex, // Use the hex value for API
        secondary_color: secondaryColor.hex, // Use the hex value for API
        logo: logo
      });
      setMessage('Sign-up successful. Please sign in.');
    } catch (error) {
      setMessage('Error: ' + error.response?.data?.message || 'Internal Server Error');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp} className="signup-form">
        <div className="form-layout">
          {/* Right Side */}
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
              <label>Email Address</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          {/* Left Side */}
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
        <div className='down-btn'>
        <button type="submit" className="submit-button">Sign Up</button>
        <Link to="/signin" className="submit-button">
        Sign In
        </Link>
        </div>
      </form>

      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default SignUp;
