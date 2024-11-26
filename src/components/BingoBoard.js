import React, { useState } from 'react';
import './BingoBoard.css'; // Crea un archivo CSS para personalizar estilos.

const BingoBoard = ({ card }) => {
    const [markedNumbers, setMarkedNumbers] = useState(new Set());

    const toggleNumber = (number) => {
        setMarkedNumbers((prev) => {
            const updated = new Set(prev);
            if (updated.has(number)) {
                updated.delete(number);
            } else {
                updated.add(number);
            }
            return updated;
        });
    };

    return (
        <div>
            <h2>Tu Tarjetón</h2>
            <table>
                <thead>
                <tr>
                    <th>B</th>
                    <th>I</th>
                    <th>N</th>
                    <th>G</th>
                    <th>O</th>
                </tr>
                </thead>
                <tbody>
                {card.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <td
                                key={cellIndex}
                                className={markedNumbers.has(cell) ? 'marked' : ''}
                                onClick={() => toggleNumber(cell)}
                            >
                                {cell === 0 ? '★' : cell} {/* Espacio libre */}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default BingoBoard;

