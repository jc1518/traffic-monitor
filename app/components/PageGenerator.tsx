"use client";
import React, { useState, useCallback } from "react";
import ImageManager from "./ImageManager";
import CurrentTime from "./CurrentTime";
import Slider from "./Slider";
import Toggle from "./Toggle";
import Select from "./Select";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";

interface PageGeneratorProps {
  greetingMessage: string;
}

const PageGenerator: React.FC<PageGeneratorProps> = ({ greetingMessage }) => {
  const [imagesPerRow, setImagesPerRow] = useState(3);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(15);

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper elevation={3} style={{ padding: "16px" }}>
            <Typography variant="h6" gutterBottom>
              Controls
            </Typography>
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
            <Box mb={2}>
              <Slider
                value={imagesPerRow}
                onChange={(value) => setImagesPerRow(value)}
                min={1}
                max={10}
                label="Images per row"
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="h4" component="h1" gutterBottom>
            {greetingMessage}
          </Typography>
          <CurrentTime />
          <ImageManager
            imagesPerRow={imagesPerRow}
            autoRefresh={autoRefresh}
            refreshInterval={refreshInterval}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default PageGenerator;
