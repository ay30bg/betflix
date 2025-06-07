// import { useState, useEffect } from 'react';
// import '../styles/game.css'; // Ensure this is imported if styles are in game.css

// function OnlineUsers() {
//   const [userCount, setUserCount] = useState(0);

//   useEffect(() => {
//     const updateUserCount = () => {
//       // Get current time in WAT (UTC+1)
//       const now = new Date();
//       // Adjust for WAT by adding 1 hour to UTC
//       const watHours = (now.getUTCHours() + 1) % 24;

//       let minUsers, maxUsers;
//       if (watHours >= 0 && watHours < 12) {
//         // Morning: 12 AM - 11 AM (50–100 users)
//         minUsers = 50;
//         maxUsers = 100;
//       } else if (watHours >= 12 && watHours < 16) {
//         // Afternoon: 12 PM - 4 PM (60–150 users)
//         minUsers = 60;
//         maxUsers = 150;
//       } else {
//         // Evening: 4 PM - 11:59 PM (70–200 users)
//         minUsers = 70;
//         maxUsers = 200;
//       }

//       // Generate random number of users within the range
//       const randomCount = Math.floor(Math.random() * (maxUsers - minUsers + 1)) + minUsers;
//       setUserCount(randomCount);
//     };

//     // Update user count immediately and every 30 seconds
//     updateUserCount();
//     const interval = setInterval(updateUserCount, 30000);

//     // Cleanup interval on component unmount
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="online-users">
//       <span role="status" aria-live="polite">
//         {userCount} users online
//       </span>
//     </div>
//   );
// }

// export default OnlineUsers;

import { useState, useEffect } from 'react';
import '../styles/game.css'; // Ensure this is imported if styles are in game.css

function OnlineUsers() {
  const [userCount, setUserCount] = useState(50); // Current displayed count
  const [targetCount, setTargetCount] = useState(50); // Target count to animate towards

  useEffect(() => {
    // Deterministic random number generator based on time
    const getSeededRandom = (seed) => {
      // Simple seeded random number generator (e.g., Linear Congruential Generator)
      let state = seed;
      return () => {
        state = (1664525 * state + 1013904223) % 4294967296; // LCG parameters
        return (state / 4294967296); // Normalize to [0,1)
      };
    };

    // Function to determine target user count based on time
    const getTargetUserCount = () => {
      const now = new Date();
      const watHours = (now.getUTCHours() + 1) % 24; // Adjust for WAT (UTC+1)
      // Use time-based seed (e.g., minutes since epoch floored to nearest 30 seconds)
      const seed = Math.floor(now.getTime() / 30000); // New seed every 30 seconds
      const seededRandom = getSeededRandom(seed);

      let minUsers, maxUsers;
      if (watHours >= 0 && watHours < 12) {
        // Morning: 12 AM - 11 AM (50–100 users)
        minUsers = 50;
        maxUsers = 100;
      } else if (watHours >= 12 && watHours < 16) {
        // Afternoon: 12 PM - 4 PM (60–150 users)
        minUsers = 60;
        maxUsers = 150;
      } else {
        // Evening: 4 PM - 11:59 PM (70–200 users)
        minUsers = 70;
        maxUsers = 200;
      }

      // Generate deterministic target count within the range
      return Math.floor(seededRandom() * (maxUsers - minUsers + 1)) + minUsers;
    };

    // Function to update user count gradually
    const updateUserCount = () => {
      setUserCount((prevCount) => {
        if (prevCount < targetCount) {
          return Math.min(prevCount + 1, targetCount); // Increment gradually
        } else if (prevCount > targetCount) {
          return Math.max(prevCount - 1, targetCount); // Decrement gradually
        }
        return prevCount;
      });
    };

    // Set new target count every 30 seconds
    const setNewTarget = () => {
      setTargetCount(getTargetUserCount());
    };

    // Update user count every 100ms for smooth animation
    const countInterval = setInterval(updateUserCount, 100);

    // Set new target count immediately and every 30 seconds
    setNewTarget();
    const targetInterval = setInterval(setNewTarget, 30000);

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(countInterval);
      clearInterval(targetInterval);
    };
  }, [targetCount]); // Re-run when targetCount changes

  return (
    <div className="online-users">
      <span role="status" aria-live="polite">
        {userCount} users online
      </span>
    </div>
  );
}

export default OnlineUsers;
