// src/components/SignIn.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/signin', {
        email_address: email,
        password: password
      });
      localStorage.setItem('token', response.data.token);
      setMessage('Sign-in successful.');
      
      navigate('/calculator');
    } catch (error) {
      setMessage('Error: ' + error.response?.data?.message || 'Internal Server Error');
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div>
          <label>Email Address</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Sign In</button>
      </form>

      {message && <p className="error-message">{message}</p>}

      <div className="signup-message">
      <p>{message}</p>
        <p>Don't have an account?</p>
        <Link to="/signup">
          <button className="signup-button">Create an Account</button>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
