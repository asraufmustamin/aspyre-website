import React from "react";
import { heroContent } from "@/data/dummyContent";

export const SocialProof = () => {
  return (
    <section className="py-12 border-b border-gray-100 bg-gray-50/50">
      <div className="container mx-auto px-6 max-w-7xl">
        <p className="text-center text-sm font-semibold text-gray-500 mb-8 uppercase tracking-wider">
          {heroContent.trustedText}
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
          {/* Mock Logos - In real world, use actual SVG logos */}
          {[
            { name: "Acme Corp", icon: "▲" },
            { name: "Quantum", icon: "⎔" },
            { name: "Echo", icon: "◎" },
            { name: "Celestial", icon: "✧" },
            { name: "Pulse", icon: "⚡" },
          ].map((company, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 text-2xl font-bold text-gray-400 hover:text-emerald-700 transition-colors duration-300 cursor-default grayscale hover:grayscale-0"
            >
              <span>{company.icon}</span>
              <span className="text-xl tracking-tight">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
