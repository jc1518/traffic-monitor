import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

const Toggle: React.FC<ToggleProps> = ({ value, onChange, label }) => {
  return (
    <FormControlLabel control={<Switch checked={value} onChange={(e) => onChange(e.target.checked)} />} label={label} />
  );
};

export default Toggle;
