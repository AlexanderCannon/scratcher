import React from "react";

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...rest
}) => {
  return (
    <input
      className={`block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        className ?? ""
      }`}
      {...rest}
    />
  );
};

export default Input;

export const TextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className, ...rest }) => {
  return (
    <textarea
      className={`block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        className ?? ""
      }`}
      {...rest}
    />
  );
};
