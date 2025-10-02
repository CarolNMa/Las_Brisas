import React, { useState } from 'react';
import PivotTable from './PivotTable';

export default function InteractivePivotTable({
    data,
    availableDimensions,
    title,
    defaultRowDimension,
    defaultColDimension
}) {
    const [rowDimension, setRowDimension] = useState(defaultRowDimension);
    const [colDimension, setColDimension] = useState(defaultColDimension);

    const rowOptions = availableDimensions.filter(dim => dim.key !== colDimension);
    const colOptions = availableDimensions.filter(dim => dim.key !== rowDimension);

    return (
        <div>
            <div style={{ marginBottom: 20, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0 }}>{title}</h3>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <label>
                        Filas:
                        <select
                            value={rowDimension}
                            onChange={e => setRowDimension(e.target.value)}
                            style={{
                                marginLeft: 5,
                                padding: '4px 8px',
                                border: '1px solid #ccc',
                                borderRadius: 4,
                                backgroundColor: '#fff'
                            }}
                        >
                            {rowOptions.map(dim => (
                                <option key={dim.key} value={dim.key}>{dim.label}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Columnas:
                        <select
                            value={colDimension}
                            onChange={e => setColDimension(e.target.value)}
                            style={{
                                marginLeft: 5,
                                padding: '4px 8px',
                                border: '1px solid #ccc',
                                borderRadius: 4,
                                backgroundColor: '#fff'
                            }}
                        >
                            {colOptions.map(dim => (
                                <option key={dim.key} value={dim.key}>{dim.label}</option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
            <PivotTable
                data={data}
                rowDimension={rowDimension}
                colDimension={colDimension}
                rowLabel={availableDimensions.find(d => d.key === rowDimension)?.label || rowDimension}
                colLabel={availableDimensions.find(d => d.key === colDimension)?.label || colDimension}
                valueLabel="Conteo"
            />
        </div>
    );
}