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
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";

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
  const [imageAnalysis, setImageAnalysis] = useState<string>("");
  const [time, setTime] = useState<string>("");

  const [imagesPerRow, setImagesPerRow] = useState(2);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(15);
  const [autoDetect, setAutoDetect] = useState(false);
  const [detectInterval, setDetectInterval] = useState(60);

  useEffect(() => {
    loadImageUrls(storageKey).then(setImageUrls);
  }, [storageKey]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadImageUrls(storageKey).then(setImageUrls);
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
    setImageAnalysis("Checking cameras...");
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
    const reader = response!.body?.getReader();
    let result = "";
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder("utf-8").decode(value);
        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);

            if (data.type === "chunk" && data.content) {
              result += data.content;
              setImageAnalysis(result);
            } else if (data.type === "error") {
              console.error("Stream error:", data.message);
              setImageAnalysis("Sorry, there was an error. Please try again.");
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }
      }
    }
  }, [imageUrls, timeZone]);

  const getImageScore = () => {
    try {
      const analysis = JSON.parse(imageAnalysis);
      return analysis.scores || []; // Assuming scores is an array in the JSON
    } catch {
      return []; // Return an empty array if parsing fails
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Box sx={{ display: "flex" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              position: "relative",
              height: "auto",
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
                startIcon={<VisibilityIcon />}
                fullWidth
              >
                Check Cameras
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
          {/* <Grid container spacing={2}>
            {imageUrls.map((url, index) => (
              <Grid item xs={12 / imagesPerRow} key={index}>
                <Image
                  src={`${url}?${new Date().getTime()}`}
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
                      : "2px solid transparent",
                    objectFit: "cover",
                    width: "100%",
                    height: "auto",
                    borderRadius: "4px",
                    transition: "border-color 0.3s ease",
                  }}
                />
              </Grid>
            ))}
          </Grid> */}
          <Grid container spacing={2}>
            {imageUrls.map((url, index) => {
              const scores = getImageScore();
              const score = scores[index] || 0; // Get score for the current image
              return (
                <Grid item xs={12 / imagesPerRow} key={index}>
                  <Image
                    src={`${url}?${new Date().getTime()}`}
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
                        : score > 2
                        ? "4px solid red" // Bold red border for scores > 2
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
            <Typography variant="body1" mb={2}>
              {time}
            </Typography>
            <Typography variant="body1" mt={2}>
              <ReactMarkdown>
                {typeof imageAnalysis === "string"
                  ? imageAnalysis
                  : JSON.stringify(imageAnalysis)}
              </ReactMarkdown>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ImageManager;
