// src/components/SignUp.js
import React, { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [logo, setLogo] = useState('');
  const [message, setMessage] = useState('');

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
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        logo: logo
      });
      setMessage('Sign-up successful. Please sign in.');
    } catch (error) {
      setMessage('Error: ' + error.response?.data?.message || 'Internal Server Error');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Home Address</label>
          <input
            type="text"
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Primary Color</label>
          <input
            type="text"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Secondary Color</label>
          <input
            type="text"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Logo URL</label>
          <input
            type="text"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignUp;
