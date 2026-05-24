"use client";

import React, { useState, useEffect } from "react";
import { navLinks } from "@/data/dummyContent";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none">S</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">Synthetix</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Masuk
          </Button>
          <Button variant="solid">Mulai Gratis</Button>
        </div>
      </div>
    </header>
  );
};
