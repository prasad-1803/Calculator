// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './src/Components/SignIn';
import SignUp from './src/Components/SignUp';
// import Profile from '../Components/Profile';
import Home from './src/Components/Home';
import Header from './src/Components/Headers';
import './App.css';
import Calculator from './src/Components/Calculator';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/api/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <div className="app-wrapper">
        {user && <Header user={user} onSignOut={handleSignOut} />}
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" /> : <SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
          {/* <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} /> */}
          <Route path="/calculator" element={user ? <Calculator /> : <Navigate to="/" />}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
