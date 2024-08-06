import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShortPollingCalculator from '../Components/ShortPollingCalculator';
import LongPollingCalculator from '../Components/LongPollingCalculator';
import WebSocketCalculator from '../Components/WebSocketCalculator';
import Calculator from '../Components/NormalCalculator';
import Header from '../Components/Header';
import "./App.css"

function App() {
  return (
    <Router>
    <Header/>
      <Routes>

      <Route path="/" element={<Calculator/>} />
        <Route path="/calculator/short-polling" element={<ShortPollingCalculator />} />
        <Route path="/calculator/long-polling" element={<LongPollingCalculator />} />
        <Route path="/calculator/web-socket" element={<WebSocketCalculator />} />
      </Routes>
    </Router>
  );
}

export default App;