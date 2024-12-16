import React from "react";

interface ButtonProps {
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  style?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type, onClick, style,children }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-block ${style}`}
    >
      {children}
    </button>
  );
};

export default Button;
