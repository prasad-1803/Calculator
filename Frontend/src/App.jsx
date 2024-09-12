// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile, logout } from './store/authSlice'; // Import actions
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Calculator from './components/Calculator';
import Header from './components/Headers';

const AppContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  // Select user and token from Redux store
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);



  // Fetch user profile on component mount if a token exists
  useEffect(() => {
    if (token) {
      dispatch(fetchProfile());
    }
  }, [dispatch, token]);
  const primaryColor = useSelector((state) => state.auth.user?.primary_color || '#ffffff');
  const secondaryColor = useSelector((state) => state.auth.user?.secondary_color || '#ffffff');

  useEffect(() => {
    // Update the CSS variables in the :root element
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
  }, [primaryColor, secondaryColor]);

  // Handle sign out
  const handleSignOut = () => {
    dispatch(logout()); // Use the logout action
    navigate('/signin'); // Redirect to sign-in page
   
  };

  return (
    <div className="app-wrapper">
      {/* Conditionally show Header if user exists */}
      {user && <Header user={user} onSignOut={handleSignOut} />}
      <Routes>
        {/* Conditional rendering based on user state */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/calculator" element={user ? <Calculator /> : <Navigate to="/signin" />} />
        <Route path="/home" element= {<Calculator />} />
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
