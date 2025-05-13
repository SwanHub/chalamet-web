import React from "react";

interface InputTextProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  label?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "text" | "email" | "password" | "search" | "tel" | "url";
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Input_Text: React.FC<InputTextProps> = ({
  value,
  setValue,
  placeholder = "",
  label,
  name,
  required = false,
  disabled = false,
  className = "",
  type = "text",
  autoFocus = false,
  onFocus,
  onBlur,
  onKeyDown,
}) => {
  const inputId = name || Math.random().toString(36).substring(2, 9);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          id={inputId}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={`
            block w-full px-4 py-2 
            border border-gray-300 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            placeholder-gray-400
            ${
              disabled
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-900"
            }
            transition-all duration-200
            ${className}
          `}
        />
      </div>
    </div>
  );
};
