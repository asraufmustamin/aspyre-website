import React from "react";
import { bentoFeatures } from "@/data/dummyContent";
import { Workflow, BarChart3, Lock } from "lucide-react";

export const BentoFeatures = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Dirancang untuk memecahkan kompleksitas.
          </h2>
          <p className="text-gray-500 text-lg">
            Bukan sekadar alat bantu, melainkan fondasi operasi bisnis Anda dengan arsitektur modern.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          
          {/* Grid A (Wide) */}
          <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 p-8 flex flex-col group hover:shadow-lg hover:border-emerald-100 transition-all duration-500">
            <div className="relative z-10 max-w-md">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                <Workflow size={24} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{bentoFeatures.gridA.title}</h3>
              <p className="text-gray-500">{bentoFeatures.gridA.description}</p>
            </div>
            
            {/* Background Visual */}
            <div className="absolute right-0 bottom-0 w-2/3 h-full opacity-30 md:opacity-100 translate-x-12 translate-y-12 group-hover:translate-x-8 transition-transform duration-700">
               {/* Abstract nodes connection graphic */}
               <svg viewBox="0 0 400 300" className="w-full h-full text-gray-300 drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth="2">
                 <circle cx="300" cy="150" r="40" className="fill-white stroke-gray-200" />
                 <circle cx="150" cy="80" r="30" className="fill-white stroke-gray-200" />
                 <circle cx="100" cy="220" r="35" className="fill-white stroke-gray-200" />
                 
                 <path d="M180 80 Q250 80 270 120" />
                 <path d="M135 220 Q200 220 270 170" />
                 
                 {/* Emerald highlight node */}
                 <circle cx="300" cy="150" r="15" className="fill-emerald-500 stroke-none" />
               </svg>
            </div>
          </div>

          {/* Grid B (Small) */}
          <div className="relative overflow-hidden rounded-3xl bg-emerald-900 text-white p-8 flex flex-col justify-between group hover:shadow-xl transition-all duration-500">
            <div>
              <div className="w-10 h-10 bg-emerald-800 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 size={20} className="text-emerald-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">{bentoFeatures.gridB.title}</h3>
              <p className="text-emerald-100/80 text-sm">{bentoFeatures.gridB.description}</p>
            </div>
            
            <div className="mt-8">
              <div className="text-5xl font-black text-amber-400 tracking-tighter mb-4">
                {bentoFeatures.gridB.metric}
              </div>
              {/* Sparkline Mock */}
              <div className="flex items-end gap-1.5 h-12 opacity-80 group-hover:opacity-100 transition-opacity">
                {[30, 45, 25, 60, 40, 70, 50, 90].map((h, i) => (
                  <div key={i} className="flex-1 bg-amber-400/80 rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Grid C (Small) */}
          <div className="relative overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 p-8 flex flex-col justify-center items-center text-center group hover:shadow-lg hover:border-gray-200 transition-all duration-500">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-gray-200/50 rounded-full blur-3xl group-hover:bg-amber-100/50 transition-colors duration-500" />
            <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center mb-6 text-gray-700 group-hover:text-amber-500 group-hover:scale-110 transition-all duration-500">
              <Lock size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{bentoFeatures.gridC.title}</h3>
            <p className="text-gray-500 text-sm max-w-[200px]">{bentoFeatures.gridC.description}</p>
          </div>

          {/* Optional Grid D for balance (Full width short) */}
          <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 flex items-center justify-between shadow-sm">
             <div>
               <h3 className="text-xl font-bold text-foreground">API Cepat & Andal</h3>
               <p className="text-gray-500 text-sm mt-1">Integrasi kustom dengan dokumentasi pengembang berkelas dunia.</p>
             </div>
             <div className="px-4 py-2 bg-gray-900 text-gray-300 text-sm font-mono rounded-lg border border-gray-800">
               npm i @synthetix/sdk
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};
