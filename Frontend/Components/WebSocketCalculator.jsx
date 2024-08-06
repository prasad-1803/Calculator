import React, { useState, useEffect } from 'react';
import './Normal.css'; // Ensure this includes styles for both calculator and logs

const WebSocketCalculator = () => {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState('');
    const [logs, setLogs] = useState([]);
    const ws = React.useRef(null);

    // Set up WebSocket connection
    useEffect(() => {
        // Initialize WebSocket connection
        ws.current = new WebSocket('ws://localhost:3000/ws');

        // Handle WebSocket open event
        ws.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        // Handle incoming messages from WebSocket
        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === 'NEW_LOG') {
                // Log the incoming message for debugging
                console.log('New log received:', message.data);

                // Update logs state with new log
                setLogs((prevLogs) => {
                    const updatedLogs = [message.data, ...prevLogs];
                    console.log('Updated logs:', updatedLogs); // Log the updated logs state
                    return updatedLogs;
                });
            }
        };

        // Handle WebSocket error event
        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Handle WebSocket close event
        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        // Clean up WebSocket connection on component unmount
        return () => {
            ws.current.close();
        };
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

    const sendLog = (expression, isValid, output) => {
        if (!expression) {
            alert('Expression is empty');
            return;
        }
        const logMessage = JSON.stringify({
            type: 'log',
            expression,
            is_valid: isValid,
            output
        });

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(logMessage);
        } else {
            console.error('WebSocket is not connected');
        }
    };

    const handleButtonClick = (buttonText) => {
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
                sendLog(expression, false, null);
                alert('Invalid Expression');
            } else {
                setInputValue(result);
                setResult(result);
                sendLog(expression, true, result);
            }
        } else {
            handleInput(buttonText);
        }
    };

    return (
        <div>
            <h1>This is the calculator with WebSocket</h1>
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

export default WebSocketCalculator;
