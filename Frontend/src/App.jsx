import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ShortPollingCalculator from '../Components/ShortPollingCalculator';
import LongPollingCalculator from '../Components/LongPollingCalculator';
import WebSocketCalculator from '../Components/WebSocketCalculator';
import Home from '../Components/Home';
import Header from '../Components/Header';
import "./App.css";

const AppContent = () => {
  const location = useLocation();


  const showHeader = location.pathname !== '/';

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator/short-polling" element={<ShortPollingCalculator />} />
        <Route path="/calculator/long-polling" element={<LongPollingCalculator />} />
        <Route path="/calculator/web-socket" element={<WebSocketCalculator />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
