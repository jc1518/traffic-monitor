import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

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
    <Box
      sx={{
        textAlign: "center",
        padding: "2px",
        borderRadius: "2px",
      }}
    >
      <Typography variant="h6">{time}</Typography>
    </Box>
  );
};

export default CurrentTime;
