import React from 'react';
import './Logs.css'; 

const LogTable = ({ logs }) => {
    return (
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
    );
};

export default LogTable;
