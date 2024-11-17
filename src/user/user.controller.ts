import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Req() req: Request) {
    const userId = req.user['id'];
    return this.userService.getUser(userId);
  }

  @Get('get-followers')
  async getFollowers(@Req() req: Request) {
    const userId = req.user['id'];
    return this.userService.getUser(userId);
  }
}
