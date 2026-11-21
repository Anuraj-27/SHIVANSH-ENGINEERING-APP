import React from 'react';
import { ArrowRight, Wrench } from 'lucide-react';
import { useRouter } from '../router/Router';

export const ServicesPage: React.FC = () => {
  const { navigate } = useRouter();

  const services = [
    { title: 'Consultancy Service', id: 'consultancy' },
    { title: 'Design of various machinery', id: 'design' },
    { title: 'Engineering', id: 'engineering' },
    { title: 'Manufacture and Supply', id: 'manufacture' },
    { title: 'Erection and Commissioning', id: 'commissioning' },
    { title: 'Refurbish', id: 'refurbish' },
    { title: 'Reverse engineering', id: 'reverse-engineering' },
    { title: 'Engineering for second hand lines', id: 'second-hand-lines' },
    { title: 'Re-Engineering and replacement', id: 're-engineering' },
    { title: 'Foundation drawing', id: 'foundation-drawing' },
  ];

  return (
    <div className="bg-canvas min-h-[80vh] py-16 border-b border-border relative font-sans">
      <div className="blueprint-watermark" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="border-b border-border pb-8 mb-12">
          <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.1em] text-ink mb-2">
            <Wrench className="w-4 h-4 text-sage" />
            SHIVANSH ENGINEERING SERVICES
          </div>
          <h1 className="font-display font-normal text-4xl sm:text-5xl text-ink tracking-normal">
            Services
          </h1>
        </div>

        {/* Prominent Main Heading */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <h2 className="font-display font-normal text-2xl sm:text-4xl text-ink tracking-normal leading-tight">
            Services for processing lines and equipments required for metal rolling industry
          </h2>
        </div>

        {/* 3-Column Services Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto">
          {services.map((srv) => (
            <div
              key={srv.id}
              onClick={() => navigate('/contact')}
              className="bg-ivory rounded-2xl border border-border p-8 min-h-[110px] flex items-center justify-center text-center shadow-soft-diffused hover:shadow-card-elevated hover:border-sage transition-[border-color,box-shadow] duration-200 cursor-pointer group"
            >
              <h3 className="text-base sm:text-lg font-medium text-ink leading-snug font-sans">
                {srv.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Bottom Action Section */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
          <div className="text-xs font-sans text-ink font-semibold uppercase tracking-[0.1em]">
            Turnkey Engineering · Design · Refurbishment · Commissioning
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="px-7 py-3 text-xs sm:text-sm font-semibold text-ivory bg-ink hover:bg-ink-hover rounded-xl transition-colors duration-150 shadow-soft-diffused flex items-center gap-2 font-sans"
          >
            <span>Request Service Quotation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
