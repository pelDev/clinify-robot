import React from "react";
import "./toggle-switch.style.scss";

interface ToggleSwitchProps {
  id: string;
  onClick: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, onClick }) => {
  return (
    <div className="toggle-switch">
      <input
        type="checkbox"
        className="checkbox"
        name={id}
        id={id}
        onChange={onClick}
      />

      <label className="label" htmlFor={id}>
        <span className="inner" />

        <span className="switch" />
      </label>
    </div>
  );
};

export default ToggleSwitch;
