import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Ensure this file includes styles for the home page

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Here you'll find an overview of different web protocols used for data communication</h1>
      <p></p>
      
      <div className="protocols">
        <div className="protocol">
          <h2>
            <Link to="/calculator/short-polling">Short Polling</Link>
          </h2>
          <p>
            Short Polling is a technique where the client repeatedly polls the server at regular intervals to check for updates. 
            It's simple to implement but can be inefficient due to the constant requests sent to the server, which may lead to increased latency and server load.
          </p>
          
        </div>
        
        <div className="protocol">
          <h2>
            <Link to="/calculator/long-polling">Long Polling</Link>
          </h2>
          <p>
            Long Polling improves upon short polling by keeping the connection open until the server has new information. 
            Once the server responds, the client immediately re-establishes the connection. This reduces the number of requests compared to short polling and provides more real-time updates.
          </p>
          
        </div>
        
        <div className="protocol">
          <h2>
            <Link to="/calculator/web-socket">WebSockets</Link>
          </h2>
          <p>
            WebSockets provide a full-duplex communication channel over a single, long-lived connection. 
            This allows for real-time, bidirectional communication between the client and server, making it highly efficient for scenarios requiring frequent updates.
          </p>
         
        </div>
      </div>
    </div>
  );
};

export default HomePage;
