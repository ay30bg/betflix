// src/pages/GameSelection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import flingoImage from '../assets/flingo_banner.png';
import evenImage from '../assets/even_odd_banner.png';
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
    
    { name: 'Even & Odd', 
     path: '/game/even-odd', 
     description: 'Coming soon!', 
     image: evenImage,
     alt: 'Even & Odd game preview',
    },
  ];

  return (
    <div className="game-selection-page container">
      <Header />
      <h1>Select Game</h1>
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
            data-image={game.image} // Pass image URL via data attribute
          >
            <span className="sr-only">{game.alt}</span>
            <h2>{game.name}</h2>
            <p>{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSelection;

