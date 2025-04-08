import { jsx as _jsx } from "react/jsx-runtime";
const ImageUploader = ({ onImageLoad }) => {
    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const img = new Image();
            img.onload = () => onImageLoad(img);
            img.src = URL.createObjectURL(file);
        }
    };
    return (_jsx("input", { type: "file", accept: "image/*", onChange: handleChange }));
};
export default ImageUploader;
