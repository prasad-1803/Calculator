// src/components/SignIn.js
import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate } from 'react-router-dom';

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
      console.log("hello");
    } catch (error) {
      setMessage('Error: ' + error.response?.data?.message || 'Internal Server Error');
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
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
        <button type="submit">Sign In</button>
      </form>
      <Link to="/signup">
        <button>Sign Up</button>
      </Link>
     
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignIn;
