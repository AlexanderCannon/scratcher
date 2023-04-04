import React, { useState } from "react";
import Select, {
  GetOptionLabel,
  GetOptionValue,
  MultiValue,
} from "react-select";

interface MultiSelectDropdownProps<T> {
  options: T[];
  placeholder?: string;
  optionValue: GetOptionValue<T>;
  optionLabel: GetOptionLabel<T>;
  className?: string;
  onChange: (selectedOptions: T[]) => void;
}

function MultiSelectDropdown<T>({
  options,
  placeholder = "Select options",
  optionValue,
  optionLabel,
  className,
  onChange,
}: MultiSelectDropdownProps<T>) {
  const [selectedOptions, setSelectedOptions] = useState<T[]>([]);

  const handleSelectChange = (newValue: any) => {
    setSelectedOptions(newValue);
    onChange(newValue);
  };

  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={handleSelectChange}
      placeholder={placeholder}
      getOptionLabel={optionLabel}
      getOptionValue={optionValue}
      isSearchable
      className={`block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        className ?? ""
      }`}
    />
  );
}

export default MultiSelectDropdown;
