import React from "react";
import "./button.style.scss";

export type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps {
  type: "button" | "submit";
  title: string;
  variant: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      className={`button button__${props.variant}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled || false}
    >
      <span>{props.title}</span>
    </button>
  );
};

export default Button;
