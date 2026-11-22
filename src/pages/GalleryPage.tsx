import React, { useState } from 'react';
import { Image as ImageIcon, MapPin, X, Eye } from 'lucide-react';
import { DEFAULT_GALLERY } from '../services/mediaStore';
import {
  usePublishedMedia,
  getPublishedGalleryPhotos,
  PublishedGalleryPhoto,
} from '../services/publishedMedia';
import { useRouter } from '../router/Router';

export const GalleryPage: React.FC = () => {
  const { navigate } = useRouter();
  const { items: publishedMedia } = usePublishedMedia();
  const publishedGallery = getPublishedGalleryPhotos(publishedMedia);
  const galleryItems: PublishedGalleryPhoto[] =
    [...publishedGallery, ...DEFAULT_GALLERY];

  const [activeTab, setActiveTab] = useState<'all' | 'processing-line' | 'equipment'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PublishedGalleryPhoto | null>(null);

  const filteredItems =
    activeTab === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeTab);

  return (
    <div className="bg-canvas min-h-[80vh] py-16 border-b border-border relative font-sans">
      <div className="blueprint-watermark" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="border-b border-border pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.1em] text-ink mb-2">
              <ImageIcon className="w-4 h-4 text-sage" />
              FIELD INSTALLATIONS &amp; WORKSHOP MACHINERY
            </div>
            <h1 className="font-display font-normal text-4xl sm:text-5xl text-ink tracking-normal">
              Gallery
            </h1>
          </div>

          {/* Interactive filter tabs */}
          <div className="inline-flex p-1 bg-ivory border border-border rounded-xl self-start md:self-end">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors duration-150 ${
                activeTab === 'all'
                  ? 'bg-ink text-ivory'
                  : 'text-ink hover:bg-canvas'
              }`}
            >
              All ({galleryItems.length})
            </button>
            <button
              onClick={() => setActiveTab('processing-line')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors duration-150 ${
                activeTab === 'processing-line'
                  ? 'bg-ink text-ivory'
                  : 'text-ink hover:bg-canvas'
              }`}
            >
              Processing Lines
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors duration-150 ${
                activeTab === 'equipment'
                  ? 'bg-ink text-ivory'
                  : 'text-ink hover:bg-canvas'
              }`}
            >
              Equipments
            </button>
          </div>
        </div>

        {/* Section Title */}
        <div className="border-b border-border pb-3 mb-8 flex items-center justify-between gap-4">
          <h2 className="font-display font-normal text-2xl sm:text-3xl text-ink tracking-normal">
            Commissioned Field Installations &amp; OEM Machinery
          </h2>
          <span className="text-xs font-sans font-medium tabular-nums text-ink shrink-0">
            {filteredItems.length} Photographs on file
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="bg-ivory rounded-2xl border border-border overflow-hidden shadow-soft-diffused hover:border-sage hover:shadow-card-elevated transition-[border-color,box-shadow] duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-canvas overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.altText || item.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      const fallback = `${window.location.origin}/slitting-line-factory.png`;
                      if (target.src !== fallback) {
                        target.src = '/slitting-line-factory.png';
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                    <span className="px-3.5 py-2 bg-ivory text-ink border border-border font-semibold text-xs rounded-xl shadow-soft-diffused flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-sage" />
                      <span>View Photo</span>
                    </span>
                  </div>
                  <div className="absolute top-2.5 left-2.5 bg-ink text-ivory text-[10px] font-sans font-medium px-2.5 py-0.5 rounded-md uppercase tracking-[0.08em]">
                    {item.category}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-ink font-sans tabular-nums mb-2">
                    <span className="flex items-center gap-1 text-ink truncate max-w-[65%]">
                      <MapPin className="w-3 h-3 text-sage shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                    <span className="text-ink font-semibold shrink-0">{item.speed}</span>
                  </div>

                  <h3 className="text-base font-semibold text-ink line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="px-5 pb-4 pt-2 border-t border-border flex items-center justify-between text-xs text-ink font-sans uppercase tracking-[0.08em]">
                <span>COMMISSIONED OEM</span>
                <span className="font-semibold text-ink">SHIVANSH EN陆续</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action */}
        <div className="p-8 rounded-2xl border border-border bg-ivory shadow-soft-diffused flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-normal text-xl sm:text-2xl text-ink">
              Installation GA Drawings &amp; Plant Layouts
            </h3>
            <div className="text-xs font-sans font-semibold text-ink uppercase tracking-[0.1em] mt-1">
              General Arrangement (GA) Engineering Drawings Available
            </div>
          </div>

          <button
            onClick={() => navigate('/contact')}
            className="px-7 py-3 text-xs sm:text-sm font-semibold text-ivory bg-ink hover:bg-ink-hover rounded-xl transition-colors duration-150 shadow-soft-diffused whitespace-nowrap"
          >
            Contact Engineering Team
          </button>
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-ivory rounded-2xl shadow-card-elevated border border-border-strong overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-canvas">
              <div className="flex items-center gap-2 text-xs font-sans tabular-nums text-ink">
                <MapPin className="w-3.5 h-3.5 text-sage" />
                <span className="font-semibold text-ink">{selectedPhoto.location}</span>
                <span className="text-ink/50">·</span>
                <span className="text-ink font-semibold">{selectedPhoto.speed}</span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-1.5 text-ink hover:bg-ivory border border-transparent hover:border-border rounded-xl transition-colors duration-150"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="aspect-[16/10] bg-canvas rounded-xl overflow-hidden border border-border mb-5">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.altText || selectedPhoto.title}
                  onError={(e) => {
                    const target = e.currentTarget;
                    const fallback = `${window.location.origin}/slitting-line-factory.png`;
                    if (target.src !== fallback) {
                      target.src = '/slitting-line-factory.png';
                    }
                  }}
                  className="w-full h-full object-contain bg-ink"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-normal text-xl sm:text-2xl text-ink">
                    {selectedPhoto.title}
                  </h3>
                  <div className="text-xs text-ink font-sans font-medium uppercase tracking-[0.08em] mt-1">
                    Category: {selectedPhoto.category.toUpperCase()}
                  </div>
                </div>

                <button
                  onClick={() => navigate('/contact')}
                  className="px-6 py-2.5 text-xs font-semibold text-ivory bg-ink hover:bg-ink-hover rounded-xl whitespace-nowrap transition-colors duration-150 shadow-soft-diffused"
                >
                  Inquire on Similar System
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
