import React from 'react';
import { Layers, Cog, ArrowRight, Eye, ShieldCheck, ChevronRight } from 'lucide-react';
import { PRODUCTS_DATA, ProductItem } from '../data/engineeringData';
import { MachineGraphicPreview } from './MachineGraphicPreview';

interface ProductsSectionProps {
  selectedCategory: 'processing-line' | 'equipment';
  onSelectCategory: (cat: 'processing-line' | 'equipment') => void;
  onInspectProduct: (product: ProductItem) => void;
  onRequestQuoteForProduct: (productName: string) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  onInspectProduct,
  onRequestQuoteForProduct,
}) => {
  const filteredProducts = PRODUCTS_DATA.filter((p) => p.category === selectedCategory);

  return (
    <section id="products" className="py-20 bg-slate-50/50 border-b border-slate-200 relative">
      {/* Blueprint watermark */}
      <div className="blueprint-watermark opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#82C8E5]" />
              HARDWARE PORTFOLIO
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Machinery & Engineering Divisions
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              Turnkey processing lines and heavy equipment manufactured to exacting metallurgical tolerances for heavy coil handling, precision slitting, and continuous leveling.
            </p>
          </div>

          {/* Interactive Category Selector Tabs */}
          <div className="inline-flex p-1.5 bg-white border border-slate-200 rounded-xl shadow-xs self-start md:self-end">
            <button
              onClick={() => onSelectCategory('processing-line')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'processing-line'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4 text-[#82C8E5]" />
              <span>Processing Lines (4)</span>
            </button>

            <button
              onClick={() => onSelectCategory('equipment')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === 'equipment'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Cog className="w-4 h-4 text-[#82C8E5]" />
              <span>Equipments (4)</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft-diffused hover:shadow-card-elevated hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Bar inside card */}
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-700">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#82C8E5]" />
                    {product.schematicCode}
                  </span>
                  <span>ISO 9001:2015</span>
                </div>

                {/* Machine Schematic Graphic Preview */}
                <MachineGraphicPreview id={product.id} />

                {/* Machine Title & Tagline */}
                <div className="mt-5">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs font-medium text-[#0284C7] mt-1">
                    {product.tagline}
                  </p>
                  <p className="text-sm text-slate-600 mt-2.5 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Unboxed specs metadata table */}
                <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  {product.specs.slice(0, 4).map((s, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-[11px] text-slate-700">{s.label}</span>
                      <span className="font-mono font-semibold text-slate-800 tabular-nums">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Materials supported - unboxed text with bullet separators */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-700 flex-wrap">
                  <span className="font-semibold text-slate-900">Materials:</span>
                  {product.materialsSupported.slice(0, 3).map((mat, i) => (
                    <React.Fragment key={i}>
                      <span>{mat}</span>
                      {i < 2 && <span className="text-slate-400">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => onInspectProduct(product)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Inspect Specs</span>
                </button>

                <button
                  onClick={() => onRequestQuoteForProduct(product.name)}
                  className="px-4 py-2 text-xs font-bold text-slate-900 bg-[#82C8E5] hover:bg-[#68bddf] rounded-lg transition-colors flex items-center gap-1 shadow-xs active:scale-[0.98]"
                >
                  <span>Request Quote</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner with engineering custom design offer */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 shadow-soft-diffused flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-[#82C8E5] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Custom Coil Width or Heavy Duty Line Gauge Needed?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Shivansh Engineering designs custom decoiling, leveling, and slitting systems tailored to your factory layout and strip alloy specifications.
              </p>
            </div>
          </div>

          <button
            onClick={() => onRequestQuoteForProduct('Custom Engineering Line Inquiry')}
            className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-[#82C8E5] hover:bg-[#68bddf] rounded-xl whitespace-nowrap shadow-xs flex items-center gap-2"
          >
            <span>Consult Chief Design Engineer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
