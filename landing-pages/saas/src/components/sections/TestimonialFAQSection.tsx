import React from "react";
import { testimonials, faqData } from "@/data/dummyContent";
import { Accordion } from "@/components/ui/Accordion";

export const TestimonialFAQSection = () => {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Testimonials Masonry-ish Grid */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Disukai oleh ribuan kreator.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {testimonials.map((t, index) => (
              <div 
                key={index} 
                className="bg-gray-50 border border-gray-100 p-8 rounded-3xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex text-amber-400 mb-6 gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{t.name}</h4>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
              Pertanyaan yang sering diajukan.
            </h2>
          </div>
          <Accordion items={faqData} />
        </div>
        
      </div>
    </section>
  );
};
