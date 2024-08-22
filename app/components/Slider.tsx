import React from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

const Slider: React.FC<SliderProps> = ({ value, onChange, min, max }) => {
  return (
    <div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <span>Images per row: {value}</span>
    </div>
  );
};

export default Slider;
