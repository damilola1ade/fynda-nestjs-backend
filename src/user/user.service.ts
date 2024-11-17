import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private prisma: DatabaseService) {}

  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            followers: true,
            followings: true,
            posts: true,
          },
        },
        // followers: true,
        followings: true
      },
    });

    return user;
  }

  async getFollowRequests(userId: string) {
    return this.prisma.follower.findMany({
      where: {
        followerId: userId,
      },
    });
  }
}
