// src/pages/GameSelection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import flingoImage from '../assets//flingo_banner.png';
import '../styles/game-selection.css';

const GameSelection = () => {
  const navigate = useNavigate();

  const games = [
    { name: 'Flingo',
      path: '/game/flingo', 
      description: 'Predict colors and numbers to win!', 
      image: flingoImage, 
      alt: 'Flingo game preview',
    },
    // Add more games here as needed
    { name: 'Game 2', path: '/game/game2', description: 'Coming soon!' },
    { name: 'Game 3', path: '/game/game3', description: 'Coming soon!' },
  ];

  return (
    <div className="game-selection-page container">
      <Header />
      <h1>Choose a Game</h1>
      <div className="game-grid">
        {games.map((game) => (
          <div
            key={game.name}
            className="game-card"
            onClick={() => navigate(game.path)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && navigate(game.path)}
            aria-label={`Play ${game.name}`}
          >
            <img src={game.image} alt={game.alt} className="game-image" />
            <h2>{game.name}</h2>
            <p>{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSelection;
