import React, { useState, useEffect } from "react";

interface CurrentTimeProps {
  timeZone: string;
}

const CurrentTime: React.FC<CurrentTimeProps> = ({ timeZone }) => {
  const [time, setTime] = useState<string | null>(null);

  const fetchTime = async () => {
    const currentTime = new Date().toISOString();
    const localTime = new Date(currentTime).toLocaleTimeString("en-US", {
      timeZone: timeZone,
    });
    setTime(localTime);
  };

  useEffect(() => {
    fetchTime();
    const interval = setInterval(fetchTime, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div>
      <p>{time}</p>
    </div>
  );
};

export default CurrentTime;
