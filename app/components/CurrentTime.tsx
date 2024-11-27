import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

interface CurrentTimeProps {
  timeZone: string;
}

const CurrentTime: React.FC<CurrentTimeProps> = ({ timeZone }) => {
  const [time, setTime] = useState<string | null>(null);

  const fetchTime = async () => {
    const currentTime = new Date();
    const localTime = currentTime.toLocaleString("en-US", {
      timeZone: timeZone,
      hour: "2-digit",
      year: "numeric",
      month: "short",
      day: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
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
        padding: "10px",
        borderRadius: "5px",
        // backgroundColor: "#f0f0f0",
        // boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
        {time}
      </Typography>
    </Box>
  );
};

export default CurrentTime;
