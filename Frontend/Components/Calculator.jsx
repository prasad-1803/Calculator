import React, { useState, useEffect, useRef } from 'react';
import { FaFilter } from "react-icons/fa";
import { SlArrowRight } from "react-icons/sl";
import { SlArrowLeft } from "react-icons/sl";
import { RiDeleteBin6Line } from "react-icons/ri";
import './Calculator.css';

const Calculator = () => {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState('');
    const [logs, setLogs] = useState([]);
    const [selectedLogs, setSelectedLogs] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [filter, setFilter] = useState({ column: '', value: '' });
    const [searchValue, setSearchValue] = useState({});
    const [searchBoxVisible, setSearchBoxVisible] = useState(false);
    const [searchBoxPosition, setSearchBoxPosition] = useState({ top: 0, left: 0 });
    const [activeColumn, setActiveColumn] = useState('');
    const filterRef = useRef(null);

    // Fetch logs from the server
    const fetchLogs = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/logs');
            if (response.ok) {
                const logsData = await response.json();
                setLogs(logsData);
            } else {
                console.error('Failed to fetch logs');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setSearchBoxVisible(false);
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

        try {
            const result = eval(expression);
            return isNaN(result) ? 'Invalid Expression' : result;
        } catch (e) {
            return 'Invalid Expression';
        }
    };

    const handleInput = (buttonText) => {
        let currentValue = inputValue;

        if (['+', '-', '×', '÷'].includes(buttonText)) {
            if (/[\+\-×÷]/.test(currentValue.slice(-1))) {
                setInputValue(currentValue.slice(0, -1) + buttonText);
            } else {
                setInputValue(currentValue + buttonText);
            }
        } else {
            setInputValue(currentValue + buttonText);
        }

        setResult(evaluateExpression(inputValue + buttonText));
    };

    const handleButtonClick = async (buttonText) => {
        if (buttonText === 'AC') {
            setInputValue('');
            setResult('');
        } else if (buttonText === '⌫') {
            setInputValue(inputValue.slice(0, -1));
            setResult(evaluateExpression(inputValue.slice(0, -1)));
        } else if (buttonText === '=') {
            const expression = inputValue
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/%/g, '/100');

            const result = evaluateExpression(expression);
            setInputValue(result);
            setResult(result);

            // Sending log
            if (expression) {
                try {
                    await fetch('http://localhost:3000/api/logs', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ expression, is_valid: result !== 'Invalid Expression', output: result })
                    });
                    fetchLogs(); // Refresh logs
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        } else {
            handleInput(buttonText);
        }
    };

    
    const handleSelectAll = (event) => {
        const checked = event.target.checked;
        setSelectedLogs(checked ? new Set(logs.map(log => log.id)) : new Set());
    };

    const handleRowSelect = (id) => {
        setSelectedLogs(prev => {
            const updated = new Set(prev);
            updated.has(id) ? updated.delete(id) : updated.add(id);
            return updated;
        });
    };

    const handleFilterIconClick = (event, column) => {
        const { top, left, height } = event.currentTarget.getBoundingClientRect();
        setSearchBoxPosition({ top: top + height + window.scrollY, left: left + window.scrollX });
        setActiveColumn(column);
        setSearchBoxVisible(prev => !prev);
    };

    const handleSearchSubmit = () => {
        setFilter({ column: activeColumn, value: searchValue[activeColumn] });
        setSearchBoxVisible(false);
    };

    const handleSearchReset = () => {
        setSearchValue(prev => ({ ...prev, [activeColumn]: '' }));
        setFilter({ column: activeColumn, value: '' });
        setSearchBoxVisible(false);
    };

    const handleFilterChange = (event) => {
        setSearchValue(prev => ({ ...prev, [activeColumn]: event.target.value }));
    };

    const handleDelete = async () => {
        const idsToDelete = Array.from(selectedLogs);

        if (idsToDelete.length === 0) return;

        try {
            const response = await fetch('http://localhost:3000/api/logs', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids: idsToDelete })
            });

            if (response.ok) {
                fetchLogs(); // Refresh logs after deletion
                setSelectedLogs(new Set()); // Clear selected logs
            } else {
                console.error('Failed to delete logs');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const filteredLogs = logs.filter(log => {
        if (!filter.column || !filter.value) return true;

        const logValue = log[filter.column];

        if (filter.column === 'is_valid') {
            return logValue === (filter.value.toLowerCase() === 'yes');
        }

        return logValue && logValue.toString().toLowerCase().includes(filter.value.toLowerCase());
    });

    const indexOfLastLog = currentPage * rowsPerPage;
    const indexOfFirstLog = indexOfLastLog - rowsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);

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
            <div className="logs">
             <div  className='inline-container'>
             <h1 >Calculator Logs Table :-</h1>
             <button
                    className="delete-button"
                    onClick={handleDelete}
                    disabled={selectedLogs.size === 0}
                >
                     <RiDeleteBin6Line/>
                </button>
             </div>
                <table className="logs__table">
                    <thead className="logs__table-head">
                        <tr>
                            <th>
                                <input
                                    className='checkbox'
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={filteredLogs.length > 0 && selectedLogs.size === filteredLogs.length}
                                />
                            </th>
                            {['id', 'expression', 'is_valid', 'output', 'created_on'].map(column => (
                                <th key={column}>
                                    {column.replace('_', ' ').toUpperCase()}
                                    <span 
                                        className="filter-icon"
                                        onClick={(event) => handleFilterIconClick(event, column)}
                                    >
                                        <FaFilter />
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className='logs__table-body '>
                        {currentLogs.map(log => (
                            <tr key={log.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedLogs.has(log.id)}
                                        onChange={() => handleRowSelect(log.id)}
                                    />
                                </td>
                                <td>{log.id}</td>
                                <td>{log.expression}</td>
                                <td>{log.is_valid ? 'Yes' : 'No'}</td>
                                <td>{log.output =="invalid expression"||"N/A"}</td>
                                <td>{new Date(log.created_on).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button
                        className='pagination__button'
                        onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <SlArrowLeft />
                    </button>
                    <span className='pagination__button'> {currentPage}</span>
                    <button
                        className='pagination__button'
                        onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <SlArrowRight/>
                    </button>
                </div>
                {searchBoxVisible && (
                    <div 
                        className="search-box"
                        style={{ top: searchBoxPosition.top, left: searchBoxPosition.left }}
                        ref={filterRef}
                    >
                        <input
                            className='search-box__input'
                            type="text"
                            value={searchValue[activeColumn] || ''}
                            onChange={handleFilterChange}
                            placeholder={`Search ${activeColumn}`}
                        />
                        <div className='search-box__buttons '>

                        <button onClick={handleSearchSubmit} className='search-box__button--submit search-box__button'  >Submit</button>
                       
                         <button onClick={handleSearchReset} className='search-box__button--reset search-box__button '  >Reset</button>
                        </div>                   
                    </div>
                )}
               
            </div>
        </div>
    );
};

export default Calculator;
