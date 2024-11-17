import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PostService {
  constructor(private prisma: DatabaseService) {}

  async getRandomPosts() {
    return this.prisma.post.findMany({
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPostByPostId(postId: string) {
    return this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true,
          },
        },
        comments: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  }

  async switchLike(postId: string, userId: string) {
    try {
      const existingLike = await this.prisma.like.findFirst({
        where: {
          postId,
          userId,
        },
      });
      if (existingLike) {
        await this.prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });
      } else {
        await this.prisma.like.create({
          data: {
            postId,
            userId,
          },
        });
      }
    } catch (err) {
      console.log(err);
      throw new Error('Something went wrong');
    }
  }

  async addComment(postId: string, userId: string, desc: string) {
    try {
      const createdComment = await this.prisma.comment.create({
        data: {
          desc,
          postId,
          userId,
        },
        include: {
          user: true,
        },
      });

      return { createdComment };
    } catch (err) {
      console.log(err);
      throw new Error('Something went wrong');
    }
  }

  async getPostComments(postId: string) {
    return this.prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
