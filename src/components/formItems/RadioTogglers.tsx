import React from "react";
import { ColorPaletteIcon, ImageIcon } from "../../../public/icons";

const iconMap = {
  ColorPaletteIcon: ColorPaletteIcon,
  ImageIcon: ImageIcon,
};

function RadioTogglers({
  options,
  defaultValue,
  onChange,
}: {
  options: { value: string; label: string; icon: string }[];
  defaultValue: string;
  onChange: (value: string) => void; // Fixing type
}) {
  return (
    <div className="radio-togglers shadow">
      {options.map((option) => {
        const IconComponent = iconMap[option.icon as keyof typeof iconMap];
        return (
          <label key={option.value} className="flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="bgType"
              value={option.value}
              checked={defaultValue === option.value} // Use checked for controlled input
              onChange={() => onChange(option.value)}
              className="hidden"
            />
            <p
              className={`flex items-center gap-1 ${
                defaultValue === option.value ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <IconComponent />
              <span>{option.label}</span>
            </p>
          </label>
        );
      })}
    </div>
  );
}

export default RadioTogglers;
