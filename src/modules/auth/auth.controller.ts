import { Controller, Get, Post, Body, Res, Render } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('admin')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Get('login')
  @Render('admin/login')
  loginPage() {
    return {};
  }

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      const token = await this.authService.login(username, password);
      
      res.cookie('blog_token', token, {
        httpOnly: true,   
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });
      
      res.redirect('/admin');
    } catch {
      res.render('admin/login', { error: 'Invalid username or password' });
    }
  }
}
