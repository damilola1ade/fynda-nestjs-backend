import { Module } from '@nestjs/common';
import { TrumpetController } from './trumpet.controller';
import { TrumpetService } from './trumpet.service';

@Module({
  controllers: [TrumpetController],
  providers: [TrumpetService]
})
export class TrumpetModule {}
