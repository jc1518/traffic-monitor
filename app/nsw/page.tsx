"use client";
import React, { useState } from "react";
import ImageManager from "../components/ImageManager";
import Slider from "../components/Slider";

export default function NSWPage() {
  const [imagesPerRow, setImagesPerRow] = useState(3);

  return (
    <div className="nsw">
      <h1>New South Wales</h1>
      <Slider
        value={imagesPerRow}
        onChange={(value) => setImagesPerRow(value)}
        min={1}
        max={10}
      />
      <ImageManager imagesPerRow={imagesPerRow} />
    </div>
  );
}
