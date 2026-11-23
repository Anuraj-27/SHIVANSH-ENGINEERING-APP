import React, { useState, useEffect } from 'react';
import { Link, RoutePath } from '../router/Router';
import { usePublishedMedia, getPublishedHomepageHero } from '../services/publishedMedia';

interface QuickLinkItem {
  label: string;
  href: RoutePath;
}

const QUICK_LINKS: QuickLinkItem[] = [
  { label: 'Processing Lines', href: '/products/processing-line' },
  { label: 'Heavy-Duty Equipment', href: '/products/equipments' },
  { label: 'Engineering Services', href: '/services' },
  { label: 'Project Gallery', href: '/gallery' },
];

const DEFAULT_HERO_IMAGE_PATH = '/shivansh-home-hero.png';
const DEFAULT_HERO_ALT = 'Rolling mill and steel coil strip processing equipment';

export const HomePage: React.FC = () => {
  const { items: publishedMedia } = usePublishedMedia();
  const publishedHero = getPublishedHomepageHero(publishedMedia);

  const [remoteFailed, setRemoteFailed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);

  useEffect(() => {
    setRemoteFailed(false);
  }, [publishedHero?.imageUrl]);

  const usingRemote = Boolean(publishedHero && !remoteFailed);
  const activeHeroImage = usingRemote && publishedHero ? publishedHero.imageUrl : DEFAULT_HERO_IMAGE_PATH;
  const activeHeroAlt = usingRemote && publishedHero ? publishedHero.altText : DEFAULT_HERO_ALT;

  const handleImageError = () => {
    if (usingRemote) {
      setRemoteFailed(true);
    } else {
      setFallbackFailed(true);
    }
  };

  return (
    <div className="w-full overflow-x-clip bg-canvas font-sans">
      {/* Full-Width Edge-to-Edge Hero Section */}
      <section
        aria-label="Steel Processing Lines and Terminal Equipments"
        className="relative w-full bg-ink overflow-hidden"
      >
        {/* Mobile Top Photo Panel (prevents text from covering the machinery on narrow screens) */}
        <div className="relative w-full h-56 sm:h-72 md:hidden overflow-hidden bg-ink">
          {!fallbackFailed && (
            <img
              src={activeHeroImage}
              alt={activeHeroAlt}
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className="w-full h-full object-cover object-right"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-ink to-transparent pointer-events-none"
          />
        </div>

        {/* Desktop Full-Bleed Background Photo + Deep Slate-Teal Left-to-Right Gradient Overlay */}
        <div className="relative md:min-h-[520px] lg:h-[calc(100vh-9.25rem)] lg:min-h-[540px] lg:max-h-[760px] flex items-center">
          {/* Edge-to-Edge Machinery Photograph (Desktop / Tablet) */}
          <div className="hidden md:block absolute inset-0 overflow-hidden bg-ink">
            {!fallbackFailed && (
              <img
                src={activeHeroImage}
                alt={activeHeroAlt}
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="w-full h-full object-cover object-right"
              />
            )}

            {/* Left-to-Right Deep Ink Scrim: Strong on Left for Copy, Fades Cleanly to Right for Machinery */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(90deg,rgba(25,42,50,0.96)_0%,rgba(25,42,50,0.90)_28%,rgba(41,67,79,0.66)_46%,rgba(41,67,79,0.14)_65%,rgba(41,67,79,0)_80%)]"
            />
            {/* Subtle Vertical Depth Vignette */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,42,50,0.22)_0%,rgba(25,42,50,0)_20%,rgba(25,42,50,0)_85%,rgba(25,42,50,0.2)_100%)]"
            />
          </div>

          {/* Left-Aligned, Vertically Centered Hero Copy & CTAs */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-9 sm:py-12 md:py-16">
            <div className="max-w-[540px] lg:max-w-[580px]">
              <h1 className="font-display font-normal text-[34px] sm:text-[42px] md:text-[48px] lg:text-[54px] text-ivory tracking-normal leading-[1.1] text-balance">
                Steel Processing Lines
                <br className="hidden sm:inline" /> and Terminal Equipments
              </h1>

              {/* Crisp Terracotta Decorative Accent Rule */}
              <div
                aria-hidden="true"
                className="w-14 h-[3px] bg-terracotta rounded-full my-5 sm:my-6"
              />

              <p className="font-sans text-[15px] sm:text-[17px] lg:text-[19px] text-ivory/95 font-normal leading-[1.55] max-w-[490px]">
                Processing lines, roller levelers, and custom machinery for steel plants and metal processors.
              </p>

              {/* Primary & Secondary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 mt-7 sm:mt-8">
                <Link
                  href="/products/processing-line"
                  className="inline-flex items-center justify-center px-6 sm:px-7 py-3.5 text-sm sm:text-[15px] font-semibold text-ivory bg-ink hover:bg-ink-hover border border-ivory/45 hover:border-ivory/70 rounded-lg transition-colors duration-150 shadow-soft-diffused whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  Explore Equipment
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 sm:px-7 py-3.5 text-sm sm:text-[15px] font-semibold text-ivory bg-transparent hover:bg-ivory/12 border-[1.5px] border-ivory/85 hover:border-ivory rounded-lg transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  Discuss Your Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slim Ivory Quick-Link Navigation Row Directly Below Hero */}
      <nav
        aria-label="Key product and service categories"
        className="w-full bg-ivory border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border">
            {QUICK_LINKS.map((item, idx) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-center text-center px-4 py-4 sm:py-5 text-sm sm:text-[15px] font-medium text-ink hover:bg-canvas transition-colors duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink ${
                  idx < 2 ? 'border-b border-border lg:border-b-0' : ''
                } ${idx % 2 === 0 ? 'border-r border-border lg:border-r-0' : ''}`}
              >
                <span className="truncate group-hover:underline decoration-sage underline-offset-4">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};
