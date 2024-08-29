import React from "react";
import Image from "next/image";
import { saveImageUrls, loadImageUrls } from "../utils/imageStorage";
import { useState, useEffect, useCallback } from "react";
import { ContentBlock, Message } from "@aws-sdk/client-bedrock-runtime";
import { TextField, Box, Button, Typography, Grid } from "@mui/material";

interface ImageManagerProps {
  imagesPerRow: number;
  autoRefresh: boolean;
  refreshInterval: number;
}

const ImageManager: React.FC<ImageManagerProps> = ({
  imagesPerRow,
  autoRefresh,
  refreshInterval,
}) => {
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [imageAnalysis, setImageAnalysis] = useState<string>("");

  useEffect(() => {
    loadImageUrls().then(setImageUrls);
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadImageUrls().then(setImageUrls);
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const addImageUrl = (url: string) => {
    const newUrls = [...imageUrls, url];
    setImageUrls(newUrls);
    saveImageUrls(newUrls);
  };

  const removeImages = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    saveImageUrls(newUrls);
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
      <TextField
        fullWidth
        value={newImageUrl}
        onChange={(e) => setNewImageUrl(e.target.value)}
        placeholder="Enter image URL"
        margin="normal"
      />
      <Box mt={2}>
        <Button variant="contained" onClick={handleAddImage}>
          Add Image
        </Button>
      </Box>
      <Box mt={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            const newUrls = imageUrls.filter(
              (_, index) => !selectedImages.includes(index)
            );
            setImageUrls(newUrls);
            saveImageUrls(newUrls);
            setSelectedImages([]);
          }}
        >
          Remove Selected Images
        </Button>
      </Box>
      <Box mt={2}>
        <Button variant="contained" onClick={() => handleInvokeBedrock()}>
          Invoke Bedrock
        </Button>
      </Box>
      <Typography variant="body1">{imageAnalysis}</Typography>
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
              src={url}
              width={300}
              height={225}
              quality={70}
              priority={false}
              alt={`NSW Traffic Image ${index + 1}`}
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
