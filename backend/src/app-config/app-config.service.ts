import { Injectable } from '@nestjs/common';
import { ImageUrlService } from '../images/image-url.service';
import { SettingKey, SettingsService } from '../settings/settings.service';

export interface AppConfigResource {
  homeSlides: string[];
  sponsor: { name: string; logoUrl?: string; url?: string } | null;
  sectorImages: Record<string, string>;
  adPopup: { imageUrl: string; durationSeconds: number } | null;
  social: { facebook?: string; instagram?: string; whatsapp?: string };
  supportEmail?: string;
  serviceNumbers: string[];
}

// Client-facing settings: edited on the admin page, with environment
// variables as defaults, so they change without rebuilding the mobile app.
@Injectable()
export class AppConfigService {
  constructor(
    private readonly settings: SettingsService,
    private readonly imageUrls: ImageUrlService,
  ) {}

  getClientConfig(): AppConfigResource {
    const sponsorName = this.value('SPONSOR_NAME');
    const adImage = this.imageUrls.toUrl(this.value('AD_POPUP_IMAGE'));

    return {
      homeSlides: this.list('HOME_SLIDES')
        .map((key) => this.imageUrls.toUrl(key))
        .filter((url): url is string => Boolean(url)),
      sponsor: sponsorName
        ? {
            name: sponsorName,
            logoUrl: this.imageUrls.toUrl(this.value('SPONSOR_LOGO')),
            url: this.value('SPONSOR_URL'),
          }
        : null,
      sectorImages: this.sectorImages(),
      adPopup: adImage
        ? {
            imageUrl: adImage,
            durationSeconds: Number(this.value('AD_POPUP_SECONDS') ?? 4) || 4,
          }
        : null,
      social: {
        facebook: this.value('SOCIAL_FACEBOOK_URL'),
        instagram: this.value('SOCIAL_INSTAGRAM_URL'),
        whatsapp: this.value('SOCIAL_WHATSAPP_URL'),
      },
      supportEmail: this.value('SUPPORT_EMAIL'),
      serviceNumbers: this.list('SERVICE_NUMBERS'),
    };
  }

  // SECTOR_IMAGES=HoReCa:sectors/horeca.png,Retail:sectors/retail.png
  private sectorImages(): Record<string, string> {
    const images: Record<string, string> = {};
    for (const entry of this.list('SECTOR_IMAGES')) {
      const separator = entry.indexOf(':');
      if (separator <= 0) {
        continue;
      }
      const url = this.imageUrls.toUrl(entry.slice(separator + 1).trim());
      if (url) {
        images[entry.slice(0, separator).trim()] = url;
      }
    }
    return images;
  }

  private value(key: SettingKey): string | undefined {
    return this.settings.get(key);
  }

  private list(key: SettingKey): string[] {
    return (this.value(key) ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}
