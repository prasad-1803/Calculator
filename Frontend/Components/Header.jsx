import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css'; // Import CSS module for styling

const Header = () => {
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.link}>
        Home
      </Link>
      <Link to="/calculator/short-polling" className={styles.link}>
        Short Polling Calculator
      </Link>
      <Link to="/calculator/long-polling" className={styles.link}>
        Long Polling Calculator
      </Link>
      <Link to="/calculator/web-socket" className={styles.link}>
        WebSocket Calculator
      </Link>
    </div>
  );
};

export default Header;
