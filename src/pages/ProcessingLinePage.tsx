import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';
import { useRouter } from '../router/Router';
import { PROCESSING_LINES } from '../data/processingLinesData';

export const ProcessingLinePage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="bg-canvas min-h-[80vh] py-16 border-b border-border relative font-sans">
      <div className="blueprint-watermark" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="border-b border-border pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.1em] text-ink mb-2">
              <Layers className="w-4 h-4 text-sage" />
              PRODUCT DIVISION
            </div>
            <h1 className="font-display font-normal text-3xl sm:text-4xl text-ink tracking-normal">
              Processing Lines
            </h1>
          </div>

          <div className="text-xs font-sans text-ink font-semibold uppercase tracking-[0.1em]">
            12 CONTINUOUS SHEET &amp; COIL SYSTEMS
          </div>
        </div>

        {/* Section Title */}
        <div className="border-b border-border pb-3 mb-8">
          <h2 className="font-display font-normal text-xl sm:text-2xl text-ink tracking-normal">
            Line Systems Directory
          </h2>
        </div>

        {/* 12 Processing Lines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {PROCESSING_LINES.map((line) => (
            <div
              key={line.id}
              onClick={() => navigate(`/products/processing-line/${line.slug}`)}
              className="bg-ivory rounded-2xl border border-border p-6 shadow-soft-diffused hover:border-sage hover:shadow-card-elevated transition-[border-color,box-shadow] duration-200 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-sans mb-3">
                  <span className="font-semibold uppercase tracking-[0.1em] text-ink flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-terracotta" />
                    {line.slug.toUpperCase()}
                  </span>
                </div>

                <div className="rounded-xl overflow-hidden mb-4 border border-border bg-canvas aspect-[16/10]">
                  <img
                    src={line.image}
                    alt={line.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Title */}
                <h3 className="text-base sm:text-lg font-semibold text-ink leading-snug font-sans">
                  {line.name}
                </h3>

                {/* Key Spec Highlights */}
                <div className="mt-4 pt-4 border-t border-border space-y-1.5">
                  {line.specs.slice(0, 3).map((sp, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-ink font-sans tabular-nums">
                      <span className="text-ink/80 font-medium">{sp.parameter}:</span>
                      <span className="font-semibold text-ink">
                        {sp.value ? sp.value : `${sp.min} – ${sp.max} ${sp.unit || ''}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-ink group-hover:underline decoration-sage underline-offset-4 uppercase tracking-[0.1em] font-sans">
                  View Full Specs
                </span>
                <div className="w-8 h-8 rounded-lg bg-canvas border border-border group-hover:bg-ink group-hover:text-ivory group-hover:border-ink text-ink flex items-center justify-center transition-colors duration-150">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Consultation Action */}
        <div className="p-8 rounded-2xl border border-border bg-ivory shadow-soft-diffused flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-normal text-xl sm:text-2xl text-ink">
              Custom Processing Line Engineering &amp; Upgrades
            </h3>
            <div className="text-xs font-sans font-semibold text-ink uppercase tracking-[0.1em] mt-1">
              General Arrangement (GA) Drawings · Foundation Design · Turnkey Erection
            </div>
          </div>

          <button
            onClick={() => navigate('/contact')}
            className="px-7 py-3 text-xs sm:text-sm font-semibold text-ivory bg-ink hover:bg-ink-hover rounded-xl transition-colors duration-150 shadow-soft-diffused whitespace-nowrap"
          >
            Submit Layout Inquiry
          </button>
        </div>

      </div>
    </div>
  );
};
