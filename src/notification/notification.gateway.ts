import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { NotificationService } from './notification.service';

export interface NotificationData {
  id?: string;
  senderId: string;
  senderName: string;
  avatar: string;
  message: string;
  seenByReceiver: boolean;
  createdAt: Date;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly notificationService: NotificationService) {}

  @WebSocketServer() server: Server;

  handleConnection(client: any) {
    const userId = client.handshake.query.userId;
    if (userId) {
      client.join(userId);
      console.log('Client connected:', client.id, 'User ID:', userId);
    }
  }

  handleDisconnect() {}

  async notifyUser(userId: string, data: NotificationData) {
    const notificationData: NotificationData = {
      senderId: data.senderId,
      senderName: data.senderName,
      avatar: data.avatar,
      message: data.message,
      seenByReceiver: false,
      createdAt: new Date(),
    };

    // Emit the notification to the user
    this.server.to(userId).emit('notifications', notificationData);

    // Save the notification in the database
    try {
      await this.notificationService.saveNotificationToDatabase(
        userId,
        notificationData,
      );
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  }
}
