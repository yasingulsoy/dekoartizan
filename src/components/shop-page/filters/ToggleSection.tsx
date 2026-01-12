"use client";

import React, { useState } from "react";

type ToggleSectionProps = {
  label: string;
  id: string;
};

const ToggleSection = ({ label, id }: ToggleSectionProps) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex items-center justify-between py-2">
      <label htmlFor={id} className="text-black/60 text-sm cursor-pointer">
        {label}
      </label>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={() => setIsChecked(!isChecked)}
        className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2
          ${isChecked ? "bg-black" : "bg-gray-300"}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform
            ${isChecked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
};

export default ToggleSection;
