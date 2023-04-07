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
  className,
  ...props
}) => {
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-700 text-white",
    secondary: "bg-gray-300 hover:bg-gray-400 text-gray-800",
    text: "bg-transparent hover:bg-gray-100 text-gray-800 rounded",
  };

  const sizeClasses = {
    small: "py-1 px-2 text-sm",
    medium: "py-2 px-4 text-base",
    large: "py-3 px-6 text-lg",
  };

  const baseClasses = "font-semibold rounded focus:outline-none focus:shadow";
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
