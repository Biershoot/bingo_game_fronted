import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';

const Lobby = ({ gameId, playerId }) => {
    const [players, setPlayers] = useState([]);
    const [timer, setTimer] = useState(60); // Countdown timer in seconds
    const [client, setClient] = useState(null);

    // Function to join the lobby
    const joinLobby = async () => {
        try {
            const response = await fetch(`http://localhost:8080/game/${gameId}/join?playerId=${playerId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${btoa(`${playerId}:password`)}`, // Basic Auth
                },
            });

            if (response.ok) {
                const result = await response.text();
                alert(result); // Show a message confirming the player joined the lobby
            } else {
                alert('Error al unirse al lobby');
            }
        } catch (error) {
            console.error('Error al unirse al lobby:', error);
        }
    };

    // Countdown timer logic
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    // WebSocket setup to listen for lobby updates
    useEffect(() => {
        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/bingo-websocket',
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
            onConnect: () => {
                stompClient.subscribe(`/topic/lobby`, (message) => {
                    setPlayers((prevPlayers) => [...prevPlayers, message.body]);
                });
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => stompClient.deactivate();
    }, []);

    return (
        <div>
            <h1>Lobby del Juego</h1>
            <p>Tiempo restante para iniciar: {timer} segundos</p>
            <button onClick={joinLobby}>Unirse al Lobby</button>
            <h2>Jugadores en el Lobby:</h2>
            <ul>
                {players.map((player, index) => (
                    <li key={index}>{player}</li>
                ))}
            </ul>
        </div>
    );
};

export default Lobby;
