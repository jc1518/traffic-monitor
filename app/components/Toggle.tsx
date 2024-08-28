import React from 'react';

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

const Toggle: React.FC<ToggleProps> = ({ value, onChange, label }) => {
  return (
    <label className="toggle">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="slider"></span>
      <span className="label">{label}</span>
      <style jsx>{`
        .toggle { /* Add your toggle switch styles here */ }
        .slider { /* Add your slider styles here */ }
        .label { /* Add your label styles here */ }
        input { /* Add your input styles here */ }
      `}</style>
    </label>
  );
};

export default Toggle;
