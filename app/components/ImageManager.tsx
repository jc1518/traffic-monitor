import React from "react";
import Image from "next/image";
import { saveImageUrls, loadImageUrls } from "../utils/imageStorage";
import { useState, useEffect } from "react";

interface ImageManagerProps {
  imagesPerRow: number;
  autoRefresh: boolean;
  refreshInterval: number;
  //onAnalyze: (imageUrls: string[]) => void;
}

const ImageManager: React.FC<ImageManagerProps> = ({
  imagesPerRow,
  autoRefresh,
  refreshInterval,
  //onAnalyze,
}) => {
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

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
