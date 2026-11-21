import React from 'react';
import { ArrowRight, FileText, CheckCircle2, ShieldCheck, Ruler, Activity } from 'lucide-react';
import { FlagshipMachineGraphic } from './FlagshipMachineGraphic';

interface HeroProps {
  onExploreProducts: () => void;
  onRequestQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProducts, onRequestQuote }) => {
  return (
    <section className="relative bg-white pt-8 pb-16 lg:py-20 overflow-hidden border-b border-slate-200">
      {/* Precision CAD blueprint watermark texture with heavy white overlay (5-10% opacity) */}
      <div className="blueprint-watermark opacity-10" />

      {/* Subtle architectural vertical guides */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Subtle trust tag - unboxed clean typography */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-slate-700 mb-6">
          <span className="flex items-center gap-1.5 font-semibold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-[#82C8E5]" />
            ESTABLISHED 1998
          </span>
          <span className="text-slate-300">/</span>
          <span>HEAVY COIL PROCESSING OEM</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#0284C7] font-medium">ISO 9001:2015 CERTIFIED</span>
        </div>

        {/* 2-Column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column (The Value Proposition) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Massive, clean typography */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-900 tracking-tight leading-[1.08] text-balance">
              Precision Hardware Technology for Modern Manufacturing
            </h1>

            {/* Subheadline: Crisp, professional text highlighting expertise in processing lines and heavy equipment */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Shivansh Engineering manufactures high-yield continuous processing lines, 
              precision slitting mills, and custom heavy fabrication equipment engineered 
              to micron tolerances for demanding global industrial plants.
            </p>

            {/* Calls to Action:
                - Primary button filled with #82C8E5 and crisp white text
                - Secondary ghost button transparent with a #82C8E5 border for "View Products" */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={onRequestQuote}
                className="px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-[#82C8E5] hover:bg-[#68bddf] rounded-xl transition-all shadow-soft-diffused hover:shadow-card-elevated active:scale-[0.98] flex items-center gap-2 group whitespace-nowrap"
              >
                <span>Request Quotation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreProducts}
                className="px-7 py-3.5 text-sm sm:text-base font-semibold text-slate-800 bg-transparent border-2 border-[#82C8E5] hover:bg-[#82C8E5]/10 rounded-xl transition-all active:scale-[0.98] flex items-center gap-2 whitespace-nowrap"
              >
                <FileText className="w-4 h-4 text-[#0284C7]" />
                <span>View Products</span>
              </button>
            </div>

            {/* Precision engineering credentials - claim-to-proof row */}
            <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                  ±0.002<span className="text-sm font-sans font-normal text-slate-500">mm</span>
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  Machining tolerance
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                  500<span className="text-sm font-sans font-normal text-[#82C8E5]">+</span>
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  Lines commissioned
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tabular-nums">
                  320<span className="text-sm font-sans font-normal text-slate-500">m/min</span>
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  Continuous feed speed
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (The Visual: Isolated Flagship Machine Render & Floating Nodes) */}
          <div className="lg:col-span-6 relative">
            {/* Subtle radial ambient highlight behind the machine */}
            <div className="absolute -inset-4 bg-radial from-[#82C8E5]/15 via-transparent to-transparent rounded-3xl blur-2xl pointer-events-none" />
            
            {/* High-resolution Flagship Machine Visual with SaaS informational nodes */}
            <FlagshipMachineGraphic />

            {/* Quick architectural caption */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-600 px-2 font-mono">
              <span>ISOMETRIC REF: CAD-SHV-ENG-V4</span>
              <span className="text-[#0284C7] font-semibold">ALL PARTS CNC MACHINED</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
