import { Grid, Typography } from "@mui/material";

export default function Home() {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12}>
        <Typography
          variant="h2"
          component="h1"
          align="center"
          color="primary"
          gutterBottom
        >
          AI-Enhanced Traffic Monitoring System
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary">
          Real-time analysis and insights for urban traffic management
        </Typography>
      </Grid>
    </Grid>
  );
}
