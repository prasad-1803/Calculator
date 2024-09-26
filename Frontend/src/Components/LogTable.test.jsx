
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import LogsTable from './LogsTable'; 
import dummyLogs from './MockData'; 

describe('LogsTable Component', () => {
    const setSelectedLogs = vi.fn();
    const handleDelete = vi.fn();
    const fetchLogs = vi.fn();
    const handleFilterIconClick = vi.fn();
    const handleSearchSubmit = vi.fn();
    const handleSearchReset = vi.fn();
    const handleFilterChange = vi.fn();
    const setSearchValue = vi.fn();

    beforeEach(() => {
        render(
            <LogsTable
                logs={dummyLogs}
                selectedLogs={new Set()}
                setSelectedLogs={setSelectedLogs}
                currentPage={1}
                setCurrentPage={vi.fn()}
                rowsPerPage={5}
                filter={{ value: '', column: '' }}
                setFilter={vi.fn()}
                fetchLogs={fetchLogs}
                handleDelete={handleDelete}
                searchBoxVisible={false}
                setSearchBoxVisible={vi.fn()}
                searchBoxPosition={{ top: 0, left: 0 }}
                filterRef={React.createRef()}
                handleFilterIconClick={handleFilterIconClick}
                handleSearchSubmit={handleSearchSubmit}
                handleSearchReset={handleSearchReset}
                handleFilterChange={handleFilterChange}
                searchValue={{}}
                activeColumn=""
                setSearchValue={setSearchValue}
            />
        );
    });

    test('renders table with logs', () => {
        expect(screen.getByText(/Calculator Logs Table/i)).toBeInTheDocument();
        expect(screen.getByText(/2 \+ 2/i)).toBeInTheDocument();
        expect(screen.getByText(/5 \* 3/i)).toBeInTheDocument();
        expect(screen.getByText(/invalid expression/i)).toBeInTheDocument();
    });

    test('allows selecting a log', () => {
        const checkbox = screen.getAllByRole('checkbox')[1]; 
        fireEvent.click(checkbox);
        expect(setSelectedLogs).toHaveBeenCalledWith(expect.any(Set));
    });

});
