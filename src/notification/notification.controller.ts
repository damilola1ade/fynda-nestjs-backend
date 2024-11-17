import { Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':userId')
  async getNotificationsFromDatabase(@Param('userId') userId: string) {
    return this.notificationService.getNotificationsFromDatabase(userId);
  }

  @Patch('/read-notification/:notificationId')
  async readNotification(@Param('notificationId') notificationId: string) {
    return this.notificationService.readNotification(notificationId);
  }

  @Delete('/delete/:userId')
  async deleteNotifications(@Param('userId') userId: string) {
    return this.notificationService.deleteNotifications(userId);
  }
}
