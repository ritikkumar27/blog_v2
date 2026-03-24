import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  
  private readonly ADMIN_USERNAME = 'ritik';
  private readonly ADMIN_PASSWORD = 'changethislater123';

  constructor(private jwtService: JwtService) {}

  async login(username: string, password: string) {
    if (username !== this.ADMIN_USERNAME || password !== this.ADMIN_PASSWORD) {
      throw new UnauthorizedException('Invalid credentials');
    }

    
    const token = await this.jwtService.signAsync({ username, role: 'admin' });
    return token;
  }
}
