import React, { useState, useRef, useCallback } from 'react';
import ImageCropper from './ImageCropper';
import CropToolbar from './CropToolbar';
import { clamp } from './cropUtils';

const CropKitLegacy: React.FC = () => {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cutLinesPerPage, setCutLinesPerPage] = useState<Record<number, number[]>>({});

  const dropRef = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    files.forEach(file => {
      const img = new Image();
      img.onload = () => {
        loadedImages.push(img);
        loadedCount++;
        if (loadedCount === files.length) {
          setImages(loadedImages);
          setCurrentIndex(0);
        }
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleReset = () => {
    setCutLinesPerPage((prev) => {
      const updated = { ...prev };
      updated[currentIndex] = [];
      return updated;
    });
  };

const handleExport = () => {
  if (Object.keys(cutLinesPerPage).length === 0) {
    alert("No cut lines to export.");
    return;
  }

  const exportData: Record<string, number[]> = {};

  Object.entries(cutLinesPerPage).forEach(([pageIndex, lines]) => {
    if (lines.length > 0) {
      exportData[`page_${Number(pageIndex) + 1}`] = lines;
    }
  });

  const jsonData = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'crop-lines.json';
  document.body.appendChild(a); // Required in Firefox
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
};

  const goToPrev = () => {
    setCurrentIndex((prev) => clamp(prev - 1, 0, images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => clamp(prev + 1, 0, images.length - 1));
  };

  const currentImage = images[currentIndex] || null;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>CropKit Legacy v0.2.1</h1>

      {/* 🧲 Drag & Drop Zone */}
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: '2px dashed #aaa',
          borderRadius: '10px',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '1rem',
          backgroundColor: '#f9f9f9',
        }}
      >
        {images.length > 0 ? (
          <p>Dropped {images.length} image(s). Page {currentIndex + 1} of {images.length}</p>
        ) : (
          <p>Drop one or more images here to begin</p>
        )}
      </div>

      {/* 🔃 Navigation Buttons */}
      {images.length > 1 && (
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={goToPrev} disabled={currentIndex === 0}>⬅️ Previous</button>
          <button onClick={goToNext} disabled={currentIndex === images.length - 1}>Next ➡️</button>
        </div>
      )}

      {/* 🔧 Cutline UI */}
      {currentImage && (
        <>
          <ImageCropper
            image={currentImage}
            pageIndex={currentIndex}
            cutLinesPerPage={cutLinesPerPage}
            setCutLinesPerPage={setCutLinesPerPage}
          />
		  <CropToolbar
			onReset={handleReset}
			onExport={handleExport}
		  />
        </>
      )}
    </div>
  );
};

export default CropKitLegacy;
