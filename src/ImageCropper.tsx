import React, { useRef, useEffect } from 'react';

interface ImageCropperProps {
  image: HTMLImageElement | null;
  pageIndex: number;
  cutLinesPerPage: Record<number, number[]>;
  setCutLinesPerPage: (lines: Record<number, number[]>) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  pageIndex,
  cutLinesPerPage,
  setCutLinesPerPage
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx && image) {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);

      const lines = cutLinesPerPage[pageIndex] || [];

      lines.forEach((y) => {
        // Red line
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        // Coordinate label
        ctx.font = '50px monospace';
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'white';
        ctx.strokeText(`y: ${y}`, 10, y - 6);

        ctx.fillStyle = 'red';
        ctx.fillText(`y: ${y}`, 10, y - 6);
      });
    }
  }, [image, pageIndex, cutLinesPerPage]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const rect = canvas.getBoundingClientRect();
    const scaleY = image.height / rect.height;
    const rawY = e.clientY - rect.top;
    const scaledY = Math.round(rawY * scaleY);

    setCutLinesPerPage((prev) => {
      const updated = { ...prev };
      const currentLines = [...(prev[pageIndex] || [])];

      const proximityThreshold = 5;
      const indexToRemove = currentLines.findIndex((lineY) =>
        Math.abs(lineY - scaledY) <= proximityThreshold
      );

      if (indexToRemove !== -1) {
        currentLines.splice(indexToRemove, 1); // Remove nearby line
      } else {
        currentLines.push(scaledY); // Add new line
      }

      updated[pageIndex] = currentLines.sort((a, b) => a - b);
      return updated;
    });
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      style={{ border: '1px solid #ccc', maxWidth: '100%' }}
    />
  );
};

export default ImageCropper;
