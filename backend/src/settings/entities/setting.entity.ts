import { Column, Entity, PrimaryColumn } from 'typeorm';

// Admin-edited app settings. A row overrides the environment variable with
// the same key; without a row the environment value is used.
@Entity({ name: 'Settings' })
export class SettingEntity {
  @PrimaryColumn({ name: 'KEY' })
  key!: string;

  @Column({ name: 'VALUE', type: 'text', default: '' })
  value!: string;
}
