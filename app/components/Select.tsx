import React from 'react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

interface SelectOption {
  value: number;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const Select: React.FC<SelectProps> = ({ options, value, onChange, label }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

export default Select;
