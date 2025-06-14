import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenUtilsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  getTokenTtl(token: string): number {
    const decoded = this.jwtService.decode(token) as { exp?: number } | null;
    const now = Math.floor(Date.now() / 1000);
    let ttl: number;

    if (decoded?.exp) {
      ttl = decoded.exp - now;
    } else {
      const fallbackMs = this.configService.get<string>(
        'JWT_EXPIRATION_TIME',
        '3600000',
      );
      ttl = Math.floor(parseInt(fallbackMs, 10) / 1000);
    }
    return Math.max(ttl, 0);
  }

  getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers['authorization'] || '';
  return authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
}
}
