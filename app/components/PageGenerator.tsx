"use client";
import React from "react";
import ImageManager from "./ImageManager";
import CurrentTime from "./CurrentTime";
import { Container, Typography, Grid, Paper } from "@mui/material";

interface PageGeneratorProps {
  greetingMessage: string;
  timeZone: string;
  storageKey: string;
}

const PageGenerator: React.FC<PageGeneratorProps> = ({
  greetingMessage,
  timeZone,
  storageKey,
}) => {
  return (
    <Container maxWidth="lg">
      <Paper
        elevation={3}
        sx={{
          padding: "32px",
          borderRadius: "12px",
          mb: 4,
          backgroundColor: "#f8f9fa",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              fontWeight="bold"
              color="primary"
            >
              {greetingMessage}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Traffic Monitoring Dashboard
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                padding: "16px",
                borderRadius: "8px",
                backgroundColor: "white",
              }}
            >
              <CurrentTime timeZone={timeZone} />
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      <Paper
        elevation={3}
        sx={{ padding: "32px", borderRadius: "12px", backgroundColor: "white" }}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight="medium"
          color="primary"
        >
          Camera Settings
        </Typography>
        <ImageManager storageKey={storageKey} />
      </Paper>
    </Container>
  );
};

export default PageGenerator;
