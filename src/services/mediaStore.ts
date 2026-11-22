export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'processing-line' | 'equipment' | 'installation';
  location: string;
  speed: string;
  imageUrl: string;
  uploadedAt: string;
}

export interface ProcessingLineMedia {
  [lineSlug: string]: {
    mainImage: string;
    additionalImages?: string[];
  };
}

export interface EquipmentMedia {
  [equipmentName: string]: {
    imageUrl: string;
    caption?: string;
  };
}

export interface LandingShowcaseImage {
  id: string;
  title: string;
  imageUrl: string;
}

export const STORAGE_KEYS = {
  GALLERY: 'shivansh_gallery_media',
  PROCESSING_LINES: 'shivansh_processing_lines_media',
  EQUIPMENTS: 'shivansh_equipments_media',
  LANDING_IMAGES: 'shivansh_landing_images',
  HERO_IMAGE: 'shivansh_hero_media',
};

// Initial default landing showcase images
export const DEFAULT_LANDING_IMAGES: LandingShowcaseImage[] = [
  {
    id: 'landing-1',
    title: 'CONTINUOUS HIGH-SPEED SLITTING LINE',
    imageUrl: '/slitting-line-factory.png',
  },
  {
    id: 'landing-2',
    title: 'CNC 6-HI PRECISION ROLLER LEVELER',
    imageUrl: '/Gemini_Generated_Image_gd0eubgd0eubgd0e.png',
  },
  {
    id: 'landing-3',
    title: 'FLYING SHEAR CUT-TO-LENGTH SYSTEM',
    imageUrl: '/slitting-line-factory.png',
  },
  {
    id: 'landing-4',
    title: 'HEAVY-DUTY DOUBLE MANDREL DECOILER',
    imageUrl: '/Gemini_Generated_Image_gd0eubgd0eubgd0e.png',
  },
  {
    id: 'landing-5',
    title: 'CONTINUOUS TENSION LEVELING LINE',
    imageUrl: '/slitting-line-factory.png',
  },
];

// Initial default gallery items
export const DEFAULT_GALLERY: GalleryPhoto[] = [
  {
    id: 'gal-1',
    title: 'Continuous High-Speed Slitting Line - 2200mm Width',
    category: 'processing-line',
    location: 'Sanaswadi Plant II, Pune',
    speed: '300 m/min',
    imageUrl: '/slitting-line-factory.png',
    uploadedAt: '2026-01-15',
  },
  {
    id: 'gal-2',
    title: 'Precision Flying Shear Cut-To-Length Line',
    category: 'processing-line',
    location: 'Automotive Cluster, Chakan',
    speed: '120 cuts/min',
    imageUrl: '/slitting-line-factory.png',
    uploadedAt: '2026-02-10',
  },
  {
    id: 'gal-3',
    title: 'CNC 6-Hi 21-Roll Cassette Leveler Unit',
    category: 'equipment',
    location: 'Steel Service Center, Gujarat',
    speed: '< 2 I-Units Flatness',
    imageUrl: '/slitting-line-factory.png',
    uploadedAt: '2026-02-28',
  },
  {
    id: 'gal-4',
    title: 'High-Capacity Hydraulic Double-Mandrel Decoiler',
    category: 'equipment',
    location: 'Tube Mill Division, Tarapur',
    speed: '35 MT Payload',
    imageUrl: '/slitting-line-factory.png',
    uploadedAt: '2026-03-05',
  },
  {
    id: 'gal-5',
    title: 'High-Tension Elongation Leveling & Tension Bridle Line',
    category: 'processing-line',
    location: 'Aluminium Coil Plant, Belgaum',
    speed: '350 m/min',
    imageUrl: '/slitting-line-factory.png',
    uploadedAt: '2026-03-12',
  },
  {
    id: 'gal-6',
    title: 'Continuous High-Cycle Hydraulic Rotary Crop Shear',
    category: 'equipment',
    location: 'Cold Rolling Mill, Faridabad',
    speed: '16.0 mm Shear Capacity',
    imageUrl: '/slitting-line-factory.png',
    uploadedAt: '2026-03-18',
  },
];

export const getStoredLandingImages = (): LandingShowcaseImage[] => {
  if (typeof window === 'undefined') return DEFAULT_LANDING_IMAGES;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LANDING_IMAGES);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load landing images from storage', e);
  }
  return DEFAULT_LANDING_IMAGES;
};

export const saveLandingImages = (items: LandingShowcaseImage[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LANDING_IMAGES, JSON.stringify(items));
    window.dispatchEvent(new Event('shivansh-media-updated'));
  } catch (e) {
    console.error('Failed to save landing images', e);
  }
};

export const getStoredGallery = (): GalleryPhoto[] => {
  if (typeof window === 'undefined') return DEFAULT_GALLERY;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load gallery from storage', e);
  }
  return DEFAULT_GALLERY;
};

export const saveGallery = (items: GalleryPhoto[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(items));
    window.dispatchEvent(new Event('shivansh-media-updated'));
  } catch (e) {
    console.error('Failed to save gallery', e);
  }
};

export const getStoredProcessingLinesMedia = (): ProcessingLineMedia => {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROCESSING_LINES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load processing lines media', e);
  }
  return {};
};

export const saveProcessingLineMedia = (slug: string, mainImage: string, additionalImages?: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredProcessingLinesMedia();
    current[slug] = {
      mainImage,
      additionalImages: additionalImages || current[slug]?.additionalImages || [],
    };
    localStorage.setItem(STORAGE_KEYS.PROCESSING_LINES, JSON.stringify(current));
    window.dispatchEvent(new Event('shivansh-media-updated'));
  } catch (e) {
    console.error('Failed to save processing line media', e);
  }
};

export const getStoredEquipmentsMedia = (): EquipmentMedia => {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EQUIPMENTS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load equipments media', e);
  }
  return {};
};

export const saveEquipmentMedia = (equipmentName: string, imageUrl: string, caption?: string) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredEquipmentsMedia();
    current[equipmentName] = { imageUrl, caption };
    localStorage.setItem(STORAGE_KEYS.EQUIPMENTS, JSON.stringify(current));
    window.dispatchEvent(new Event('shivansh-media-updated'));
  } catch (e) {
    console.error('Failed to save equipment media', e);
  }
};

export const removeEquipmentMedia = (equipmentName: string) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredEquipmentsMedia();
    delete current[equipmentName];
    localStorage.setItem(STORAGE_KEYS.EQUIPMENTS, JSON.stringify(current));
    window.dispatchEvent(new Event('shivansh-media-updated'));
  } catch (e) {
    console.error('Failed to remove equipment media', e);
  }
};

// Helper: Compress image to avoid hitting localStorage limit
export const processAndCompressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const maxDimension = 1280;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
