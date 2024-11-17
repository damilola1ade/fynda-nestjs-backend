import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TrumpetService {
  constructor(private prisma: DatabaseService) {}

  async getTrumpets(currentUserId: string) {
    return this.prisma.trumpet.findMany({
      where: {
        expiresAt: {
          gt: new Date(), // Fetch only trumpets that have not expired
        },
        OR: [
          {
            user: {
              followers: {
                some: {
                  followerId: currentUserId, // Check if the current user is a follower
                },
              },
            },
          },
          {
            userId: currentUserId, // Include trumpets created by the current user
          },
        ],
      },
      include: {
        user: true, // Include user data for each trumpet
      },
    });
  }
}
