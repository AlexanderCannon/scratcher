import React from "react";
import PropTypes from "prop-types";

interface TypographyProps {
  as?: React.ElementType;
  variant?: "heading" | "subheading" | "body" | "title";
  className?: string;
  children: React.ReactNode;
}

const Typography = ({
  as: Component = "p",
  variant = "body",
  className,
  children,
  ...props
}: TypographyProps) => {
  const classNames = [
    "text-gray-800",
    variant === "title" && "text-5xl font-bold",
    variant === "heading" && "text-3xl font-bold",
    variant === "subheading" && "text-xl font-bold",
    variant === "body" && "text-base",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classNames} {...props}>
      {children}
    </Component>
  );
};

export default Typography;
