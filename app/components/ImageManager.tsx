import React from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { saveImageUrls, loadImageUrls } from "../utils/imageStorage";
import { useState, useEffect, useCallback } from "react";
import { TextField, Box, Button, Typography, Grid } from "@mui/material";

interface ImageManagerProps {
  storageKey: string;
  imagesPerRow: number;
  autoRefresh: boolean;
  refreshInterval: number;
}

const ImageManager: React.FC<ImageManagerProps> = ({
  storageKey,
  imagesPerRow,
  autoRefresh,
  refreshInterval,
}) => {
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [imageAnalysis, setImageAnalysis] = useState<string>("");

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

  const addImageUrl = (url: string) => {
    const newUrls = [...imageUrls, url];
    setImageUrls(newUrls);
    saveImageUrls(storageKey, newUrls);
  };

  const removeImages = () => {
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
    try {
      setImageAnalysis("Checking...");
      const response = await fetch("/api/bedrock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrls: imageUrls }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();
      setImageAnalysis(responseData.reply);
    } catch (error) {
      setImageAnalysis(`${error}`);
    }
  }, [imageUrls]);

  return (
    <div>
      <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
        <TextField
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Enter image URL"
          sx={{ flexGrow: 1 }}
        />
        <Button variant="contained" onClick={handleAddImage}>
          Add Image
        </Button>
        <Button variant="contained" color="secondary" onClick={removeImages}>
          Remove Selected
        </Button>
        <Button variant="contained" onClick={handleInvokeBedrock}>
          Invoke Bedrock
        </Button>
      </Box>
      <Typography variant="body1" mt={2}>
        <ReactMarkdown>{imageAnalysis}</ReactMarkdown>{" "}
      </Typography>
      <Grid
        container
        spacing={2}
        style={{
          marginTop: "16px",
        }}
      >
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
                  ? "2px solid red"
                  : "3px solid white",
                objectFit: "cover",
                width: "100%",
                height: "auto",
              }}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ImageManager;
