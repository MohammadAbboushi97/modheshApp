import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingEntity } from './entities/setting.entity';

// Settings the admin page can change. Their environment variables (see
// .env.example) act as defaults until the admin saves a value.
export const EDITABLE_SETTINGS = [
  'HOME_SLIDES',
  'SPONSOR_NAME',
  'SPONSOR_LOGO',
  'SPONSOR_URL',
  'SECTOR_IMAGES',
  'AD_POPUP_IMAGE',
  'AD_POPUP_SECONDS',
  'SOCIAL_FACEBOOK_URL',
  'SOCIAL_INSTAGRAM_URL',
  'SOCIAL_WHATSAPP_URL',
  'SUPPORT_EMAIL',
  'SERVICE_NUMBERS',
] as const;

export type SettingKey = (typeof EDITABLE_SETTINGS)[number];

@Injectable()
export class SettingsService implements OnModuleInit {
  private overrides = new Map<string, string>();

  constructor(
    @InjectRepository(SettingEntity)
    private readonly repo: Repository<SettingEntity>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const rows = await this.repo.find();
    this.overrides = new Map(rows.map((row) => [row.key, row.value]));
  }

  get(key: SettingKey): string | undefined {
    const raw = this.overrides.has(key)
      ? this.overrides.get(key)
      : this.config.get<string>(key);
    const trimmed = raw?.trim();
    return trimmed ? trimmed : undefined;
  }

  getAll(): Record<SettingKey, string> {
    const values = {} as Record<SettingKey, string>;
    for (const key of EDITABLE_SETTINGS) {
      values[key] = this.get(key) ?? '';
    }
    return values;
  }

  async update(changes: Record<string, unknown>): Promise<void> {
    const rows = EDITABLE_SETTINGS.filter(
      (key) => typeof changes[key] === 'string',
    ).map((key) =>
      this.repo.create({ key, value: (changes[key] as string).trim() }),
    );
    await this.repo.save(rows);
    for (const row of rows) {
      this.overrides.set(row.key, row.value);
    }
  }
}
