import React from 'react';
import { Slider as MuiSlider, Typography } from '@mui/material';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
}

const Slider: React.FC<SliderProps> = ({ value, onChange, min, max, label }) => {
  return (
    <>
      <Typography gutterBottom>{label}: {value}</Typography>
      <MuiSlider
        value={value}
        onChange={(_, newValue) => onChange(newValue as number)}
        min={min}
        max={max}
      />
    </>
  );
};

export default Slider;
