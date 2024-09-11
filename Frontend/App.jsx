// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import SignIn from './src/components/SignIn';
import SignUp from './src/components/SignUp';
import Home from './src/components/Home';
import Header from './src/components/Headers';

const AppContent = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Now within Router context

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
            console.log('User data fetched:', userData); // Debug log
            setUser(userData);
            localStorage.setItem("profile",JSON.stringify(userData));
            
          } else {
            console.log('Response not OK, removing token'); // Debug log
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
    navigate('/signin'); // Redirect to sign-in page
    console.log('User signed out'); // Debug log
  };

  return (
    <div className="app-wrapper">
      {user && <Header user={user} onSignOut={handleSignOut} />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/calculator" element={user ?  <Navigate to="/calculator" /> : <Navigate to="/signin" />} />
        <Route path="/home" element={ <Home />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
