import React from 'react';

interface CropToolbarProps {
  onReset: () => void;
  onExport: () => void;
  disabled?: boolean;
}

const CropToolbar: React.FC<CropToolbarProps> = ({ onReset, onExport, disabled }) => {
  return (
    <div className="toolbar" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
      <button onClick={onReset} disabled={disabled}>Reset</button>
      <button onClick={onExport} disabled={disabled}>Export</button>
    </div>
  );
};

export default CropToolbar;

