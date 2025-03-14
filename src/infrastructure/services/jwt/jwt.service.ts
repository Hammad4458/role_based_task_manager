import { Injectable, Options } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly nestJwtService: NestJwtService,
    private readonly configService:ConfigService   ) {}

  // Sign method to generate a JWT token without an interface
  sign(payload: { email:string , id: number  }): string {
    
    const secretKey= this.configService.get('jwtConfig').key;
    
    return this.nestJwtService.sign(payload, {secret: secretKey, expiresIn:"24h"});
  }

 
}
