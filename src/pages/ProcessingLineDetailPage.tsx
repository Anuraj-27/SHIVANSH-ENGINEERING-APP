import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, FileCheck } from 'lucide-react';
import { useRouter } from '../router/Router';
import { ProcessingLineItem } from '../data/processingLinesData';
import { getStoredProcessingLinesMedia } from '../services/mediaStore';

interface Props {
  line: ProcessingLineItem;
}

export const ProcessingLineDetailPage: React.FC<Props> = ({ line }) => {
  const { navigate } = useRouter();
  const [customPhoto, setCustomPhoto] = useState<string | null>(
    getStoredProcessingLinesMedia()[line.slug]?.mainImage || null
  );

  useEffect(() => {
    const handleSync = () => {
      const media = getStoredProcessingLinesMedia();
      setCustomPhoto(media[line.slug]?.mainImage || null);
    };
    window.addEventListener('shivansh-media-updated', handleSync);
    return () => window.removeEventListener('shivansh-media-updated', handleSync);
  }, [line.slug]);

  const activeImage = customPhoto || line.image;

  return (
    <div className="bg-canvas min-h-[85vh] py-12 sm:py-16 border-b border-border relative font-sans">
      <div className="blueprint-watermark" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-ink mb-6 font-medium uppercase tracking-[0.1em]">
          <button
            onClick={() => navigate('/')}
            className="text-ink hover:underline decoration-sage underline-offset-4 transition-colors duration-150"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-sage" />
          <button
            onClick={() => navigate('/products/processing-line')}
            className="text-ink hover:underline decoration-sage underline-offset-4 transition-colors duration-150"
          >
            Processing Line
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-sage" />
          <span className="text-ink font-semibold">{line.name}</span>
        </div>

        {/* Page Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <h1 className="font-display font-normal text-3xl sm:text-4xl text-ink tracking-normal">
            {line.name}
          </h1>
        </div>

        {/* Main Machine Presentation Card */}
        <div className="bg-ivory rounded-2xl border border-border p-6 sm:p-10 shadow-soft-diffused mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Machine Title & Photo */}
            <div className="lg:col-span-6 flex flex-col justify-start">
              <h2 className="text-xs font-semibold text-ink uppercase tracking-[0.1em] mb-3 font-sans">
                {line.name}
              </h2>
              <div className="relative rounded-2xl overflow-hidden border border-border bg-canvas aspect-[4/3]">
                <img
                  src={activeImage}
                  alt={line.imageAlt}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-3 left-3 bg-ink text-ivory px-3 py-1 rounded-lg text-xs font-sans font-medium uppercase tracking-[0.08em]">
                  {customPhoto ? 'Verified Field Photograph' : 'Shivansh OEM Assembly'}
                </div>
              </div>
            </div>

            {/* Right Column: Machine Title, Specification Subtitle & Parameters Table */}
            <div className="lg:col-span-6 flex flex-col justify-start">
              <h2 className="text-xs font-semibold text-ink uppercase tracking-[0.1em] mb-2 font-sans">
                {line.name}
              </h2>
              
              {/* Specification Heading with Terracotta Accent Underline */}
              <div className="mb-5 border-b border-border pb-2">
                <span className="font-display font-normal text-xl sm:text-2xl text-ink relative inline-block pb-1">
                  Specification
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-terracotta rounded-full" />
                </span>
              </div>

              {/* Specification Table */}
              <div className="border border-border rounded-xl overflow-x-auto bg-ivory">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className="bg-canvas border-b border-border text-xs font-semibold text-ink uppercase tracking-[0.08em]">
                      <th className="py-3 px-4">Parameters</th>
                      <th className="py-3 px-4 text-center">Min</th>
                      <th className="py-3 px-4 text-center">Max</th>
                      <th className="py-3 px-4 text-center">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs sm:text-sm text-ink">
                    {line.specs.map((row, idx) => {
                      if (row.value) {
                        return (
                          <tr key={idx} className="hover:bg-canvas/50 transition-colors duration-150">
                            <td className="py-3 px-4 font-semibold text-ink">
                              {row.parameter}
                            </td>
                            <td colSpan={3} className="py-3 px-4 text-ink font-medium">
                              {row.value}
                            </td>
                          </tr>
                        );
                      }
                      return (
                        <tr key={idx} className="hover:bg-canvas/50 transition-colors duration-150">
                          <td className="py-3 px-4 font-semibold text-ink">
                            {row.parameter}
                          </td>
                          <td className="py-3 px-4 text-center font-sans tabular-nums text-ink font-medium">
                            {row.min}
                          </td>
                          <td className="py-3 px-4 text-center font-sans tabular-nums text-ink font-medium">
                            {row.max}
                          </td>
                          <td className="py-3 px-4 text-center font-sans tabular-nums text-ink font-semibold">
                            {row.unit}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Inquire Action Row */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/contact')}
                  className="px-7 py-3 text-sm font-semibold text-ivory bg-ink hover:bg-ink-hover rounded-xl transition-colors duration-150 shadow-soft-diffused flex items-center gap-2 font-sans"
                >
                  <span>Request Custom Quotation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Scope of Equipment Supplied */}
        <div className="mb-12">
          <div className="bg-ivory rounded-2xl border border-border p-6 sm:p-8 shadow-soft-diffused">
            <div className="flex items-center gap-3 mb-5 border-b border-border pb-3">
              <div className="w-8 h-8 rounded-lg bg-canvas border border-border text-sage flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <h3 className="font-display font-normal text-xl text-ink">
                Equipment Modules in Line
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {line.equipmentList.map((eq, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-canvas/70 border border-border text-xs font-medium text-ink"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" />
                  <span className="truncate">{eq}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
