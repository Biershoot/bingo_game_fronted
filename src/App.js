import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Lobby from './components/Lobby';
import Notifications from './components/Notifications';
import GameControls from './components/GameControls';
import BingoBoard from './components/BingoBoard';
import { connectWebSocket, disconnectWebSocket } from './WebSocketClient';

const App = () => {
  const [player, setPlayer] = useState(null); // Player login state
  const [gameId, setGameId] = useState(null); // Active game ID
  const [card, setCard] = useState([
    [5, 18, 42, 60, 75],
    [1, 19, 35, 55, 70],
    [2, 25, 0, 65, 71], // "0" represents a free space
    [10, 30, 45, 50, 67],
    [4, 16, 38, 53, 66],
  ]);
  const [markedNumbers, setMarkedNumbers] = useState(new Set()); // Numbers marked by the player
  const [notifications, setNotifications] = useState([]); // Notifications for the user

  // Handlers for WebSocket events
  const handleBallDrawn = (message) => {
    setNotifications((prev) => [...prev, `Balota extraída: ${message}`]);
    setMarkedNumbers((prev) => new Set(prev).add(parseInt(message)));
  };

  const handleGameEnded = (message) => {
    setNotifications((prev) => [...prev, `Notificación: ${message}`]);
  };

  // Start a new game
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

  // Join the game lobby
  const joinGame = async () => {
    try {
      const response = await fetch(`http://localhost:8080/game/${gameId}/join?playerId=${player}`, {
        method: 'POST',
      });
      if (response.ok) {
        const result = await response.text();
        setNotifications((prev) => [...prev, result]);
      } else {
        console.error('Error al unirse al juego:', response.statusText);
      }
    } catch (error) {
      console.error('Error al unirse al juego:', error);
    }
  };

  // Validate Bingo
  const validateBingo = () => {
    const isBingo = card.some((row) =>
        row.every((number) => markedNumbers.has(number) || number === 0)
    );

    if (isBingo) {
      setNotifications((prev) => [...prev, '¡Bingo válido!']);
      declareBingo();
    } else {
      setNotifications((prev) => [...prev, '¡Bingo inválido!']);
    }
  };

  // Declare Bingo to the backend
  const declareBingo = async () => {
    try {
      const response = await fetch(`http://localhost:8080/game/${gameId}/bingo`, {
        method: 'POST',
        body: JSON.stringify({ player }),
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

  // WebSocket connection management
  useEffect(() => {
    connectWebSocket(handleBallDrawn, handleGameEnded);

    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
      <div>
        {!player ? (
            // Login Component
            <Login setPlayer={setPlayer} />
        ) : !gameId ? (
            // Lobby Component
            <Lobby gameId={gameId} player={player} joinGame={joinGame} />
        ) : (
            // Game UI
            <>
              <h1>Bingo en Línea</h1>
              <GameControls startGame={startGame} />
              <button onClick={joinGame} disabled={!gameId}>
                Unirse al Juego
              </button>
              <BingoBoard card={card} />
              <button onClick={validateBingo}>Validar Bingo</button>
              <Notifications notifications={notifications} />
            </>
        )}
      </div>
  );
};

export default App;




