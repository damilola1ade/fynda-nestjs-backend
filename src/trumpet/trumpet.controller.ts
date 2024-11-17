import { Controller, Get, Req } from '@nestjs/common';
import { TrumpetService } from './trumpet.service';

@Controller('trumpet')
export class TrumpetController {
  constructor(private trumpetService: TrumpetService) {}

  @Get()
  async getTrumpets(@Req() req) {
    const currentUserId = req.user.userId
    return this.trumpetService.getTrumpets(currentUserId);
  }
}
