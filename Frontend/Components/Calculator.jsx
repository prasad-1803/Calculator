import React, { useState } from 'react';
import './Calculator.css'; 

const Calculator = ({ fetchLogs }) => {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState('');

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
            const response = await fetch('http://localhost:3000/api/logs', {
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
            fetchLogs(); // Fetch logs after sending
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
    );
};

export default Calculator;
