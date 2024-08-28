import React, { useState, useEffect } from "react";

const CurrentTime: React.FC = () => {
  const [time, setTime] = useState<string | null>(null);

  const fetchTime = async () => {
    try {
      const response = await fetch("/api/time");
      const data = await response.json();
      setTime(data.time);
    } catch (error) {
      console.error("Error fetching time:", error);
    }
  };

  // useEffect(() => {
  //   fetchTime();
  //   const interval = setInterval(fetchTime, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div>
      <p>
        Current Time:{" "}
        {time ? new Date(time).toLocaleTimeString() : "Loading..."}
      </p>
      <button onClick={() => fetchTime()}> refresh time </button>
    </div>
  );
};

export default CurrentTime;
