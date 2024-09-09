// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, onSignOut }) => {
  // Define inline styles for the header and its elements
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#f4f4f4',
    borderBottom: '1px solid #ddd',
  };

  const logoStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const userNameStyle = {
    fontWeight: 'bold',
    fontSize: '16px',
  };

  const signOutButtonStyle = {
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#ff4c4c',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  const signOutButtonHoverStyle = {
    backgroundColor: '#e03a3a',
  };

  return (
    <header style={headerStyle}>
      <div className="header-content" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <img
          src={user.logo}
          alt={`${user.first_name}'s logo`}
          style={logoStyle}
        />
        <div style={userInfoStyle}>
          <span style={userNameStyle}>{user.first_name} {user.last_name}</span>
        </div>
      </div>
      <button
        onClick={onSignOut}
        style={signOutButtonStyle}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = signOutButtonHoverStyle.backgroundColor)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = signOutButtonStyle.backgroundColor)}
      >
        Sign Out
      </button>
    </header>
  );
};

export default Header;
