import React from 'react';
import { Cog, ArrowRight, Eye } from 'lucide-react';
import { useRouter } from '../router/Router';
import { usePublishedMedia, getPublishedEquipmentImage } from '../services/publishedMedia';

export const EQUIPMENTS_LIST = [
  'Sink Roll Scraper',
  'Stitcher Unit',
  'Air Knife Box',
  'Mill Mandrel Drum',
  'Molten Metal Pump',
  'Edge Trimmer Unit',
  'Uncoiler Mandrels Drum',
  'Recoiler Mandrel Drum',
  'Steering Unit',
  'Stabilizer Roll Scraper Unit',
  'Hole Punch Machine',
  'Hot Air Dryer',
  'Coil Car',
  'Hot Bridle Roll',
  'Logo Marker',
  'Brushing Units',
  'Belt Wrapper Unit',
  'Bridle Roll Unit',
  'Slitter Head',
  'Shearing Machine',
  'Scrap Baller',
  'Turn Style',
  'Obb Support',
  'Squeeze Roll',
  'Vertical Accumulator',
  'Coil Transfer Car',
  'Leveller Unit',
  'Hydraulics Power Packs',
  'Coil Handling Equipment’s',
];

export const EquipmentsPage: React.FC = () => {
  const { navigate } = useRouter();
  const { items: publishedMedia } = usePublishedMedia();

  return (
    <div className="bg-canvas min-h-[80vh] py-16 border-b border-border relative font-sans">
      <div className="blueprint-watermark" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="border-b border-border pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.1em] text-ink mb-2">
              <Cog className="w-4 h-4 text-sage" />
              PRODUCT DIVISION · OEM HARDWARE
            </div>
            <h1 className="font-display font-normal text-3xl sm:text-4xl text-ink tracking-normal">
              Equipments
            </h1>
          </div>

          <div className="text-xs font-sans text-ink font-semibold uppercase tracking-[0.1em]">
            TOTAL 29 HEAVY MACHINERY &amp; AUXILIARY UNITS
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h2 className="font-display font-normal text-xl sm:text-2xl text-ink tracking-normal leading-snug">
            Specialized Machinery &amp; Auxiliary Units for Metal Rolling Industry
          </h2>
        </div>

        {/* 4 Items Per Row Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-16">
          {EQUIPMENTS_LIST.map((name, idx) => {
            const publishedPhoto = getPublishedEquipmentImage(publishedMedia, name);
            return (
              <div
                key={idx}
                onClick={() => navigate('/contact')}
                className="bg-ivory rounded-2xl border border-border p-5 min-h-[125px] flex flex-col items-center justify-center text-center shadow-soft-diffused hover:shadow-card-elevated hover:border-sage transition-[border-color,box-shadow] duration-200 cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-2.5 right-3 text-[11px] font-sans font-medium tabular-nums text-ink/70">
                  #{String(idx + 1).padStart(2, '0')}
                </div>

                {publishedPhoto ? (
                  <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 border border-border bg-canvas relative">
                    <img
                      src={publishedPhoto.imageUrl}
                      alt={publishedPhoto.altText}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-ink/35 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-ivory" />
                    </div>
                  </div>
                ) : null}

                <h3 className="text-sm sm:text-base font-semibold text-ink leading-snug font-sans">
                  {name}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Bottom Consultation & Action Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-normal text-xl sm:text-2xl text-ink">
              Custom Technical Specs &amp; Engineering Drawings
            </h3>
            <div className="text-xs font-sans font-semibold text-ink uppercase tracking-[0.1em] mt-1">
              Manufactured as per International Tolerances &amp; Plant Layouts
            </div>
          </div>

          <button
            onClick={() => navigate('/contact')}
            className="px-7 py-3 text-xs sm:text-sm font-semibold text-ivory bg-ink hover:bg-ink-hover rounded-xl transition-colors duration-150 shadow-soft-diffused flex items-center gap-2 font-sans whitespace-nowrap"
          >
            <span>Request Equipment Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
