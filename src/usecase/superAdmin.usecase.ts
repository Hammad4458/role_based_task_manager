import {  Injectable, UnauthorizedException } from "@nestjs/common";
import { SuperAdmin } from "src/infrastructure/orm/entities/superAdmin.entity";
import { SuperAdminRepository } from "src/infrastructure/orm/repositories/superAdmin.repositories";
import { BcryptService } from "src/infrastructure/services/bcrypt/bcrypt.service";
import { JwtService } from "src/infrastructure/services/jwt/jwt.service";

@Injectable()
export class SuperAdminUseCase {
  constructor(
    private readonly superAdminRepo: SuperAdminRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(body: { name: string; email: string; password: string }) {
    const hashedPassword = await this.bcryptService.hashPassword(body.password);
    return await this.superAdminRepo.createUser({ ...body, password: hashedPassword });
  }

  async getAllSuperAdmins(): Promise<SuperAdmin[]> {
    return this.superAdminRepo.getAllSuperAdmins();
  }

  async validateUser(email: string, password: string) {
    const user = await this.superAdminRepo.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await this.bcryptService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    
    const { password: _, ...userWithoutPassword } = user;

    // 🔑 Generate JWT access and refresh tokens
    const payload = { email: user.email, id: user.id };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.signRefreshToken(payload);

    return {
      user: userWithoutPassword,
      access_token,
      refresh_token,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      // Verify the refresh token
      const decoded = this.jwtService.verifyRefreshToken(refreshToken);

      // Check if the user exists
      const user = await this.superAdminRepo.getUserByEmail(decoded.email);
      if (!user || user.id !== decoded.id) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new access token
      const newAccessToken = this.jwtService.sign({ email: user.email, id: user.id });

      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getUserFromToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);

      if (!decoded || !decoded.email || !decoded.id) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.superAdminRepo.getUserByEmail(decoded.email);

      if (!user || user.id !== decoded.id) {
        throw new UnauthorizedException('User not found');
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
