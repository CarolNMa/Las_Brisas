import React from 'react';

export default function PivotTable({
    data,
    rowDimension,
    colDimension,
    valueFunction = (items) => items.length,
    rowLabel = rowDimension,
    colLabel = colDimension,
    valueLabel = 'Valor'
}) {
    // Get unique values for rows and columns
    const rowValues = [...new Set(data.map(item => item[rowDimension]))].sort();
    const colValues = [...new Set(data.map(item => item[colDimension]))].sort();

    // Create pivot data
    const pivotData = {};
    rowValues.forEach(row => {
        pivotData[row] = {};
        colValues.forEach(col => {
            const filtered = data.filter(item =>
                item[rowDimension] === row && item[colDimension] === col
            );
            pivotData[row][col] = valueFunction(filtered);
        });
    });

    // Calculate totals
    const rowTotals = {};
    const colTotals = {};
    rowValues.forEach(row => {
        rowTotals[row] = colValues.reduce((sum, col) => sum + (pivotData[row][col] || 0), 0);
    });
    colValues.forEach(col => {
        colTotals[col] = rowValues.reduce((sum, row) => sum + (pivotData[row][col] || 0), 0);
    });
    const grandTotal = rowValues.reduce((sum, row) => sum + (rowTotals[row] || 0), 0);

    return (
        <div style={{ overflowX: 'auto', marginTop: 20 }}>
            <table style={{
                borderCollapse: 'collapse',
                width: '100%',
                fontSize: '14px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <thead>
                    <tr>
                        <th style={{
                            padding: '12px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            fontWeight: 'bold',
                            textAlign: 'left'
                        }}>
                            {rowLabel} / {colLabel}
                        </th>
                        {colValues.map(col => (
                            <th key={col} style={{
                                padding: '12px',
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #dee2e6',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}>
                                {col}
                            </th>
                        ))}
                        <th style={{
                            padding: '12px',
                            backgroundColor: '#e9ecef',
                            border: '1px solid #dee2e6',
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}>
                            Total
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rowValues.map(row => (
                        <tr key={row}>
                            <td style={{
                                padding: '12px',
                                border: '1px solid #dee2e6',
                                fontWeight: 'bold',
                                backgroundColor: '#f8f9fa'
                            }}>
                                {row}
                            </td>
                            {colValues.map(col => (
                                <td key={col} style={{
                                    padding: '12px',
                                    border: '1px solid #dee2e6',
                                    textAlign: 'center',
                                    backgroundColor: pivotData[row][col] > 0 ? '#fff' : '#f8f9fa'
                                }}>
                                    {pivotData[row][col] || 0}
                                </td>
                            ))}
                            <td style={{
                                padding: '12px',
                                border: '1px solid #dee2e6',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                backgroundColor: '#e9ecef'
                            }}>
                                {rowTotals[row]}
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td style={{
                            padding: '12px',
                            border: '1px solid #dee2e6',
                            fontWeight: 'bold',
                            backgroundColor: '#e9ecef',
                            textAlign: 'center'
                        }}>
                            Total
                        </td>
                        {colValues.map(col => (
                            <td key={col} style={{
                                padding: '12px',
                                border: '1px solid #dee2e6',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                backgroundColor: '#e9ecef'
                            }}>
                                {colTotals[col]}
                            </td>
                        ))}
                        <td style={{
                            padding: '12px',
                            border: '1px solid #dee2e6',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            backgroundColor: '#dee2e6'
                        }}>
                            {grandTotal}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}