import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  NotificationData,
  NotificationsGateway,
} from 'src/notification/notification.gateway';

@Injectable()
export class FollowRequestService {
  constructor(
    private readonly prisma: DatabaseService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async getFollowRequests(userId: string) {
    return this.prisma.followRequest.findMany({
      where: {
        receiverId: userId,
      },
      include: {
        sender: true,
      },
    });
  }

  async switchFollow(receiverId: string, senderId: string) {
    try {
      // Check if the current user is already following the target user
      const existingFollow = await this.prisma.follower.findFirst({
        where: {
          followerId: receiverId,
          followingId: senderId,
        },
      });

      // Get sender details
      const sender = await this.prisma.user.findUnique({
        where: { id: senderId },
        select: { id: true, name: true, avatar: true },
      });

      let message: string;

      if (existingFollow) {
        // Unfollow if already following
        await this.prisma.follower.delete({
          where: { id: existingFollow.id },
        });
        message = `${sender.name} unfollowed you`;
        const notificationData: NotificationData = {
          senderId: sender.id,
          senderName: sender.name,
          avatar: sender.avatar,
          message,
          seenByReceiver: false,
          createdAt: new Date(),
        };

        // Send the notification
        await this.notificationsGateway.notifyUser(
          receiverId,
          notificationData,
        );

        return { message: 'Unfollowed successfully' };
      } else {
        await this.prisma.follower.create({
          data: {
            followerId: receiverId,
            followingId: senderId,
          },
        });

        message = `${sender.name} is now following you`;

        const notificationData: NotificationData = {
          senderId: sender.id,
          senderName: sender.name,
          avatar: sender.avatar,
          message,
          seenByReceiver: false,
          createdAt: new Date(),
        };

        console.log(sender.id);

        // Send the notification
        await this.notificationsGateway.notifyUser(
          receiverId,
          notificationData,
        );

        return {
          message: 'Followed successfully',
        };
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async acceptFollowRequest(requestId: string) {
    try {
      const existingFollowRequest = await this.prisma.followRequest.findFirst({
        where: { id: requestId },
      });

      if (existingFollowRequest) {
        const { senderId, receiverId } = existingFollowRequest;

        // Remove the follow request after acceptance
        await this.prisma.followRequest.delete({
          where: { id: requestId },
        });

        // Create follower relationship: sender follows receiver
        await this.prisma.follower.create({
          data: {
            followerId: senderId,
            followingId: receiverId,
          },
        });

        // Create mutual follower relationship: receiver follows sender
        await this.prisma.follower.create({
          data: {
            followerId: receiverId,
            followingId: senderId,
          },
        });

        // const message = `Your follow request has been accepted by user ${receiverId}`;
        // this.notificationsGateway.notifyUser(senderId, message);

        return {
          message:
            'Follow request accepted, both users are now following each other',
        };
      }

      return { message: 'Follow request not found' };
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async declineFollowRequest(requestId: string) {
    try {
      await this.prisma.followRequest.delete({
        where: {
          id: requestId,
        },
      });
    } catch (err) {
      console.log(err);
      throw new Error('Something went wrong!');
    }
  }
}
