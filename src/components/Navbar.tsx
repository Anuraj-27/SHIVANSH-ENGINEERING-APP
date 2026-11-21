import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X, ArrowRight, Layers, Cog } from 'lucide-react';
import { useRouter, Link, RoutePath } from '../router/Router';
import { PROCESSING_LINES } from '../data/processingLinesData';

export const Navbar: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProcessingOpen, setMobileProcessingOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isProductsActive = currentPath.startsWith('/products');

  const handleNav = (path: RoutePath) => {
    navigate(path);
    setProductsOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-ivory border-b border-border font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Top Left: Company Logo & Name */}
          <Link
            href="/"
            aria-label="Shivansh Engineering Home"
            className="flex items-center gap-1.5 sm:gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-lg shrink-0"
          >
            <img
              src="/assets/aistudio/image_2ce8df1a.png"
              alt="SE Logo"
              className="h-10 sm:h-12 w-auto object-contain mix-blend-multiply"
            />
            <img
              src="/assets/aistudio/image_c20114d0.png"
              alt="Shivansh Engineering"
              className="h-10 sm:h-12 w-auto object-contain mix-blend-multiply"
            />
          </Link>

          {/* Right / Center Alignment (Navigation Menu) */}
          <nav className="hidden md:flex items-center gap-8">
            {/* About us */}
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors duration-150 py-1 relative ${
                currentPath === '/about'
                  ? 'text-ink font-semibold border-b-2 border-sage'
                  : 'text-ink/85 hover:text-ink border-b-2 border-transparent hover:border-sage'
              }`}
            >
              About us
            </Link>

            {/* Products Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProductsOpen(!productsOpen)}
                onMouseEnter={() => setProductsOpen(true)}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded ${
                  isProductsActive
                    ? 'text-ink font-semibold border-b-2 border-sage'
                    : 'text-ink/85 hover:text-ink border-b-2 border-transparent hover:border-sage'
                }`}
                aria-expanded={productsOpen}
                aria-haspopup="true"
              >
                <span>Products</span>
                <ChevronDown
                  className={`w-4 h-4 text-sage transition-transform duration-150 ${
                    productsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Products Dropdown on warm ivory surface */}
              {productsOpen && (
                <div
                  onMouseLeave={() => setProductsOpen(false)}
                  className="absolute top-full left-0 mt-2 w-84 sm:w-96 bg-ivory rounded-2xl shadow-card-elevated border border-border-strong p-3 z-50 text-ink"
                >
                  {/* Top Navigation Row: Processing Line Heading & Direct Equipments Button */}
                  <div className="flex items-center justify-between gap-2 p-1.5 bg-canvas rounded-xl border border-border mb-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-ink">
                      <Layers className="w-3.5 h-3.5 text-sage" />
                      <span>Processing Lines</span>
                    </div>

                    {/* Direct link for Equipments */}
                    <button
                      type="button"
                      onClick={() => handleNav('/products/equipments')}
                      className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-ink text-ivory hover:bg-ink-hover transition-colors duration-150 flex items-center gap-1.5"
                    >
                      <Cog className="w-3.5 h-3.5 text-ivory" />
                      <span>Equipments Page</span>
                      <ArrowRight className="w-3 h-3 text-ivory" />
                    </button>
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between px-2.5 pb-2 border-b border-border mb-1.5">
                    <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em] text-ink">
                      Select Line System (12)
                    </span>
                    <button
                      onClick={() => handleNav('/products/processing-line')}
                      className="text-[11px] font-semibold text-ink hover:underline decoration-sage underline-offset-2 flex items-center gap-1 transition-colors duration-150"
                    >
                      <span>Overview</span>
                      <ArrowRight className="w-3 h-3 text-sage" />
                    </button>
                  </div>

                  {/* 12 Processing Line items */}
                  <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-1">
                    {PROCESSING_LINES.map((line) => {
                      const isActive = currentPath === `/products/processing-line/${line.slug}`;
                      return (
                        <button
                          key={line.id}
                          onClick={() => handleNav(`/products/processing-line/${line.slug}`)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors duration-150 flex items-center justify-between group ${
                            isActive
                              ? 'bg-canvas text-ink font-semibold border border-border'
                              : 'text-ink hover:bg-canvas border border-transparent'
                          }`}
                        >
                          <span>{line.name}</span>
                          <span className="text-sage opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-xs font-semibold">
                            →
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Quick Links */}
                  <div className="pt-2.5 mt-2 border-t border-border grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleNav('/products/processing-line')}
                      className="py-2 px-2 text-[11px] font-semibold text-center text-ink bg-canvas hover:bg-border/40 border border-border rounded-xl transition-colors duration-150 truncate"
                    >
                      All 12 Lines
                    </button>
                    <button
                      onClick={() => handleNav('/products/equipments')}
                      className="py-2 px-2 text-[11px] font-semibold text-center text-ink bg-canvas hover:bg-border/40 border border-border rounded-xl transition-colors duration-150 truncate flex items-center justify-center gap-1"
                    >
                      <span>All 29 Equipments</span>
                      <ArrowRight className="w-3 h-3 text-sage" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Services */}
            <Link
              href="/services"
              className={`text-sm font-medium transition-colors duration-150 py-1 relative ${
                currentPath === '/services'
                  ? 'text-ink font-semibold border-b-2 border-sage'
                  : 'text-ink/85 hover:text-ink border-b-2 border-transparent hover:border-sage'
              }`}
            >
              Services
            </Link>

            {/* Gallery */}
            <Link
              href="/gallery"
              className={`text-sm font-medium transition-colors duration-150 py-1 relative ${
                currentPath === '/gallery'
                  ? 'text-ink font-semibold border-b-2 border-sage'
                  : 'text-ink/85 hover:text-ink border-b-2 border-transparent hover:border-sage'
              }`}
            >
              Gallery
            </Link>

            {/* Contact us (Primary solid #29434F button with #FFFCF6 ivory text) */}
            <button
              onClick={() => handleNav('/contact')}
              className="px-5 py-2.5 text-xs font-semibold text-ivory bg-ink hover:bg-ink-hover rounded-xl transition-colors duration-150 shadow-soft-diffused font-sans"
            >
              Contact us
            </button>
          </nav>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ink hover:bg-canvas rounded-lg transition-colors duration-150"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ivory border-b border-border px-4 pt-3 pb-6 space-y-2 shadow-card-elevated max-h-[85vh] overflow-y-auto">
          <button
            onClick={() => handleNav('/about')}
            className={`w-full text-left py-2.5 text-base font-medium border-b border-border transition-colors duration-150 ${
              currentPath === '/about' ? 'text-ink font-semibold underline decoration-sage underline-offset-4' : 'text-ink'
            }`}
          >
            About us
          </button>

          {/* Mobile Products Accordion */}
          <div className="py-2 border-b border-border">
            <div className="flex items-center justify-between text-xs font-sans font-semibold uppercase tracking-[0.1em] text-ink mb-2">
              <span>Products</span>
            </div>

            {/* Processing Line Mobile Toggle */}
            <div className="space-y-1">
              <button
                onClick={() => setMobileProcessingOpen(!mobileProcessingOpen)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm bg-canvas border border-border font-semibold text-ink transition-colors duration-150"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sage" />
                  <span>Processing Line</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-sage transition-transform duration-150 ${
                    mobileProcessingOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* All 12 processing lines under mobile accordion */}
              {mobileProcessingOpen && (
                <div className="pl-4 pr-1 py-1.5 space-y-1 bg-canvas/60 rounded-lg border border-border">
                  <button
                    onClick={() => handleNav('/products/processing-line')}
                    className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-ink border-b border-border mb-1"
                  >
                    View All Processing Lines →
                  </button>
                  {PROCESSING_LINES.map((line) => (
                    <button
                      key={line.id}
                      onClick={() => handleNav(`/products/processing-line/${line.slug}`)}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors duration-150 ${
                        currentPath === `/products/processing-line/${line.slug}`
                          ? 'bg-ivory text-ink font-semibold border border-border'
                          : 'text-ink hover:bg-ivory'
                      }`}
                    >
                      {line.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Direct link for Equipments */}
              <button
                onClick={() => handleNav('/products/equipments')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors duration-150 ${
                  currentPath === '/products/equipments'
                    ? 'bg-canvas font-semibold text-ink border border-border'
                    : 'text-ink hover:bg-canvas'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Cog className="w-4 h-4 text-sage" />
                  <span>Equipments</span>
                </span>
                <span className="text-xs font-sans font-medium tabular-nums text-ink">29 Units</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => handleNav('/services')}
            className={`w-full text-left py-2.5 text-base font-medium border-b border-border transition-colors duration-150 ${
              currentPath === '/services' ? 'text-ink font-semibold underline decoration-sage underline-offset-4' : 'text-ink'
            }`}
          >
            Services
          </button>

          <button
            onClick={() => handleNav('/gallery')}
            className={`w-full text-left py-2.5 text-base font-medium border-b border-border transition-colors duration-150 ${
              currentPath === '/gallery' ? 'text-ink font-semibold underline decoration-sage underline-offset-4' : 'text-ink'
            }`}
          >
            Gallery
          </button>

          <button
            onClick={() => handleNav('/contact')}
            className={`w-full text-left py-2.5 text-base font-medium border-b border-border transition-colors duration-150 ${
              currentPath === '/contact' ? 'text-ink font-semibold underline decoration-sage underline-offset-4' : 'text-ink'
            }`}
          >
            Contact us
          </button>

          <div className="pt-3">
            <button
              onClick={() => handleNav('/contact')}
              className="w-full py-3 text-center text-sm font-semibold text-ivory bg-ink hover:bg-ink-hover rounded-xl transition-colors duration-150 shadow-soft-diffused"
            >
              Request Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
