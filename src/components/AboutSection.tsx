import React from 'react';
import { ShieldCheck, Award, Factory, CheckCircle2, Compass, Layers } from 'lucide-react';
import { ENGINEERING_METRICS } from '../data/engineeringData';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200 relative">
      <div className="blueprint-watermark opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#82C8E5]" />
            PRECISION ENGINEERING HERITAGE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built on Rigorous Metallurgical Standards & Sub-Micron Precision
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Founded with a singular engineering mandate: to deliver processing machinery that eliminates downtime, preserves raw material integrity, and delivers unmatched strip flatness across millions of production tons.
          </p>
        </div>

        {/* 4-Stat Proof Metric Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {ENGINEERING_METRICS.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50/90 rounded-2xl border border-slate-200/90 p-5 shadow-soft-diffused"
            >
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tracking-tight tabular-nums">
                {item.value}
              </div>
              <div className="text-xs font-semibold text-slate-800 mt-1">
                {item.label}
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                {item.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Asymmetric Bento Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: 5-Axis CNC Machining Shop */}
          <div className="lg:col-span-7 bg-slate-50/70 rounded-2xl border border-slate-200 p-8 flex flex-col justify-between shadow-soft-diffused">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-700 mb-4 pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900">FACILITY FOOTPRINT: 120,000 SQ. FT</span>
                <span className="text-[#0284C7] font-semibold">HEAVY ENGINEERING UNIT</span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900">
                In-House Heavy CNC Boring, Grinding & Stress-Relieving Furnaces
              </h3>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Unlike assemblers who outsource critical components, Shivansh Engineering manufactures 92% of all structural housings, tool arbors, and leveler cassettes in-house. Our facility houses German 5-axis floor borers, CNC cylindrical roll grinders capable of Ø 800 mm × 4,000 mm, and deep induction hardening towers.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Stress-relieved cast steel mill housings',
                  'Induction hardened rolls (62–64 HRC)',
                  'Dynamic laser balancing up to 3,000 RPM',
                  'Sub-zero cryogenic stabilization treatment',
                ].map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#82C8E5] shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtle architectural schematic blueprint footer */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>FACILITY ID: SHV-PLANT-01</span>
              <span>CALIBRATION PROTOCOL: ISO/IEC 17025</span>
            </div>
          </div>

          {/* Card 2: Metallurgical Quality Control & Audits */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-between shadow-soft-diffused">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-[#82C8E5] flex items-center justify-center mb-6 shadow-xs">
                <Award className="w-5 h-5" />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                ISO 9001:2015 Certified Quality Management System
              </h3>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                Every machine undergoes 120 hours of continuous cold and hot trial testing before dispatch. Our in-house metallurgical laboratory verifies ultrasonic sound velocity, raw steel grain structure, and roller surface roughness down to Ra 0.05 microns.
              </p>

              <div className="mt-6 space-y-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-900">Traceability Guarantee</div>
                  <div className="text-[11px] text-slate-700 mt-0.5">
                    Heat codes and mill test certificates stamped on all structural members.
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-900">CE European Safety Compliance</div>
                  <div className="text-[11px] text-slate-700 mt-0.5">
                    Dual safety interlocks, light curtains, and emergency fail-safe hydraulics.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-500">
              <ShieldCheck className="w-4 h-4 text-[#82C8E5]" />
              <span>Certified under Bureau of Indian Standards & TUV NORD</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
