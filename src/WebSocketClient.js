import { Client } from '@stomp/stompjs';

const client = new Client({
    brokerURL: 'ws://localhost:8080/bingo-websocket', // Cambia la URL si es necesario
    reconnectDelay: 5000, // Reintentos de conexión
});

export const connectWebSocket = (onBallDrawn, onGameEnded) => {
    client.onConnect = () => {
        console.log('Conectado al servidor WebSocket');

        // Suscribirse a eventos de balotas extraídas
        client.subscribe('/topic/balls', (message) => {
            if (onBallDrawn) onBallDrawn(message.body);
        });

        // Suscribirse a eventos de fin de juego
        client.subscribe('/topic/game', (message) => {
            if (onGameEnded) onGameEnded(message.body);
        });
    };

    client.activate();
};

export const disconnectWebSocket = () => {
    if (client.connected) {
        client.deactivate();
        console.log('Desconectado del servidor WebSocket');
    }
};
