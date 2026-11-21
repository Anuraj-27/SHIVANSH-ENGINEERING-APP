import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Link } from '../router/Router';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-ivory border-t border-border text-ink font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-border">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3">
            <Link
              href="/"
              aria-label="Shivansh Engineering Home"
              className="inline-flex items-center gap-1.5 sm:gap-2"
            >
              <img
                src="/assets/aistudio/image_2ce8df1a.png"
                alt="SE Logo"
                className="h-9 sm:h-10 w-auto object-contain mix-blend-multiply"
              />
              <img
                src="/assets/aistudio/image_c20114d0.png"
                alt="Shivansh Engineering"
                className="h-9 sm:h-10 w-auto object-contain mix-blend-multiply"
              />
            </Link>

            <div className="text-xs font-sans font-medium uppercase tracking-[0.1em] text-ink">
              HEAVY INDUSTRIAL MACHINERY OEM
            </div>
          </div>

          {/* Quick Links: Products */}
          <div>
            <div className="text-xs font-sans font-semibold uppercase tracking-[0.1em] text-ink mb-3">
              Products
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products/processing-line" className="text-ink hover:underline decoration-sage underline-offset-4 transition-colors duration-150">
                  Processing Lines
                </Link>
              </li>
              <li>
                <Link href="/products/equipments" className="text-ink hover:underline decoration-sage underline-offset-4 transition-colors duration-150">
                  Heavy Equipments
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Company */}
          <div>
            <div className="text-xs font-sans font-semibold uppercase tracking-[0.1em] text-ink mb-3">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="text-ink hover:underline decoration-sage underline-offset-4 transition-colors duration-150">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-ink hover:underline decoration-sage underline-offset-4 transition-colors duration-150">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-ink hover:underline decoration-sage underline-offset-4 transition-colors duration-150">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-ink hover:underline decoration-sage underline-offset-4 transition-colors duration-150">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Office Column */}
          <div>
            <div className="text-xs font-sans font-semibold uppercase tracking-[0.1em] text-ink mb-3">
              Works Office
            </div>
            <div className="space-y-2 text-xs text-ink font-sans">
              <div>Sanaswadi, Pune Nagar Rd, Pune</div>
              <div className="tabular-nums">+91 88888 45711</div>
              <div>shivanshengineering@yahoo.in</div>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink">
          <div>
            © {new Date().getFullYear()} Shivansh Engineering Works Pvt. Ltd.
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-ink hover:underline decoration-sage underline-offset-4 transition-colors duration-150 font-sans">
              Admin Portal
            </Link>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-canvas border border-border hover:border-sage text-ink transition-colors duration-150 ml-2"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
