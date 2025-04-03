import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService
  ) {}

  // Sign method to generate a JWT token
  sign(payload: { email: string; id: number }): string {
    const secretKey = this.configService.get('jwtConfig').key;
    return this.nestJwtService.sign(payload, { secret: secretKey, expiresIn: "1m" });
  }

  // Sign method to generate a Refresh Token
  signRefreshToken(payload: { email: string; id: number }): string {
    const secretKey = this.configService.get('jwtConfig').refreshKey; 
    return this.nestJwtService.sign(payload, { secret: secretKey, expiresIn: "7d" }); 
  }

  // Verify and decode token
  verify(token: string): any {
    try {
      const secretKey = this.configService.get('jwtConfig').key;
      const decoded = this.nestJwtService.verify(token, { secret: secretKey });
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  // Verify refresh token
  verifyRefreshToken(token: string): any {
    try {
      const secretKey = this.configService.get('jwtConfig').refreshKey;
      const decoded = this.nestJwtService.verify(token, { secret: secretKey });
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}

