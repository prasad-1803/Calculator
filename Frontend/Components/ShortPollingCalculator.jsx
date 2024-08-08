import React, { useState, useEffect } from 'react';
import './Normal.css'; // Make sure this includes styles for both calculator and logs

const ShortPollingCalculator = () => {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState('');
    const [logs, setLogs] = useState([]);

    // Fetch logs from the server
    const fetchLogs = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/getlogs', {
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

    useEffect(() => {
        // Fetch logs initially
        fetchLogs();

        // Set up polling interval
        const intervalId = setInterval(() => {
            fetchLogs();
        }, 5000); // Poll every 5 seconds

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const evaluateExpression = (expression) => {
        expression = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/%/g, '/100');

        const isValid = /^[\d+\-*/().\s]*$/.test(expression);
        const endsWithOperator = /[\d)]$/.test(expression);

        if (isValid && endsWithOperator && expression.length > 0) {
            try {
                const result = eval(expression);
                if (isNaN(result) || !isFinite(result)) {
                    throw new Error('Invalid Result');
                }
                return result;
            } catch (e) {
                return 'Invalid Expression';
            }
        } else {
            return 'Invalid Expression';
        }
    };

    const handleInput = (buttonText) => {
        let currentValue = inputValue;
        const operatorRegex = /[\+\-×÷]/;
        currentValue = currentValue.replace(/([+\-×÷]){2,}/g, '$1');

        if (['+', '-', '×', '÷'].includes(buttonText)) {
            if (operatorRegex.test(currentValue.slice(-1))) {
                setInputValue(currentValue.slice(0, -1) + buttonText);
            } else {
                setInputValue(currentValue + buttonText);
            }
        } else {
            setInputValue(currentValue + buttonText);
        }

        const result = evaluateExpression(inputValue + buttonText);
        setResult(result);
    };

    const sendLog = async (expression, isValid, output) => {
        if (!expression) {
            alert('Expression is empty');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ expression, is_valid: isValid, output })
            });
            if (!response.ok) {
                const result = await response.json();
                alert(result.message);
            }
            // No need to fetch logs here, polling will handle it
        } catch (error) {
            console.error('Error sending log:', error);
        }
    };

    const handleButtonClick = async (buttonText) => {
        if (buttonText === 'AC') {
            setInputValue('');
            setResult('');
        } else if (buttonText === '⌫') {
            setInputValue(inputValue.slice(0, -1));
            const result = evaluateExpression(inputValue.slice(0, -1));
            setResult(result);
        } else if (buttonText === '=') {
            const expression = inputValue
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/%/g, '/100');

            const result = evaluateExpression(expression);

            if (result === 'Invalid Expression') {
                setResult('Invalid Expression');
                await sendLog(expression, false, null);
                alert('Invalid Expression');
            } else {
                setInputValue(result);
                setResult(result);
                await sendLog(expression, true, result);
            }
        } else {
            handleInput(buttonText);
        }
    };

    return (
        <div>
            <h1>This is a Calculator with Short Polling</h1>
            <div className="container">
                <div className="calculator">
                    <div className="calculator__display">
                        <div className="calculator__content">
                            <input
                                type="text"
                                className="calculator__input"
                                value={inputValue}
                                readOnly
                            />
                            <div className="calculator__output">{result}</div>
                        </div>
                    </div>
                    <div className="calculator__keys">
                        {['AC', '%', '⌫', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '00', '0', '.', '='].map(key => (
                            <button
                                key={key}
                                className={`calculator__key ${key === '=' ? 'calculator__key--equals' : ''}`}
                                onClick={() => handleButtonClick(key)}
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="logs">
                    <table className="logs__table">
                        <thead className="logs__table-head">
                            <tr>
                                <th>ID</th>
                                <th>Expression</th>
                                <th>Valid</th>
                                <th>Output</th>
                                <th>Created On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id}>
                                    <td>{log.id}</td>
                                    <td>{log.expression}</td>
                                    <td>{log.is_valid ? 'Yes' : 'No'}</td>
                                    <td>{log.output || 'N/A'}</td>
                                    <td>{new Date(log.created_on).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShortPollingCalculator;
