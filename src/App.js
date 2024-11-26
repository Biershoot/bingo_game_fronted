import React, { useEffect, useState } from 'react';
import Notifications from './components/Notifications';
import GameControls from './components/GameControls';
import BingoBoard from './components/BingoBoard';
import { connectWebSocket, disconnectWebSocket } from './WebSocketClient';

const App = () => {
  const [card, setCard] = useState([
    [5, 18, 42, 60, 75],
    [1, 19, 35, 55, 70],
    [2, 25, 0, 65, 71], // "0" represents a free space
    [10, 30, 45, 50, 67],
    [4, 16, 38, 53, 66],
  ]);
  const [markedNumbers, setMarkedNumbers] = useState(new Set()); // Numbers marked by the player
  const [notifications, setNotifications] = useState([]);
  const [gameId, setGameId] = useState(null); // ID of the active game
  const [playerId, setPlayerId] = useState(1); // Example player ID (adjust as needed)

  const handleBallDrawn = (message) => {
    setNotifications((prev) => [...prev, `Balota extraída: ${message}`]);
    setMarkedNumbers((prev) => new Set(prev).add(parseInt(message)));
  };

  const handleGameEnded = (message) => {
    setNotifications((prev) => [...prev, `Notificación: ${message}`]);
  };

  const startGame = async () => {
    try {
      const response = await fetch('http://localhost:8080/game/start', { method: 'POST' });
      if (response.ok) {
        const result = await response.json();
        setGameId(result.id); // Save the game ID
        setNotifications((prev) => [...prev, 'Juego iniciado.']);
      } else {
        console.error('Error al iniciar el juego:', response.statusText);
      }
    } catch (error) {
      console.error('Error al iniciar el juego:', error);
    }
  };

  const endGame = async () => {
    try {
      const response = await fetch(`http://localhost:8080/game/${gameId}/end`, { method: 'POST' });
      if (response.ok) {
        setNotifications((prev) => [...prev, 'Juego finalizado.']);
      } else {
        console.error('Error al finalizar el juego:', response.statusText);
      }
    } catch (error) {
      console.error('Error al finalizar el juego:', error);
    }
  };

  const validateBingo = () => {
    const isBingo = card.some((row) =>
        row.every((number) => markedNumbers.has(number) || number === 0) // "0" is the free space
    );

    if (isBingo) {
      setNotifications((prev) => [...prev, '¡Bingo válido!']);
      declareBingo();
    } else {
      setNotifications((prev) => [...prev, '¡Bingo inválido!']);
    }
  };

  const declareBingo = async () => {
    try {
      const response = await fetch(`http://localhost:8080/game/${gameId}/bingo`, {
        method: 'POST',
        body: JSON.stringify({ playerId }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const result = await response.json();
        setNotifications((prev) => [...prev, result.message]);
      } else {
        setNotifications((prev) => [...prev, 'Error al declarar Bingo.']);
      }
    } catch (error) {
      console.error('Error al declarar Bingo:', error);
    }
  };

  useEffect(() => {
    connectWebSocket(handleBallDrawn, handleGameEnded);

    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
      <div>
        <h1>Bingo en Línea</h1>
        <GameControls startGame={startGame} endGame={endGame} />
        <BingoBoard card={card} />
        <button onClick={validateBingo}>Validar Bingo</button>
        <Notifications notifications={notifications} />
      </div>
  );
};

export default App;


