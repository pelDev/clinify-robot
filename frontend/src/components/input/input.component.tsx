import React from "react";
import { useTheme } from "../../hooks/useTheme";
import "./input.style.scss";

interface InputProps {
  type: "text" | "email" | "date" | "number";
  id: string;
  value: string;
  setValue: (v: string) => void;
  label: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  value,
  setValue,
  label,
  placeholder = "",
  maxLength,
  id,
  type,
  required = false,
  disabled = false,
}) => {
  const theme = useTheme();

  return (
    <div className="input-container">
      <label htmlFor={id}>{label}</label>

      <input
        className={`input__${theme}`}
        type={type}
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default Input;
