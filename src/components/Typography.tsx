import React from "react";
import PropTypes from "prop-types";

interface TextProps {
  as?: React.ElementType;
  variant?: "heading" | "subheading" | "body";
  className?: string;
  children: React.ReactNode;
}

const Typography = ({
  as: Component = "p",
  variant = "body",
  className,
  children,
  ...props
}: TextProps) => {
  const classNames = [
    "text-gray-800",
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

Typography.propTypes = {
  as: PropTypes.elementType,
  variant: PropTypes.oneOf(["heading", "subheading", "body"]),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Typography;
