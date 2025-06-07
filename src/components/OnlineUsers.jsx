import { useState, useEffect } from 'react';
import '../styles/game.css'; // Ensure this is imported if styles are in game.css

function OnlineUsers() {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const updateUserCount = () => {
      // Get current time in WAT (UTC+1)
      const now = new Date();
      // Adjust for WAT by adding 1 hour to UTC
      const watHours = (now.getUTCHours() + 1) % 24;

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

      // Generate random number of users within the range
      const randomCount = Math.floor(Math.random() * (maxUsers - minUsers + 1)) + minUsers;
      setUserCount(randomCount);
    };

    // Update user count immediately and every 30 seconds
    updateUserCount();
    const interval = setInterval(updateUserCount, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="online-users">
      <span role="status" aria-live="polite">
        {userCount} users online
      </span>
    </div>
  );
}

export default OnlineUsers;
