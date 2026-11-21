import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from '../router/Router';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  const servicesList = [
    "Consultancy Services for Up-gradation of various equipment's for Metal Rolling Industry",
    "Design of various machinery required for Metal Rolling Industry",
    "Engineering of various machinery required for Metal Rolling Industry",
    "Manufacture and Supply of various machineries for Metal Rolling Industry",
    "Erection and Commissioning of various machineries for Metal Rolling Industry",
    "Refurbish various equipment already procured by customer",
    "Reverse engineering for old equipment's as per customer required",
    "Engineering for second hand lines like preparing GA drawings, Foundation drawings, plant layout, utility layouts, etc.",
    "Re-Engineering and replacement of machine or critical parts in existing lines",
    "Foundation drawing preparation",
  ];

  return (
    <div className="bg-canvas min-h-[80vh] py-16 border-b border-border relative font-sans">
      <div className="blueprint-watermark" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Title */}
        <div className="border-b border-border pb-8 mb-10">
          <h1 className="font-display font-normal text-4xl sm:text-5xl text-ink tracking-normal">
            About Us
          </h1>
        </div>

        {/* Introductory Overview */}
        <div className="space-y-6 mb-12">
          <p className="text-lg sm:text-xl font-medium text-ink leading-relaxed">
            Since 2006, we have specialized in high-precision engineering for the global metal industry including Carbon Steel, Stainless Steel, Aluminium, Copper, And Brass.
          </p>

          <p className="text-base sm:text-lg text-ink/90 leading-relaxed">
            With two decades of expertise, we help our partners achieve operational excellence through innovative, tailored solutions. From consultancy and equipment design to manufacturing and commissioning, we provide end-to-end services designed to maximize your efficiency and competitive advantage.
          </p>
        </div>

        {/* Solutions & Capabilities Section */}
        <div className="bg-ivory rounded-2xl border border-border p-6 sm:p-10 shadow-soft-diffused mb-12">
          <h2 className="font-display font-normal text-xl sm:text-2xl text-ink mb-6 leading-snug">
            We are Providing Complete solution for sheet process industry with consultancy services, Equipment Design, Equipment Manufacturing, Erection &amp; Commissioning Services as per client requirement:
          </h2>

          <div className="space-y-3.5">
            {servicesList.map((service, index) => (
              <div
                key={index}
                className="flex items-start gap-3.5 p-3.5 rounded-xl bg-canvas/65 border border-border hover:border-sage transition-colors duration-150"
              >
                <div className="mt-0.5 w-5 h-5 rounded-full bg-sage/15 text-sage flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                </div>
                <span className="text-sm sm:text-base text-ink leading-relaxed">
                  {service}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-sans font-semibold text-ink uppercase tracking-[0.1em]">
            Shivansh Engineering Works · Established 2006
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="px-7 py-3 text-xs sm:text-sm font-semibold text-ivory bg-ink hover:bg-ink-hover rounded-xl transition-colors duration-150 shadow-soft-diffused flex items-center gap-2"
          >
            <span>Contact Engineering Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
