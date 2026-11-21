import React, { useState } from 'react';
import { X, Check, Download, ArrowRight, ShieldCheck, Cpu, Layers } from 'lucide-react';
import { ProductItem } from '../data/engineeringData';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onRequestQuoteForProduct: (productName: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onRequestQuoteForProduct,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!product) return null;

  const handleDownloadDatasheet = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-card-elevated border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with engineering schematic code */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-[#82C8E5]/20 text-slate-800 rounded">
              {product.schematicCode}
            </span>
            <span className="text-xs font-mono text-slate-700 uppercase">
              {product.category === 'processing-line' ? 'Processing Line Division' : 'Equipment Division'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          {/* Main Title & Tagline */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h2>
            <p className="text-base text-slate-600 mt-2 font-normal">
              {product.description}
            </p>
          </div>

          {/* Technical Specifications Matrix */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#82C8E5]" />
                Engineering Specification Matrix
              </h3>
              <span className="text-xs font-mono text-slate-700">ISO 9001:2015 Spec Sheet</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.specs.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80"
                >
                  <span className="text-xs font-medium text-slate-700">{s.label}</span>
                  <span className="text-xs font-bold font-mono text-slate-900 tabular-nums">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Engineering Features */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-slate-900 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#82C8E5]" />
              Architectural & Structural Highlights
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-[#82C8E5]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#0284C7]" />
                  </div>
                  <span className="leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Materials & Applications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            <div>
              <h4 className="text-xs font-mono font-semibold uppercase text-slate-700 mb-2">
                Compatible Raw Materials
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {product.materialsSupported.map((m, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200 font-medium"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono font-semibold uppercase text-slate-700 mb-2">
                Typical End-Use Applications
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {product.typicalApplications.map((app, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200 font-medium"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quality & Warranty Badge */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#0284C7] shrink-0" />
            <div className="text-xs text-slate-600">
              <strong className="text-slate-900">Shivansh Factory Warranty:</strong> Includes 24-month comprehensive mechanical coverage, on-site commissioning by factory technicians, and lifetime engineering support.
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleDownloadDatasheet}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{downloadSuccess ? 'Datasheet Downloaded (PDF)' : 'Download Technical CAD Datasheet'}</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Close
            </button>
            <button
              onClick={() => {
                onRequestQuoteForProduct(product.name);
                onClose();
              }}
              className="px-5 py-2 text-xs font-bold text-slate-900 bg-[#82C8E5] hover:bg-[#68bddf] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Request Quote for {product.schematicCode}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
