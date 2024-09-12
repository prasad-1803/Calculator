import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../store/authSlice'; // Import from authSlice
import '../styles/SignIn.css'

// Utility function to encode data to Base64
const encodeToBase64 = (data) => btoa(JSON.stringify(data));

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Use dispatch for Redux actions

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/signin', {
        email_address: email,
        password: password
      });
      
      // Set token in Redux and localStorage
      dispatch(setToken(response.data.token));
      localStorage.setItem('token', response.data.token);

      // Fetch user profile after successful login and set it in Redux
      const userResponse = await axios.get('http://localhost:3000/api/profile', {
        headers: {
          'Authorization': `Bearer ${response.data.token}`
        }
      });

      // Encode user profile data to Base64 and store it in localStorage
      const encodedProfile = encodeToBase64(userResponse.data);
      localStorage.setItem('user', encodedProfile);
      
      // Dispatch the user data to Redux
      dispatch(setUser(userResponse.data));

      setMessage('Sign-in successful.');
      navigate('/home'); // Navigate to home

    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Internal Server Error'));
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
        <div className="signup-message">
          <p>Don't have an account?</p>
          <Link to="/signup" className="signup-link">Sign Up</Link>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SignIn;
