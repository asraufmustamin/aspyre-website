"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  options: { id: string; name: string; discount?: string }[];
  selectedId: string;
  onChange: (id: string) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ options, selectedId, onChange }) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="relative inline-flex bg-gray-100 p-1 rounded-full items-center">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={cn(
                "relative z-10 px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300",
                isSelected ? "text-white" : "text-gray-500 hover:text-gray-900"
              )}
            >
              {isSelected && (
                <span className="absolute inset-0 bg-emerald-600 rounded-full shadow-sm -z-10" />
              )}
              {option.name}
            </button>
          );
        })}
      </div>
      
      {options.map((option) => 
        option.discount && selectedId === option.id && (
          <span key={`discount-${option.id}`} className="ml-4 inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full animate-in fade-in zoom-in duration-300">
            {option.discount}
          </span>
        )
      )}
    </div>
  );
};
