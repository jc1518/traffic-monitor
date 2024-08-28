import React from 'react';

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
    <div className="select-container">
      <label>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
