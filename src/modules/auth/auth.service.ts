import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  
  private readonly ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
  private readonly ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

  constructor(private jwtService: JwtService) {}

  async login(username: string, password: string) {
    if (username !== this.ADMIN_USERNAME || password !== this.ADMIN_PASSWORD) {
      throw new UnauthorizedException('Invalid credentials');
    }

    
    const token = await this.jwtService.signAsync({ username, role: 'admin' });
    return token;
  }
}
