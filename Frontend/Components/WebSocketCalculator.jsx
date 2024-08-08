import React, { useState, useEffect, useRef } from 'react';
import './Normal.css';

const WebSocketCalculator = () => {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState('');
    const [logs, setLogs] = useState([]);
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:3000');
      
        ws.current.onopen = () => {
          console.log('WebSocket connection established');
        };
      
        ws.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log('Raw WebSocket message:', event.data);
      
            if (message.type === 'LATEST_LOGS') {
              console.log('New log received:', message.data);
              setLogs(message.data);
            } else if (message.type === 'UPDATE') {
              // Handle real-time input changes from other clients
              if (message.data.inputValue !== undefined) {
                setInputValue(message.data.inputValue);
                setResult(message.data.result);
              }
            } else {
              console.warn('Unexpected message type:', message.type);
            }
          } catch (e) {
            console.error('Error parsing WebSocket message:', e);
          }
        };
      
        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      
        ws.current.onclose = () => {
          console.log('WebSocket connection closed');
        };
      
        return () => {
          if (ws.current) {
            ws.current.close();
          }
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

        if (typeof currentValue !== 'string') {
            currentValue = '';
        }

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

        const result = evaluateExpression(currentValue + buttonText);
        setResult(result);

        // Send real-time updates to the server
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                type: 'UPDATE',
                data: {
                    inputValue: currentValue + buttonText,
                    result
                }
            }));
        }
    };

    const handleButtonClick = (buttonText) => {
        const stringInputValue = String(inputValue); // Ensure it's a string
    
        if (buttonText === 'AC') {
            setInputValue('');
            setResult('');
            // Send real-time updates to the server
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({
                    type: 'UPDATE',
                    data: {
                        inputValue: '',
                        result: ''
                    }
                }));
            }
        } else if (buttonText === '⌫') {
            const updatedInput = stringInputValue.slice(0, -1);
            setInputValue(updatedInput);
            const result = evaluateExpression(updatedInput);
            setResult(result);

            // Send real-time updates to the server
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({
                    type: 'UPDATE',
                    data: {
                        inputValue: updatedInput,
                        result
                    }
                }));
            }
        } else if (buttonText === '=') {
            const expression = stringInputValue
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
                            {logs.length > 0 ? (
                                logs.map((log, index) => (
                                    <tr key={log.id || index}>
                                        <td>{log.id || index}</td>
                                        <td>{log.expression}</td>
                                        <td>{log.is_valid ? 'Yes' : 'No'}</td>
                                        <td>{log.output || 'N/A'}</td>
                                        <td>{new Date(log.created_on).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No logs available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WebSocketCalculator;
