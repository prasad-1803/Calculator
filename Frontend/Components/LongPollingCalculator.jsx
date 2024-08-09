import React, { useState, useCallback } from 'react';

const LongPollingCalculator = () => {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState('');
    const [logs, setLogs] = useState([]);
    const [evaluationCount, setEvaluationCount] = useState(0);

    const fetchLogs = useCallback(async () => {
        console.log('Fetching logs...'); 
        try {
            
            const payload = {
                expression: inputValue,
                is_valid: result !== 'Invalid Expression',
                output: result !== 'Invalid Expression' ? parseFloat(result) : null
            };
    
            const response = await fetch('http://localhost:3000/api/logs/long-polling', {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
    
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
    
                buffer += decoder.decode(value, { stream: true });
                const logsArray = buffer.split('\n').filter(line => line.trim() !== '');
                logsArray.forEach(log => {
                    console.log('Raw log data:', log); 
                    try {
                        const parsedLog = JSON.parse(log);
                        console.log('Parsed log:', parsedLog); 
                        setLogs(prevLogs => [...prevLogs, parsedLog]);
                    } catch (e) {
                        console.error('Error parsing log:', e);
                    }
                });
    
                buffer = '';
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    }, [inputValue, result]);
    

    const evaluateExpression = (expression) => {
        if (!expression.trim()) {
            console.log('Empty expression detected');
            return 'Invalid Expression'; 
        }

        expression = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/%/g, '/100');

        const isValid = /^[\d+\-*/().\s]*$/.test(expression);
        const endsWithOperator = /[\d)]$/.test(expression);

        console.log('Evaluating expression:', expression); 

        if (isValid && endsWithOperator) {
            try {
                const result = eval(expression);
                if (isNaN(result) || !isFinite(result)) {
                    throw new Error('Invalid Result');
                }
                console.log('Evaluation result:', result); 
                return result;
            } catch (e) {
                console.error('Error during evaluation:', e);
                return 'Invalid Expression';
            }
        } else {
            console.log('Invalid expression format');
            return 'Invalid Expression';
        }
    };

    const handleButtonClick = async (buttonText) => {
        console.log('Button clicked:', buttonText); 

        if (buttonText === 'AC') {
            setInputValue('');
            setResult('');
        } else if (buttonText === '⌫') {
            const newValue = inputValue.slice(0, -1);
            setInputValue(newValue);
            const result = evaluateExpression(newValue);
            setResult(result);
        } else if (buttonText === '=') {
            const expression = inputValue
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/%/g, '/100');

            console.log('Final expression for evaluation:', expression); 

            const result = evaluateExpression(expression);

            if (result === 'Invalid Expression') {
                setResult('Invalid Expression');
                alert('Invalid Expression');
            } else {
                setInputValue(result.toString());
                setResult(result);

                setEvaluationCount(prevCount => {
                    const newCount = prevCount + 1;
                    if (newCount % 5 === 0) {
                        fetchLogs(); 
                    }
                    return newCount;
                });
            }
        } else {
            setInputValue(prevInput => prevInput + buttonText);
        }
    };

    return (
        <div>
            <h1>Calculator with Long Polling</h1>
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

export default LongPollingCalculator;
