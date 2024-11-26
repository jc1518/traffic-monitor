import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { saveImageUrls, loadImageUrls } from "../utils/imageStorage";
import {
  TextField,
  Container,
  Box,
  Button,
  Typography,
  Grid,
  Switch,
  Select,
  MenuItem,
  Slider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Clear as ClearIcon,
  DirectionsRun as DirectionsRunIcon,
} from "@mui/icons-material";
import { url } from "inspector";
interface ImageManagerProps {
  storageKey: string;
  timeZone: string;
}

const drawerWidth = 240;

const ImageManager: React.FC<ImageManagerProps> = ({
  storageKey,
  timeZone,
}) => {
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [imageAnalysis, setImageAnalysis] = useState<{
    status: string;
    time?: string;
  }>({ status: "ready" });
  useState<{ status: string; time?: string } | null>(null);
  const [time, setTime] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [imagesPerRow, setImagesPerRow] = useState(2);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [autoDetect, setAutoDetect] = useState(false);
  const [detectInterval, setDetectInterval] = useState(60);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [alarmThreshold, setAlarmThreshold] = useState<number>(3);

  const alarmOptions = [
    { value: 1, label: "Score 1 - Very light traffic, free-flowing" },
    { value: 2, label: "Score 2 - Light traffic, minimal slowdowns" },
    { value: 3, label: "Score 3 - Moderate traffic, some congestion" },
    { value: 4, label: "Score 4 - Heavy traffic, significant slowdowns" },
    {
      value: 5,
      label: "Score 5 - Severe traffic, gridlock or near-standstill",
    },
  ];

  useEffect(() => {
    loadImageUrls(storageKey).then(setImageUrls);
  }, [storageKey]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadImageUrls(storageKey).then((newUrls) => {
          const updatedUrls = newUrls.map(
            (url) => `${url}?${new Date().getTime()}`
          );
          setImageUrls(updatedUrls);
        });
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, storageKey]);

  useEffect(() => {
    if (autoDetect) {
      const interval = setInterval(() => {
        handleInvokeBedrock();
      }, detectInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoDetect, detectInterval]);

  const addImageUrl = (url: string) => {
    const newUrls = [...imageUrls, url];
    setImageUrls(newUrls);
    saveImageUrls(storageKey, newUrls);
  };

  const removeImages = () => {
    if (selectedImages.length === 0) {
      alert("Please select one ore more cameras to remove.");
      return;
    }
    const newUrls = imageUrls.filter(
      (_, index) => !selectedImages.includes(index)
    );
    setImageUrls(newUrls);
    saveImageUrls(storageKey, newUrls);
    setSelectedImages([]);
  };

  const handleAddImage = () => {
    if (isValidUrl(newImageUrl)) {
      addImageUrl(newImageUrl);
      setNewImageUrl("");
    } else {
      alert("Please enter a valid URL");
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleInvokeBedrock = useCallback(async () => {
    setLoading(true);
    setImageAnalysis({ status: "checking cameras..." });
    const currentTime = new Date().toISOString();
    const localTime = new Date(currentTime).toLocaleTimeString("en-US", {
      timeZone: timeZone,
    });
    setTime(localTime);
    const response = await fetch("/api/bedrock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrls: imageUrls }),
    });
    if (!response!.ok) {
      console.error("Response status:", response!.status);
      console.error("Response headers:", Object.fromEntries(response!.headers));
      throw new Error(`HTTP error! status: ${response!.status}`);
    }
    const responseData = await response.json();
    let result;
    try {
      result = { time: localTime, status: JSON.parse(responseData.reply) };
    } catch (err) {
      console.error("Error parsing JSON:", err);
      setImageAnalysis({ status: `error - ${err}`, time: localTime });
      setLoading(false);
      return;
    }
    setImageAnalysis(result);
    setLoading(false);
  }, [imageUrls, timeZone]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Button
        onClick={() => setIsDrawerOpen((prev) => !prev)}
        startIcon={loading ? <CircularProgress size={30} /> : ""}
      >
        {loading
          ? "Checking Cameras"
          : isDrawerOpen
          ? "Hide Camera Settings"
          : "Open Camera Settings"}
      </Button>
      <Box sx={{ display: "flex" }}>
        <Drawer
          variant={isDrawerOpen ? "permanent" : "temporary"}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              position: "relative",
              height: "auto",
              display: isDrawerOpen ? "block" : "none",
            },
          }}
        >
          <List>
            <ListItem>
              <ListItemText primary="Auto Refresh" />
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
            </ListItem>
            <ListItem>
              <Select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                fullWidth
              >
                <MenuItem value={15}>15 seconds</MenuItem>
                <MenuItem value={60}>1 minute</MenuItem>
                <MenuItem value={300}>5 minutes</MenuItem>
              </Select>
            </ListItem>
            <ListItem>
              <ListItemText primary="Auto Detect" />
              <Switch
                checked={autoDetect}
                onChange={(e) => setAutoDetect(e.target.checked)}
              />
            </ListItem>
            <ListItem>
              <Select
                value={detectInterval}
                onChange={(e) => setDetectInterval(Number(e.target.value))}
                fullWidth
              >
                <MenuItem value={60}>1 minute</MenuItem>
                <MenuItem value={180}>3 minute</MenuItem>
                <MenuItem value={300}>5 minutes</MenuItem>
              </Select>
            </ListItem>
            <ListItem>
              <FormControl fullWidth>
                <label htmlFor="alarm-threshold-select">Alarm Threshold</label>
                <Select
                  id="alarm-threshold-select"
                  value={alarmThreshold?.toString() || ""}
                  onChange={(e) => setAlarmThreshold(Number(e.target.value))}
                >
                  {alarmOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </ListItem>
            <ListItem>
              <Typography gutterBottom>
                Cameras per row: {imagesPerRow}
              </Typography>
            </ListItem>
            <ListItem>
              <Slider
                value={imagesPerRow}
                onChange={(_, value) => setImagesPerRow(value as number)}
                min={1}
                max={10}
                step={1}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <TextField
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter camera URL"
                fullWidth
              />
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                onClick={handleAddImage}
                startIcon={<AddIcon />}
                fullWidth
              >
                Add Camera
              </Button>
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                color="secondary"
                onClick={removeImages}
                startIcon={<DeleteIcon />}
                fullWidth
              >
                Remove Cameras
              </Button>
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                onClick={handleInvokeBedrock}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <DirectionsRunIcon />
                  )
                }
                fullWidth
                disabled={loading}
              >
                {loading ? "Checking..." : "Check Cameras"}
              </Button>
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                onClick={() => setShowAnalysis((prev) => !prev)}
                fullWidth
                startIcon={<VisibilityIcon />}
              >
                {showAnalysis ? "Hide Analysis" : "Show Analysis"}
              </Button>
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                onClick={() => setImageAnalysis("")}
                startIcon={<ClearIcon />}
                fullWidth
              >
                Clear Output
              </Button>
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={2}>
            {imageUrls.map((url, index) => {
              let score = 0;
              try {
                score = imageAnalysis?.time
                  ? JSON.parse(imageAnalysis.status)[`Image ${index + 1}`]
                      ?.score
                  : 0;
              } catch (err) {
                console.log(err);
              }
              const isAlarmed = score >= alarmThreshold; // Determine if the score meets the alarm threshold

              return (
                <Grid item xs={12 / imagesPerRow} key={url}>
                  <Image
                    src={url}
                    width={300}
                    height={225}
                    quality={70}
                    priority={true}
                    alt={`Image ${index + 1}`}
                    unoptimized
                    onClick={() => {
                      setSelectedImages((prev) =>
                        prev.includes(index)
                          ? prev.filter((i) => i !== index)
                          : [...prev, index]
                      );
                    }}
                    style={{
                      border: selectedImages.includes(index)
                        ? "2px solid #1976d2"
                        : isAlarmed // Apply red border if alarmed
                        ? "4px solid red" // Bold red rectangle for alarm
                        : "2px solid transparent",
                      objectFit: "cover",
                      width: "100%",
                      height: "auto",
                      borderRadius: "4px",
                      transition: "border-color 0.3s ease",
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
          <Box
            sx={{ p: 2, mb: 2, borderRadius: 4, backgroundColor: "#f8f9fa" }}
          >
            <div style={{ display: showAnalysis ? "block" : "none" }}>
              {JSON.stringify(imageAnalysis)}
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ImageManager;
