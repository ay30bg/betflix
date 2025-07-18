import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from '../components/header';
import '../styles/even-odd.css';

const multipliers = ["0x", "1x", "1.85x", "2.5x", "6.8x", "10x"];
const degreesPerSegment = 360 / multipliers.length;

export default function SpinningWheelGame() {
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState(null);
  const [stake, setStake] = useState(0);
  const [payout, setPayout] = useState(null);

  const handleSpin = () => {
    if (!stake || spinning) return;

    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * multipliers.length);
    const spins = 6; // full spins before stopping
    const newAngle = 360 * spins + (360 - randomIndex * degreesPerSegment);
    setAngle(newAngle);

    setTimeout(() => {
      const multiplier = parseFloat(multipliers[randomIndex]);
      setResult(multipliers[randomIndex]);
      setPayout((stake * multiplier).toFixed(2));
      setSpinning(false);
    }, 4000);
  };

  return (
  <div className="game-page">
   <Header />
    <div className="game-container">
      <h1>🎡 Spinning Wheel Game</h1>
      <div className="wheel-wrapper">
        <motion.div
          className="wheel"
          animate={{ rotate: angle }}
          transition={{ duration: 4, ease: "easeOut" }}
        >
          {multipliers.map((value, index) => (
            <div
              key={index}
              className="segment"
              style={{ transform: `rotate(${index * degreesPerSegment}deg)` }}
            >
              <span>{value}</span>
            </div>
          ))}
        </motion.div>
        <div className="pointer">▼</div>
      </div>

      <div className="controls">
        <input
          type="number"
          placeholder="Enter stake"
          value={stake}
          onChange={(e) => setStake(parseFloat(e.target.value))}
        />
        <button onClick={handleSpin} disabled={spinning}>
          {spinning ? "Spinning..." : "Spin"}
        </button>
      </div>

      {result && (
        <div className="result">
          <h2>🎉 Result: {result}</h2>
          <h3>Payout: ${payout}</h3>
        </div>
      )}
    </div>
  </div>
  );
}
