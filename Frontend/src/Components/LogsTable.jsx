import React from 'react';
import { FaFilter } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import '../styles/LogsTable.css'; // Import the necessary styles

const LogsTable = ({
    logs,
    selectedLogs,
    setSelectedLogs,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    filter,
    setFilter,
    fetchLogs,
    handleDelete,
    searchBoxVisible,
    setSearchBoxVisible,
    searchBoxPosition,
    filterRef,
    handleFilterIconClick,
    handleSearchSubmit,
    handleSearchReset,
    handleFilterChange,
    searchValue,
    activeColumn,
    setSearchValue,
}) => {
    const totalPages = Math.ceil(logs.length / rowsPerPage);
    const filteredLogs = logs.filter(log => 
        filter.value ? log[filter.column]?.toString().toLowerCase().includes(filter.value.toLowerCase()) : true
    );

    const currentLogs = filteredLogs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleRowSelect = (id) => {
        const newSelectedLogs = new Set(selectedLogs);
        if (newSelectedLogs.has(id)) {
            newSelectedLogs.delete(id);
        } else {
            newSelectedLogs.add(id);
        }
        setSelectedLogs(newSelectedLogs);
    };

    const handleSelectAll = () => {
        if (selectedLogs.size === filteredLogs.length) {
            setSelectedLogs(new Set());
        } else {
            const allIds = new Set(filteredLogs.map(log => log.id));
            setSelectedLogs(allIds);
        }
    };

    return (
        <div className="logs">
            <div className='inline-container'>
                <h1>Calculator Logs Table:</h1>
                <button
                    className="delete-button"
                    onClick={handleDelete}
                    disabled={selectedLogs.size === 0}
                >
                    <RiDeleteBin6Line />
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
                <tbody className='logs__table-body'>
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
                            <td>{log.output === "invalid expression" ? "N/A" : log.output}</td>
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
                    <SlArrowRight />
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
                    <div className='search-box__buttons'>
                        <button onClick={handleSearchSubmit} className='search-box__button--submit search-box__button'>Submit</button>
                        <button onClick={handleSearchReset} className='search-box__button--reset search-box__button'>Reset</button>
                    </div>                   
                </div>
            )}
        </div>
    );
};

export default LogsTable;
