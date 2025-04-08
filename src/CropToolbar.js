import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CropToolbar = ({ onReset, onExport, disabled }) => {
    return (_jsxs("div", { className: "toolbar", style: { display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }, children: [_jsx("button", { onClick: onReset, disabled: disabled, children: "Reset" }), _jsx("button", { onClick: onExport, disabled: disabled, children: "Export" })] }));
};
export default CropToolbar;
