import React, { useEffect, useState } from "react";
import "./select-button.style.scss";

interface SelectButtonProps {
  selected: number | "";
  id: string;
  label: string;
  options: string[];
  required?: boolean;
  showDefault?: boolean;
  defaultValue?: string;
  onSelect: (value: string) => void;
}

const SelectButton: React.FC<SelectButtonProps> = ({
  showDefault = false,
  required = false,
  defaultValue = "Select",
  options,
  selected,
  onSelect,
  id,
  label,
}) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    if (options.length > 0 && selected !== "" && selected <= options.length) {
      setValue(options[selected]);
    }
  }, [selected, options]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(e.target.value);
  };

  return (
    <div className="select-container">
      <label htmlFor={id}>{label}</label>

      <select id={id} value={value} onChange={handleChange} required={required}>
        {showDefault && (
          <option value="" selected disabled>
            {defaultValue}
          </option>
        )}

        {options.map((option, idx) => (
          <option key={"option-" + idx} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectButton;
