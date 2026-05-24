import React from "react";
import { heroContent } from "@/data/dummyContent";
import { Button } from "@/components/ui/Button";

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-tight mb-8">
            {heroContent.headline.split(" ").map((word, i, arr) => {
              if (i === arr.length - 1 || i === arr.length - 2) {
                return <span key={i} className="text-emerald-600">{word} </span>;
              }
              return <span key={i}>{word} </span>;
            })}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            {heroContent.subheadline}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="solid" className="w-full sm:w-auto">
              {heroContent.primaryCta}
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              {heroContent.secondaryCta}
            </Button>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="mt-20 relative mx-auto max-w-5xl">
          <div className="rounded-2xl border border-gray-200/60 bg-white/50 backdrop-blur-sm p-2 shadow-2xl">
            <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 aspect-video relative flex items-center justify-center">
              {/* Dummy Dashboard UI */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
                <div className="h-12 border-b border-gray-200 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                </div>
                <div className="flex-1 p-8 flex gap-6">
                  {/* Sidebar */}
                  <div className="w-48 hidden md:flex flex-col gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 bg-gray-200/60 rounded-md w-full" />
                    ))}
                  </div>
                  {/* Main Content Area */}
                  <div className="flex-1 flex flex-col gap-6">
                    <div className="flex gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex-1 h-24 bg-white rounded-lg border border-gray-200 shadow-sm" />
                      ))}
                    </div>
                    <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm flex items-end p-6 gap-4">
                       {/* Mock Chart */}
                       {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                         <div key={i} className="flex-1 bg-emerald-100 rounded-t-md relative">
                            <div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-md transition-all duration-1000" style={{ height: `${h}%` }} />
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
