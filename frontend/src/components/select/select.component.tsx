import React, { useEffect, useState } from "react";
import "./select.style.scss";

interface SelectProps {
  selected: number | "";
  options: string[];
  showDefault?: boolean;
  onSelect: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  selected,
  options,
  showDefault = false,
  onSelect,
}) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    if (options.length > 0 && selected !== "" && selected <= options.length) {
      setValue(options[selected]);
    }
  }, [selected, options]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    onSelect(e.target.value);
  };

  return (
    <select
      name=""
      id=""
      className="select"
      value={value}
      onChange={handleChange}
    >
      {showDefault && (
        <option value="" selected disabled>
          Select
        </option>
      )}

      {options.map((option, idx) => (
        <option key={"option-" + idx} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Select;
