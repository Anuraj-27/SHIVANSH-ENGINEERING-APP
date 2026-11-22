import { useState, useEffect } from 'react';
import { GalleryPhoto } from './mediaStore';

export type PublishedMediaSection =
  | 'homepage_showcase'
  | 'homepage_hero'
  | 'gallery'
  | 'processing_line'
  | 'equipment';

export interface PublishedMediaItem {
  id: string;
  section: PublishedMediaSection;
  slot: string | null;
  title: string;
  altText: string;
  imageUrl: string;
  displayOrder: number;
  category?: 'processing-line' | 'equipment' | 'installation';
  location?: string;
  speed?: string;
  uploadedAt?: string;
}

interface MediaApiResponse {
  ok?: boolean;
  items?: PublishedMediaItem[];
}

let cachedItems: PublishedMediaItem[] | null = null;
let inFlightRequest: Promise<PublishedMediaItem[]> | null = null;

export function normalizeMediaSlot(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’'`"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function fetchPublishedMedia(): Promise<PublishedMediaItem[]> {
  if (cachedItems !== null) {
    return cachedItems;
  }

  if (!inFlightRequest) {
    inFlightRequest = fetch('/api/media', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then(async (res) => {
        if (!res.ok) return [];
        const data = (await res.json().catch(() => null)) as MediaApiResponse | null;
        if (!data?.ok || !Array.isArray(data.items)) return [];
        cachedItems = data.items;
        return data.items;
      })
      .catch(() => [])
      .finally(() => {
        inFlightRequest = null;
      });
  }

  return inFlightRequest;
}

export function usePublishedMedia(): { items: PublishedMediaItem[]; loaded: boolean } {
  const [items, setItems] = useState<PublishedMediaItem[]>(cachedItems ?? []);
  const [loaded, setLoaded] = useState<boolean>(cachedItems !== null);

  useEffect(() => {
    let active = true;
    fetchPublishedMedia().then((result) => {
      if (!active) return;
      setItems(result);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  return { items, loaded };
}

export function getPublishedHomepageHero(items: PublishedMediaItem[]): PublishedMediaItem | null {
  const heroItem = items.find((item) => item.section === 'homepage_hero');
  if (heroItem) return heroItem;
  return items.find((item) => item.section === 'homepage_showcase') || null;
}

export interface PublishedGalleryPhoto extends GalleryPhoto {
  altText?: string;
}

export function getPublishedGalleryPhotos(items: PublishedMediaItem[]): PublishedGalleryPhoto[] {
  return items
    .filter((item) => item.section === 'gallery')
    .map((item) => ({
      id: item.id,
      title: item.title,
      altText: item.altText || item.title,
      category: item.category || 'processing-line',
      location: item.location || 'Shivansh Engineering Works',
      speed: item.speed || 'Published OEM Media',
      imageUrl: item.imageUrl,
      uploadedAt: item.uploadedAt || '',
    }));
}

export function getPublishedProcessingLineImage(
  items: PublishedMediaItem[],
  slug: string
): PublishedMediaItem | null {
  const target = normalizeMediaSlot(slug);
  return (
    items.find(
      (item) =>
        item.section === 'processing_line' &&
        item.slot !== null &&
        normalizeMediaSlot(item.slot) === target
    ) || null
  );
}

export function getPublishedEquipmentImage(
  items: PublishedMediaItem[],
  equipmentName: string
): PublishedMediaItem | null {
  const target = normalizeMediaSlot(equipmentName);
  return (
    items.find(
      (item) =>
        item.section === 'equipment' &&
        item.slot !== null &&
        normalizeMediaSlot(item.slot) === target
    ) || null
  );
}
