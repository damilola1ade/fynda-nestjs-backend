import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, RefreshTokenDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: DatabaseService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hashedPassword,
        },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const targetField = (error.meta as { target: string[] })?.target?.[0];
        const message =
          targetField === 'username'
            ? 'Username already exists'
            : 'This email belongs to another user';

        throw new ForbiddenException(message);
      }
      throw error;
    }
  }

  async login(dto: { username: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    // if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException('User does not exists');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new ForbiddenException('Invalid credentials');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('Service_SECRET');

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1hr',
      secret: secret,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: secret,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const result = await this.jwtService.verifyAsync(dto.refreshToken);

    if (!result) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: result.email },
    });

    const token = await this.signToken(result.id, result.email);

    return {
      user,
      token,
    };
  }

  async GoogleOAuthLogin(user: any) {
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    // Check if user exists in the database by email
    let existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    // If user doesn't exist, create a new user
    if (!existingUser) {
      existingUser = await this.prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          avatar: user.picture,
        },
      });
    }

    const token = await this.signToken(existingUser.id, existingUser.email);

    return {
      token: token.accessToken,
      message: 'Login successful',
      user: existingUser,
    };
  }
}
