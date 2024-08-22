import React, { useState } from "react";

interface ImageManagerProps {
  imageUrls: string[];
  addImageUrl: (url: string) => void;
  selectedImages: number[];
  setSelectedImages: React.Dispatch<React.SetStateAction<number[]>>;
}

const ImageManager: React.FC<ImageManagerProps> = ({
  imageUrls,
  addImageUrl,
  selectedImages,
  setSelectedImages,
}) => {
  const [newImageUrl, setNewImageUrl] = useState("");

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
      <button onClick={handleAddImage}>Add Image</button>
    </div>
  );
};

export default ImageManager;
