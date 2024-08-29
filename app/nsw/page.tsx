"use client";
import React, { useState, useCallback } from "react";
import ImageManager from "../components/ImageManager";
import CurrentTime from "../components/CurrentTime";
import Slider from "../components/Slider";
import Toggle from "../components/Toggle";
import Select from "../components/Select";

export default function NSWPage() {
  const [imagesPerRow, setImagesPerRow] = useState(3);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(15);

  return (
    <div className="nsw">
      <h1>New South Wales</h1>
      <CurrentTime />
      <div className="controls">
        <Toggle
          value={autoRefresh}
          onChange={setAutoRefresh}
          label="Auto Refresh"
        />
        <Select
          options={[
            { value: 15, label: "15 seconds" },
            { value: 60, label: "1 minute" },
            { value: 300, label: "5 minutes" },
          ]}
          value={refreshInterval}
          onChange={setRefreshInterval}
          label="Refresh Interval"
        />
      </div>
      <Slider
        value={imagesPerRow}
        onChange={(value) => setImagesPerRow(value)}
        min={1}
        max={10}
      />
      <ImageManager
        imagesPerRow={imagesPerRow}
        autoRefresh={autoRefresh}
        refreshInterval={refreshInterval}
      />
    </div>
  );
}
