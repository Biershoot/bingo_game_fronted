import React, { useState } from 'react';

const Login = ({ setPlayer }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST', // Ensure your backend expects POST
                headers: {
                    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
                },
            });

            if (response.ok) {
                setPlayer(username); // Save the logged-in user to state
                alert('Inicio de sesión exitoso');
            } else if (response.status === 401) {
                alert('Credenciales inválidas');
            } else {
                alert('Error en el inicio de sesión');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('No se pudo conectar con el servidor');
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Ingresar</button>
        </div>
    );
};

export default Login;

