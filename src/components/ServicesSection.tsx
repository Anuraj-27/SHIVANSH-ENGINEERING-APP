import React from 'react';
import { ArrowRight, Wrench, CheckCircle2, Clock } from 'lucide-react';
import { SERVICES_DATA } from '../data/engineeringData';

interface ServicesSectionProps {
  onRequestService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onRequestService }) => {
  return (
    <section id="services" className="py-20 bg-slate-50/50 border-b border-slate-200 relative">
      <div className="blueprint-watermark opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#82C8E5]" />
            LIFECYCLE ENGINEERING SUPPORT
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Industrial Engineering Services
          </h2>
          <p className="mt-3 text-base text-slate-600">
            From initial site civil foundation layouts to high-speed line automation retrofits and cryogenic blade sharpening, our factory engineers support your plant at every stage.
          </p>
        </div>

        {/* Services Grid (4 numbered service cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES_DATA.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft-diffused hover:border-slate-300 hover:shadow-card-elevated transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-2xl font-bold font-mono text-[#82C8E5]">
                    {srv.number}.
                  </span>
                  <span className="text-xs font-mono text-slate-700 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {srv.timeline}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mt-4 group-hover:text-slate-800 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                  {srv.description}
                </p>

                {/* Deliverables */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="text-xs font-mono uppercase font-semibold text-slate-700 mb-2">
                    Scope & Key Deliverables
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {srv.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#82C8E5] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onRequestService(srv.title)}
                  className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] flex items-center gap-1.5 transition-colors"
                >
                  <span>Inquire for {srv.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
