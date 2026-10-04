import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

// Single admin account configured through ADMIN_USERNAME / ADMIN_PASSWORD.
// Tokens are HMAC-signed with ADMIN_TOKEN_SECRET and expire after 12 hours.
@Injectable()
export class AdminAuthService {
  private readonly logger = new Logger(AdminAuthService.name);
  private readonly username?: string;
  private readonly password?: string;
  private readonly secret: string;

  constructor(config: ConfigService) {
    this.username = config.get<string>('ADMIN_USERNAME')?.trim() || undefined;
    this.password = config.get<string>('ADMIN_PASSWORD') || undefined;
    const secret = config.get<string>('ADMIN_TOKEN_SECRET')?.trim();
    // Without a configured secret, tokens stop working when the server restarts.
    this.secret = secret || randomBytes(32).toString('hex');
    if (!this.username || !this.password) {
      this.logger.warn(
        'ADMIN_USERNAME / ADMIN_PASSWORD not set: the admin page is disabled',
      );
    }
  }

  login(username: string, password: string): { token: string; expiresAt: number } {
    if (
      !this.username ||
      !this.password ||
      !safeEqual(username ?? '', this.username) ||
      !safeEqual(password ?? '', this.password)
    ) {
      throw new UnauthorizedException('Wrong username or password');
    }
    const expiresAt = Date.now() + TOKEN_TTL_MS;
    return { token: `${expiresAt}.${this.sign(expiresAt)}`, expiresAt };
  }

  verify(token?: string): boolean {
    if (!token || !this.username) {
      return false;
    }
    const [expires, signature] = token.split('.');
    const expiresAt = Number(expires);
    return (
      Number.isFinite(expiresAt) &&
      expiresAt > Date.now() &&
      !!signature &&
      safeEqual(signature, this.sign(expiresAt))
    );
  }

  private sign(expiresAt: number): string {
    return createHmac('sha256', this.secret)
      .update(`${this.username}:${expiresAt}`)
      .digest('hex');
  }
}
