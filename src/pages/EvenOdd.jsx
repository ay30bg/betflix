// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import Header from '../components/header';
// import '../styles/even-odd.css';

// const multipliers = ["0x", "1x", "1.85x", "2.5x", "6.8x", "10x"];
// const degreesPerSegment = 360 / multipliers.length;

// export default function SpinningWheelGame() {
//   const [spinning, setSpinning] = useState(false);
//   const [angle, setAngle] = useState(0);
//   const [result, setResult] = useState(null);
//   const [stake, setStake] = useState(0);
//   const [payout, setPayout] = useState(null);

//   const handleSpin = () => {
//     if (!stake || spinning) return;

//     setSpinning(true);
//     const randomIndex = Math.floor(Math.random() * multipliers.length);
//     const spins = 6; // full spins before stopping
//     const newAngle = 360 * spins + (360 - randomIndex * degreesPerSegment);
//     setAngle(newAngle);

//     setTimeout(() => {
//       const multiplier = parseFloat(multipliers[randomIndex]);
//       setResult(multipliers[randomIndex]);
//       setPayout((stake * multiplier).toFixed(2));
//       setSpinning(false);
//     }, 4000);
//   };

//   return (
//   <div className="game-page">
//    <Header />
//     <div className="game-container">
//       <h1>🎡 Spinning Wheel Game</h1>
//       <div className="wheel-wrapper">
//         <motion.div
//           className="wheel"
//           animate={{ rotate: angle }}
//           transition={{ duration: 4, ease: "easeOut" }}
//         >
//           {multipliers.map((value, index) => (
//             <div
//               key={index}
//               className="segment"
//               style={{ transform: `rotate(${index * degreesPerSegment}deg)` }}
//             >
//               <span>{value}</span>
//             </div>
//           ))}
//         </motion.div>
//         <div className="pointer">▼</div>
//       </div>

//       <div className="controls">
//         <input
//           type="number"
//           placeholder="Enter stake"
//           value={stake}
//           onChange={(e) => setStake(parseFloat(e.target.value))}
//         />
//         <button onClick={handleSpin} disabled={spinning}>
//           {spinning ? "Spinning..." : "Spin"}
//         </button>
//       </div>

//       {result && (
//         <div className="result">
//           <h2>🎉 Result: {result}</h2>
//           <h3>Payout: ${payout}</h3>
//         </div>
//       )}
//     </div>
//   </div>
//   );
// }


import React, { useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";
import Header from "../components/header";
import "../styles/even-odd.css";

const multipliers = ["0x", "1x", "1.85x", "2.5x", "6.8x", "10x"];
const degreesPerSegment = 360 / multipliers.length;

export default function SpinningWheelGame() {
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState(null);
  const [stake, setStake] = useState(0);
  const [payout, setPayout] = useState(null);
  const [history, setHistory] = useState([]);

  const { width, height } = useWindowSize();
  const showConfetti = result && parseFloat(result) >= 2.5;

  const handleSpin = () => {
    if (!stake || spinning) return;

    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * multipliers.length);
    const spins = 6; // full spins before stopping
    const newAngle = 360 * spins + (360 - randomIndex * degreesPerSegment);
    setAngle(newAngle);

    setTimeout(() => {
      const multiplier = parseFloat(multipliers[randomIndex]);
      const spinResult = multipliers[randomIndex];
      const calculatedPayout = (stake * multiplier).toFixed(2);

      setResult(spinResult);
      setPayout(calculatedPayout);
      setHistory((prev) => [
        { stake, result: spinResult, payout: calculatedPayout },
        ...prev,
      ]);
      setSpinning(false);
    }, 4000);
  };

  return (
    <div className="game-page">
      <Header />

      {showConfetti && <Confetti width={width} height={height} />}

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
                style={{
                  transform: `rotate(${index * degreesPerSegment}deg)`,
                  background: index % 2 === 0 ? "#00ffff20" : "#00ffaa30",
                }}
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

        {history.length > 0 && (
          <div className="history">
            <h3>🎲 Spin History</h3>
            <ul>
              {history.slice(0, 5).map((entry, index) => (
                <li key={index}>
                  Stake: ${entry.stake} | Result: {entry.result} | Payout: ${entry.payout}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
