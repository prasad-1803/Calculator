import React, { useState, useEffect, useRef } from 'react';
import './Calculator.css';

const Calculator = () => {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState('');
    const [logs, setLogs] = useState([]);
    const [selectedLogs, setSelectedLogs] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [filter, setFilter] = useState({ column: '', value: '' });
    const [inputVisibility, setInputVisibility] = useState({}); // To manage filter input visibility
    const filterRef = useRef(null);

    // Fetch logs from the server
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

    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setInputVisibility({});
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
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

    const handleSelectAll = (event) => {
        const checked = event.target.checked;
        if (checked) {
            setSelectedLogs(new Set(logs.map(log => log.id)));
        } else {
            setSelectedLogs(new Set());
        }
    };

    const handleRowSelect = (id) => {
        setSelectedLogs(prev => {
            const updated = new Set(prev);
            if (updated.has(id)) {
                updated.delete(id);
            } else {
                updated.add(id);
            }
            return updated;
        });
    };

    const handleFilterChange = (column) => (event) => {
        setFilter({ column, value: event.target.value });
    };

    const handleFilterIconClick = (column) => {
        setInputVisibility(prev => ({
            ...prev,
            [column]: !prev[column] // Toggle visibility
        }));
    };

    const handleFilterInputBlur = () => {
        setInputVisibility({});
    };

    const filteredLogs = logs.filter(log => {
        if (!filter.column || !filter.value) return true;
        const logValue = log[filter.column];
        return logValue && logValue.toString().toLowerCase().includes(filter.value.toLowerCase());
    });

    const indexOfLastLog = currentPage * rowsPerPage;
    const indexOfFirstLog = indexOfLastLog - rowsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
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
            <div className="logs" ref={filterRef}>
                <table className="logs__table">
                    <thead className="logs__table-head">
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={filteredLogs.length > 0 && selectedLogs.size === filteredLogs.length}
                                />
                            </th>
                            <th>
                                ID
                                <span className="filter-icon" onClick={() => handleFilterIconClick('id')}>🔍</span>
                                {inputVisibility['id'] && (
                                    <input
                                        type="text"
                                        className="filter-input"
                                        placeholder="Filter ID"
                                        value={filter.column === 'id' ? filter.value : ''}
                                        onChange={handleFilterChange('id')}
                                        onBlur={handleFilterInputBlur}
                                    />
                                )}
                            </th>
                            <th>
                                Expression
                                <span className="filter-icon" onClick={() => handleFilterIconClick('expression')}>🔍</span>
                                {inputVisibility['expression'] && (
                                    <input
                                        type="text"
                                        className="filter-input"
                                        placeholder="Filter Expression"
                                        value={filter.column === 'expression' ? filter.value : ''}
                                        onChange={handleFilterChange('expression')}
                                        onBlur={handleFilterInputBlur}
                                    />
                                )}
                            </th>
                            <th>
                                Valid
                                <span className="filter-icon" onClick={() => handleFilterIconClick('is_valid')}>🔍</span>
                                {inputVisibility['is_valid'] && (
                                    <input
                                        type="text"
                                        className="filter-input"
                                        placeholder="Filter Valid"
                                        value={filter.column === 'is_valid' ? filter.value : ''}
                                        onChange={handleFilterChange('is_valid')}
                                        onBlur={handleFilterInputBlur}
                                    />
                                )}
                            </th>
                            <th>
                                Output
                                <span className="filter-icon" onClick={() => handleFilterIconClick('output')}>🔍</span>
                                {inputVisibility['output'] && (
                                    <input
                                        type="text"
                                        className="filter-input"
                                        placeholder="Filter Output"
                                        value={filter.column === 'output' ? filter.value : ''}
                                        onChange={handleFilterChange('output')}
                                        onBlur={handleFilterInputBlur}
                                    />
                                )}
                            </th>
                            <th>
                                Created On
                                <span className="filter-icon" onClick={() => handleFilterIconClick('created_on')}>🔍</span>
                                {inputVisibility['created_on'] && (
                                    <input
                                        type="text"
                                        className="filter-input"
                                        placeholder="Filter Created On"
                                        value={filter.column === 'created_on' ? filter.value : ''}
                                        onChange={handleFilterChange('created_on')}
                                        onBlur={handleFilterInputBlur}
                                    />
                                )}
                            </th>
                        </tr>
                    </thead>


                    <tbody className="logs__table-body">
    {currentLogs.map((log) => (
        <tr
            key={log.id}
            className={selectedLogs.has(log.id) ? 'selected' : ''}
            onClick={() => handleRowSelect(log.id)}
        >
            <td>
                <input
                    type="checkbox"
                    checked={selectedLogs.has(log.id)}
                    readOnly
                />
            </td>
            <td>{log.id}</td>
            <td>{log.expression}</td>
            <td>{log.is_valid ? 'Yes' : 'No'}</td>
            <td>{log.output || "N/A"}</td>
            <td>{new Date(log.created_on).toLocaleString()}</td>
        </tr>
    ))}
</tbody>

                </table>
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`pagination__button ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calculator;
