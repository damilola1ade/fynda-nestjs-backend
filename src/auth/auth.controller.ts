import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, RefreshTokenDto } from './dto';
import { GoogleOauthGuard } from './guard/google-oauth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Post('login')
  async login(@Body() dto: { username: string; password: string }) {
    return this.authService.login(dto);
  }

  @Get('refresh-token')
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async signinWithGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const FRONTEND_URL = process.env.FRONTEND_URL;
      const token = await this.authService.GoogleOAuthLogin(req.user);
      res.redirect(`${FRONTEND_URL}/oauth?token=${token.token}`);
    } catch (err) {
      res.status(500).send({ success: false, message: err.message });
    }
  }
}
