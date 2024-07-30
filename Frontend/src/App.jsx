import React, { useState, useEffect } from 'react';
import Calculator from '../Components/Calculator.jsx';
import LogTable from '../Components/Logtable.jsx';
import './App.css';

const App = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/logs', {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const logs = await response.json();
            setLogs(logs);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    return (
        <div className="container">
            <Calculator fetchLogs={fetchLogs} />
            <LogTable logs={logs} />
        </div>
    );
};

export default App;
