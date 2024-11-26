const GameControls = ({ startGame, endGame, validateBingo }) => {
    return (
        <div>
            <h2>Controles del Juego</h2>
            <button onClick={startGame}>Iniciar Juego</button>
            <button onClick={endGame}>Finalizar Juego</button>
            <button onClick={validateBingo}>Declarar Bingo</button>
        </div>
    );
};

export default GameControls;

