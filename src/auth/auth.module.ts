import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { NotificationModule } from 'src/notification/notification.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy';
import { GoogleStrategy } from './strategy/google-oauth.strategy';

@Module({
  imports: [
    NotificationModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signInOptions: {
          expiresIn: '1hr',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, ConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
