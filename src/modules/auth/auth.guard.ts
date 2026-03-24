import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['blog_token']; 

    if (!token) {
      throw new UnauthorizedException('You must be logged in');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'RITIK_SUPER_SECRET_KEY_123', 
      });
      request['user'] = payload; 
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    
    return true;
  }
}
