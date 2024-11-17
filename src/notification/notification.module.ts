import { Global, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationsGateway } from './notification.gateway';
import { NotificationController } from './notification.controller';

@Global()

@Module({
  providers: [NotificationService, NotificationsGateway],
  controllers: [NotificationController],
  exports: [NotificationService, NotificationsGateway],
})
export class NotificationModule {}
