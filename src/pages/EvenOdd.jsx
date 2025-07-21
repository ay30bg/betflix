// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import Confetti from "react-confetti";
// import { useWindowSize } from "@uidotdev/usehooks";
// import Header from "../components/header";
// import "../styles/even-odd.css";

// const multipliers = ["0x", "1x", "1.85x", "2.5x", "6.8x", "10x", "54x"];
// const degreesPerSegment = 360 / multipliers.length;

// const colorfulSegmentColors = [
//   "#ff6b6b", "#6bc1ff", "#6bff95", "#f5c542", "#a66bff", "#ff8c42", "#42fff2"
// ];

// export default function SpinningWheelGame() {
//   const [spinning, setSpinning] = useState(false);
//   const [angle, setAngle] = useState(0);
//   const [result, setResult] = useState(null);
//   const [stake, setStake] = useState(0);
//   const [payout, setPayout] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [tempStake, setTempStake] = useState("");

//   const { width, height } = useWindowSize();
//   const showConfetti = result && parseFloat(result) >= 2.5;

//   useEffect(() => {
//     if (result) {
//       const timer = setTimeout(() => {
//         setResult(null);
//         setPayout(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [result]);

//   const handleSpinStart = () => {
//     setShowModal(true);
//     setTempStake("");
//   };

//   const confirmStakeAndSpin = () => {
//     const chosenStake = parseFloat(tempStake);
//     if (!chosenStake || chosenStake <= 0) return;
//     setStake(chosenStake);
//     setShowModal(false);
//     triggerSpin(chosenStake);
//   };

//   const triggerSpin = (stakeValue) => {
//     setSpinning(true);
//     const randomIndex = Math.floor(Math.random() * multipliers.length);
//     const spins = 6;
//     const newAngle = 360 * spins + (360 - randomIndex * degreesPerSegment);
//     setAngle(newAngle);

//     setTimeout(() => {
//       const multiplier = parseFloat(multipliers[randomIndex]);
//       const spinResult = multipliers[randomIndex];
//       const calculatedPayout = (stakeValue * multiplier).toFixed(2);

//       setResult(spinResult);
//       setPayout(calculatedPayout);
//       setHistory((prev) => [
//         { stake: stakeValue, result: spinResult, payout: calculatedPayout },
//         ...prev,
//       ]);
//       setSpinning(false);
//     }, 4000);
//   };

//   return (
//     <div className="game-page">
//       <Header />

//       {showConfetti && <Confetti width={width} height={height} />}

//       <div className="game-container">
//         <div className="wheel-wrapper">
//           <motion.div
//             className="wheel"
//             animate={{ rotate: angle }}
//             transition={{ duration: 4, ease: "easeOut" }}
//           >
//             {multipliers.map((value, index) => (
//               <div
//                 key={index}
//                 className="segment"
//                 style={{
//                   transform: `rotate(${index * degreesPerSegment}deg)`,
//                   background: colorfulSegmentColors[index % colorfulSegmentColors.length],
//                 }}
//               >
//                 <span>{value}</span>
//               </div>
//             ))}
//           </motion.div>
//           <div className="pointer">▼</div>
//         </div>

//         <div className="controls">
//           <button onClick={handleSpinStart} disabled={spinning} className="spin-btn">
//             {spinning ? "Spinning..." : "Spin"}
//           </button>
//         </div>

//         {result && (
//           <div className="result">
//             <h2>🎉 Result: {result}</h2>
//             <h3>Payout: ${payout}</h3>
//           </div>
//         )}
//       </div>

//       {history.length > 0 && (
//         <div className="history">
//           <h3>🎲 Spin History</h3>
//           <ul>
//             {history.slice(0, 5).map((entry, index) => (
//               <li key={index}>
//                 Stake: ${entry.stake} | Result: {entry.result} | Payout: ${entry.payout}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {showModal && (
//         <div className="modal-backdrop">
//           <div className="modal">
//             <h2>Enter Your Stake</h2>
//             <input
//               type="number"
//               placeholder="e.g. 100"
//               value={tempStake}
//               onChange={(e) => setTempStake(e.target.value)}
//             />
//             <div className="suggested-buttons">
//               {[100, 200, 500, 1000].map((val) => (
//                 <button key={val} onClick={() => setTempStake(val)}>{val}</button>
//               ))}
//             </div>
//             <div className="modal-actions">
//               <button className="confirm" onClick={confirmStakeAndSpin}>Confirm</button>
//               <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";
import Header from "../components/header";
import "../styles/even-odd.css";

const multipliers = ["0x", "1x", "1.85x", "2.5x", "6.8x", "10x", "54x"];
const degreesPerSegment = 360 / multipliers.length;

const colorfulSegmentColors = [
  "#ff6b6b", "#6bc1ff", "#6bff95", "#f5c542", "#a66bff", "#ff8c42", "#42fff2"
];

export default function SpinningWheelGame() {
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState(null);
  const [stake, setStake] = useState(0);
  const [payout, setPayout] = useState(null);
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tempStake, setTempStake] = useState("");

  const { width, height } = useWindowSize();
  const showConfetti = result && parseFloat(result) >= 2.5;

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult(null);
        setPayout(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleSpinStart = () => {
    setShowModal(true);
    setTempStake("");
  };

  const confirmStakeAndSpin = () => {
    const chosenStake = parseFloat(tempStake);
    if (!chosenStake || chosenStake <= 0) return;
    setStake(chosenStake);
    setShowModal(false);
    triggerSpin(chosenStake);
  };

  const triggerSpin = (stakeValue) => {
    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * multipliers.length);
    const spins = 6;
    const newAngle = 360 * spins + (360 - randomIndex * degreesPerSegment);
    setAngle(newAngle);

    setTimeout(() => {
      const multiplier = parseFloat(multipliers[randomIndex]);
      const spinResult = multipliers[randomIndex];
      const calculatedPayout = (stakeValue * multiplier).toFixed(2);

      setResult(spinResult);
      setPayout(calculatedPayout);
      setHistory((prev) => [
        { stake: stakeValue, result: spinResult, payout: calculatedPayout },
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
                  background: colorfulSegmentColors[index % colorfulSegmentColors.length],
                }}
              >
                <span>{value}</span>
              </div>
            ))}
          </motion.div>
          <div className="pointer">▼</div>
        </div>

        {/* Moved result here */}
        {result && (
          <div className="result">
            <h2>🎉 Result: {result}</h2>
            <h3>Payout: ${payout}</h3>
          </div>
        )}

        <div className="controls">
          <button onClick={handleSpinStart} disabled={spinning} className="spin-btn">
            {spinning ? "Spinning..." : "Spin"}
          </button>
        </div>
      </div>

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

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Enter Your Stake</h2>
            <input
              type="number"
              placeholder="e.g. 100"
              value={tempStake}
              onChange={(e) => setTempStake(e.target.value)}
            />
            <div className="suggested-buttons">
              {[100, 200, 500, 1000].map((val) => (
                <button key={val} onClick={() => setTempStake(val)}>{val}</button>
              ))}
            </div>
            <div className="modal-actions">
              <button className="confirm" onClick={confirmStakeAndSpin}>Confirm</button>
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

