"use client";
import React from "react";
import Image from "next/image";
import imageLoader from "../image-loader";
import { useState, useEffect } from "react";
import ImageManager from "../components/ImageManager";
import Slider from "../components/Slider";
import { saveImageUrls, loadImageUrls } from "../utils/imageStorage";

export default function NSWPage() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagesPerRow, setImagesPerRow] = useState(3);
  const [selectedImages, setSelectedImages] = useState<number[]>([]); // Added state for selected images

  useEffect(() => {
    loadImageUrls().then(setImageUrls);
  }, []);

  const addImageUrl = (url: string) => {
    const newUrls = [...imageUrls, url];
    setImageUrls(newUrls);
    saveImageUrls(newUrls);
  };

  const removeImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    saveImageUrls(newUrls);
  };

  return (
    <div className="nsw">
      <h1>New South Wales</h1>
      <p>Welcome to the NSW page.</p>
      <Slider
        value={imagesPerRow}
        onChange={(value) => setImagesPerRow(value)}
        min={1}
        max={10}
      />
      <ImageManager
        imageUrls={imageUrls}
        addImageUrl={addImageUrl}
        selectedImages={selectedImages} // Fixed: passed selectedImages
        setSelectedImages={setSelectedImages} // Fixed: passed setSelectedImages
      />
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
      <div
        className="image-grid"
        style={{ gridTemplateColumns: `repeat(${imagesPerRow}, 1fr)` }}
      >
        {imageUrls.map((url, index) => (
          <Image // Fixed: changed to use the Image component
            key={index}
            loader={imageLoader}
            src={url}
            width={300}
            height={225}
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
                ? "2px solid blue"
                : "none",
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              if (
                window.confirm("Are you sure you want to delete this image?")
              ) {
                removeImageUrl(index);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
