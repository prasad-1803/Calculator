import React, { useState, useEffect, useRef } from 'react';
import { FaFilter } from "react-icons/fa";
import { SlArrowRight } from "react-icons/sl";
import { SlArrowLeft } from "react-icons/sl";
import { RiDeleteBin6Line } from "react-icons/ri";
import '../styles/Calculator.css';
import LogsTable from './LogsTable';


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

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token'); // Get the token from local storage or any other method you use
            const response = await fetch('http://localhost:3000/api/logs', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.ok) {
                const logsData = await response.json();
                setLogs(logsData || logs);
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
            setInputValue('');  // Clears the input field
            setResult('');      // Clears the result field
        }else if (buttonText === '⌫') {
            // Remove the last character from inputValue
            const updatedValue = inputValue.slice(0, -1);
            setInputValue(updatedValue);
            setResult(evaluateExpression(updatedValue));}
       else if (buttonText === '=') {
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
                    const token = localStorage.getItem('token');
                    const profile = localStorage.getItem('user');
                    const decodedProfile = atob(profile);
                    
                   
                    const profileData = JSON.parse(decodedProfile);
                    
                    const userId = profileData.id; // Retrieve the user ID
                    await fetch('http://localhost:3000/api/logs', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ 
                            expression, 
                            is_valid: result !== 'Invalid Expression', 
                            output: result,
                            userId // Include user ID in the body
                        })
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
            const token = localStorage.getItem('token'); // Get the token
            const response = await fetch('http://localhost:3000/api/logs', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the token
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
    

    const filteredLogs = Array.isArray(logs) ? logs.filter(log=>{
        if (!filter.column || !filter.value) return true;

        const logValue = log[filter.column];

        if (filter.column === 'is_valid') {
            return logValue === (filter.value.toLowerCase() === 'yes');
        }

        return logValue && logValue.toString().toLowerCase().includes(filter.value.toLowerCase());
    }):[];

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
           <div>
           <LogsTable
          logs={logs}
          selectedLogs={selectedLogs}
          setSelectedLogs={setSelectedLogs}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          filter={filter}
          setFilter={setFilter}
          fetchLogs={fetchLogs}
          handleDelete={handleDelete}
          searchBoxVisible={searchBoxVisible}
          setSearchBoxVisible={setSearchBoxVisible}
          searchBoxPosition={searchBoxPosition}
          filterRef={filterRef}
          handleFilterIconClick={handleFilterIconClick}
          handleSearchSubmit={handleSearchSubmit}
          handleSearchReset={handleSearchReset}
          handleFilterChange={handleFilterChange}
          searchValue={searchValue}
          activeColumn={activeColumn}
          setSearchValue={setSearchValue}
        />
           </div>
        </div>
    );
};

export default Calculator;
