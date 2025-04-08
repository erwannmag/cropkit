import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useCallback } from 'react';
import ImageCropper from './ImageCropper';
import CropToolbar from './CropToolbar';
import { clamp } from './cropUtils';
const CropKitLegacy = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cutLinesPerPage, setCutLinesPerPage] = useState({});
    const dropRef = useRef(null);
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        const loadedImages = [];
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
    const handleDragOver = useCallback((e) => {
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
        const exportData = {};
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
    return (_jsxs("div", { style: { padding: '1rem' }, children: [_jsx("h1", { children: "CropKit Legacy v0.2.1" }), _jsx("div", { ref: dropRef, onDrop: handleDrop, onDragOver: handleDragOver, style: {
                    border: '2px dashed #aaa',
                    borderRadius: '10px',
                    padding: '2rem',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    backgroundColor: '#f9f9f9',
                }, children: images.length > 0 ? (_jsxs("p", { children: ["Dropped ", images.length, " image(s). Page ", currentIndex + 1, " of ", images.length] })) : (_jsx("p", { children: "Drop one or more images here to begin" })) }), images.length > 1 && (_jsxs("div", { style: { marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }, children: [_jsx("button", { onClick: goToPrev, disabled: currentIndex === 0, children: "\u2B05\uFE0F Previous" }), _jsx("button", { onClick: goToNext, disabled: currentIndex === images.length - 1, children: "Next \u27A1\uFE0F" })] })), currentImage && (_jsxs(_Fragment, { children: [_jsx(ImageCropper, { image: currentImage, pageIndex: currentIndex, cutLinesPerPage: cutLinesPerPage, setCutLinesPerPage: setCutLinesPerPage }), _jsx(CropToolbar, { onReset: handleReset, onExport: handleExport })] }))] }));
};
export default CropKitLegacy;
