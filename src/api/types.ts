export type Offer = {
  id: number;
  offerDescription: string;
  storeName: string;
  expireDate?: string;
  creationDate?: string;
  imagePath?: string;
  imageUrl?: string;
  storeId?: number;
  storeType?: string;
};

export type Store = {
  id: number;
  storeName: string;
  address?: string;
  activeOffers?: number;
  storeRate?: number;
  storeType?: string;
  logoPath?: string;
  logoUrl?: string;
};

// Deploy-time settings served by GET /api/v1/app-config.
export type AppConfig = {
  homeSlides: string[];
  sponsor: {name: string; logoUrl?: string; url?: string} | null;
  sectorImages: Record<string, string>;
  adPopup: {imageUrl: string; durationSeconds: number} | null;
  social: {facebook?: string; instagram?: string; whatsapp?: string};
  supportEmail?: string;
  serviceNumbers: string[];
};
