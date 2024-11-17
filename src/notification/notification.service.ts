import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { NotificationData } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(private prisma: DatabaseService) {}

  async saveNotificationToDatabase(
    userId: string,
    data: NotificationData,
  ): Promise<NotificationData> {
    const savedNotification = await this.prisma.notification.create({
      data: {
        userId,
        senderId: userId,
        senderName: data.senderName,
        avatar: data.avatar,
        message: data.message,
        seenByReceiver: data.seenByReceiver,
        createdAt: data.createdAt,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return {
      id: savedNotification.id,
      senderId: savedNotification.senderId,
      senderName: savedNotification.senderName,
      avatar: savedNotification.avatar,
      message: savedNotification.message,
      seenByReceiver: savedNotification.seenByReceiver,
      createdAt: savedNotification.createdAt,
    };
  }

  async getNotificationsFromDatabase(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async readNotification(notificationId: string) {
    try {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { seenByReceiver: true },
      });

      return {
        message: 'Notification read',
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async deleteNotifications(userId: string) {
    return this.prisma.notification.deleteMany({
      where: {
        userId,
      },
    });
  }
}
