import React from "react";
import Image from "next/image";
import { saveImageUrls, loadImageUrls } from "../utils/imageStorage";
import { useState, useEffect, useCallback } from "react";
import { ContentBlock, Message } from "@aws-sdk/client-bedrock-runtime";

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
      const message = {
        role: "user",
        content: await Promise.all(
          imageUrls.map(async (url, index) => {
            console.log(url);
            const response = await fetch(url, {
              mode: "no-cors",
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
              },
            });
            console.log(response.headers);
            const imageBlob = await response.arrayBuffer();
            return {
              text: `image ${index + 1}`,
              image: {
                format: "jpeg",
                source: {
                  image_bytes: imageBlob,
                },
              },
            };
          })
        ),
      };
      const requestData = JSON.stringify(message);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestData,
      };
      // console.log(requestOptions);
      // const response = await fetch("/api/bedrock", requestOptions);
      // if (!response.ok) {
      //   throw new Error(`Error: ${response.statusText}`);
      // }
      // const responseData = await response.json();
      // setImageAnalysis(responseData.reply);
    } catch (error) {
      setImageAnalysis(`Failed to invoke Bedrock: ${error}`);
    }
  }, [imageUrls]);

  return (
    <div>
      <input
        type="text"
        value={newImageUrl}
        onChange={(e) => setNewImageUrl(e.target.value)}
        placeholder="Enter image URL"
      />
      <div>
        <button onClick={handleAddImage}>Add Image</button>
      </div>
      <div>
        <button
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
        </button>
      </div>
      <button onClick={() => handleInvokeBedrock()}>Invoke Bedrock</button>
      <div>{imageAnalysis}</div>
      <div
        className="image-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${imagesPerRow}, 1fr)`,
        }}
      >
        {imageUrls.map((url, index) => (
          <Image
            key={index}
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
        ))}
      </div>
    </div>
  );
};

export default ImageManager;
