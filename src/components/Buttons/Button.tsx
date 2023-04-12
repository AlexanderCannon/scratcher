import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  isLoading = false,
  className = "",
  ...props
}) => {
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-700 text-white",
    secondary: "bg-white text-blue-500 hover:bg-gray-200 ",
    text: "bg-transparent hover:bg-gray-100 text-gray-800 ",
  };

  const sizeClasses = {
    small: "py-1 px-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "py-4 px-8 text-lg",
  };

  const baseClasses =
    "font-bold rounded-full focus:outline-none focus:shadow-lg shadow uppercase tracking-wider";
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];
  const fullWidthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";
  const loadingClass = isLoading ? "cursor-wait" : "";

  const classNames = `${baseClasses} ${variantClass} ${sizeClass} ${fullWidthClass} ${disabledClass} ${loadingClass} ${className}`;

  return (
    <button className={classNames} disabled={disabled || isLoading} {...props}>
      {isLoading ? <span className="spinner"></span> : children}
    </button>
  );
};

export default Button;
