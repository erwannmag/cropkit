import React from 'react';

interface ImageUploaderProps {
  onImageLoad: (img: HTMLImageElement) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageLoad }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      img.onload = () => onImageLoad(img);
      img.src = URL.createObjectURL(file);
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleChange}
    />
  );
};

export default ImageUploader;
