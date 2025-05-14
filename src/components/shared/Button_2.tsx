import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export const Button_2: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}) => {
  let variantClasses = "";

  if (variant === "primary") {
    variantClasses =
      "bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-600 text-white";
  } else if (variant === "secondary") {
    variantClasses =
      "bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-black";
  }

  const baseClasses = `
    rounded-lg font-medium text-center px-4 py-3 transition-all duration-200
    ${variantClasses}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  return (
    <button className={baseClasses} {...props}>
      {label}
    </button>
  );
};
