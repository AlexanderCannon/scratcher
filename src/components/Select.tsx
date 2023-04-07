import React, { useEffect, useState } from "react";
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
  initialValue?: T[];
}

function MultiSelectDropdown<T>({
  options,
  placeholder = "Select options",
  optionValue,
  optionLabel,
  className,
  onChange,
  initialValue,
}: MultiSelectDropdownProps<T>) {
  const [selectedOptions, setSelectedOptions] = useState<T[]>(
    initialValue ?? []
  );

  const handleSelectChange = (newValue: any) => {
    setSelectedOptions(newValue);
    onChange(newValue);
  };

  useEffect(() => {
    if (initialValue) {
      setSelectedOptions(initialValue);
    }
  }, [initialValue]);

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
      className={`text-gray-700 ${className ?? ""}`}
    />
  );
}

export default MultiSelectDropdown;
