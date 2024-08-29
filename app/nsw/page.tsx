"use client";
import React, { useState, useCallback } from "react";
import ImageManager from "../components/ImageManager";
import CurrentTime from "../components/CurrentTime";
import Slider from "../components/Slider";
import Toggle from "../components/Toggle";
import Select from "../components/Select";
import { Box, Container, Typography } from "@mui/material";

export default function NSWPage() {
  const [imagesPerRow, setImagesPerRow] = useState(3);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(15);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        New South Wales
      </Typography>
      <CurrentTime />
      <Box mb={2}>
        <Toggle
          value={autoRefresh}
          onChange={setAutoRefresh}
          label="Auto Refresh"
        />
      </Box>
      <Box mb={2}>
        <Select
          options={[
            { value: 15, label: "15 seconds" },
            { value: 60, label: "1 minute" },
            { value: 300, label: "5 minutes" },
          ]}
          value={refreshInterval}
          onChange={setRefreshInterval}
          label="Refresh Interval"
        />
      </Box>
      <Slider
        value={imagesPerRow}
        onChange={(value) => setImagesPerRow(value)}
        min={1}
        max={10}
        label="Images per row"
      />
      <ImageManager
        imagesPerRow={imagesPerRow}
        autoRefresh={autoRefresh}
        refreshInterval={refreshInterval}
      />
    </Container>
  );
}
