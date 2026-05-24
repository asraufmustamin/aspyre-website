"use client";

import React, { useState } from "react";
import { pricingData } from "@/data/dummyContent";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <section id="pricing" className="py-24 bg-gray-50/50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Harga yang transparan, tanpa kejutan.
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Pilih paket yang paling sesuai dengan kebutuhan tim Anda.
          </p>
          <ToggleSwitch
            options={pricingData.billingOptions}
            selectedId={billingCycle}
            onChange={setBillingCycle}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
          {pricingData.tiers.map((tier, index) => {
            const isPro = tier.isPopular;
            const price = billingCycle === "monthly" ? tier.price.monthly : tier.price.annual;

            return (
              <div
                key={index}
                className={cn(
                  "relative bg-white rounded-3xl p-8 transition-all duration-300",
                  isPro 
                    ? "border-2 border-emerald-500 shadow-xl md:-translate-y-4" 
                    : "border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200"
                )}
              >
                {isPro && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Pilihan Utama
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                <p className="text-gray-500 text-sm min-h-[40px] mb-6">{tier.description}</p>
                
                <div className="mb-8">
                  <span className="text-4xl font-extrabold text-foreground">${price}</span>
                  <span className="text-gray-500 font-medium">/bln</span>
                  {billingCycle === "annual" && (
                    <div className="text-sm text-emerald-600 font-medium mt-1">Ditagih tahunan</div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} className="text-emerald-700" />
                      </div>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isPro ? "solid" : "outline"}
                  className={cn("w-full", isPro ? "shadow-emerald-500/25" : "")}
                >
                  Pilih Paket
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
