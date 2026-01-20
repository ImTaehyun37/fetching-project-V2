import { Controller, Get, Post, Body, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserRole } from '../entities/User.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT token' })
  async login(@Body() body: LoginDto) {
      const result = await this.authService.validateUser(body.username, body.password);
      
      if (result === 'USER_NOT_FOUND') {
          throw new UnauthorizedException('가입되지 않은 사용자 입니다.');
      }
      
      if (result === 'WRONG_PASSWORD') {
          throw new UnauthorizedException('비밀번호가 틀렸습니다.');
      }
      
      return this.authService.login(result);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() body: RegisterDto) {
      await this.authService.register(body);
      return { message: 'Registration successful' };
  }

  @Get('logout')
  @ApiOperation({ summary: 'Logout' })
  logout() {
      return { message: 'Logout successful' };
  }
}
