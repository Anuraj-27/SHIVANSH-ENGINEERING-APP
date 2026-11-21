import React, { useState } from 'react';
import { Eye, MapPin, Gauge, X, ArrowRight } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/engineeringData';
import { MachineGraphicPreview } from './MachineGraphicPreview';

export const GallerySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'processing-line' | 'equipment'>('all');
  const [selectedItem, setSelectedItem] = useState<typeof GALLERY_ITEMS[0] | null>(null);

  const filteredItems = activeTab === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section id="gallery" className="py-20 bg-white border-b border-slate-200 relative">
      <div className="blueprint-watermark opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#82C8E5]" />
              FIELD INSTALLATIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Machinery Gallery & Plant Installations
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              Photographic and CAD engineering records from commissioned Shivansh processing lines in steel service centers, automotive plants, and heavy fabrication facilities.
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All (6)
            </button>
            <button
              onClick={() => setActiveTab('processing-line')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'processing-line'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Processing Lines
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'equipment'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Equipments
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft-diffused hover:shadow-card-elevated hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Visual Preview Header */}
                <div className="relative">
                  <MachineGraphicPreview
                    id={
                      item.imageType === 'slitting'
                        ? 'heavy-slitting-line'
                        : item.imageType === 'ctl'
                        ? 'cut-to-length-line'
                        : item.imageType === 'leveler'
                        ? 'precision-leveler'
                        : item.imageType === 'decoiler'
                        ? 'hydraulic-decoiler'
                        : item.imageType === 'tension'
                        ? 'tension-leveling-line'
                        : 'flying-crop-shear'
                    }
                  />

                  {/* Hover inspect overlay badge */}
                  <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-white text-slate-900 font-semibold text-xs rounded-lg shadow-sm flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Inspect Installation</span>
                    </span>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-slate-700 font-mono mb-2">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-[#0284C7]" />
                      {item.location}
                    </span>
                    <span className="text-[#0284C7] font-semibold">{item.speed}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
                <span className="font-mono">COMMISSIONED PROJECT</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  View Specs &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox / Installation Details Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-card-elevated border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                <span className="font-bold text-slate-900">{selectedItem.location}</span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <MachineGraphicPreview
                id={
                  selectedItem.imageType === 'slitting'
                    ? 'heavy-slitting-line'
                    : selectedItem.imageType === 'ctl'
                    ? 'cut-to-length-line'
                    : selectedItem.imageType === 'leveler'
                    ? 'precision-leveler'
                    : selectedItem.imageType === 'decoiler'
                    ? 'hydraulic-decoiler'
                    : selectedItem.imageType === 'tension'
                    ? 'tension-leveling-line'
                    : 'flying-crop-shear'
                }
              />

              <div className="mt-5">
                <div className="text-xs font-mono text-[#0284C7] font-semibold mb-1">
                  SPECIFICATION: {selectedItem.speed}
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedItem.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-xs text-slate-700">
                  ISO 9001:2015 Verified Commissioning
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-900 bg-[#82C8E5] hover:bg-[#68bddf] rounded-lg"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
