import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/guard';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async getRandomPosts() {
    return this.postService.getRandomPosts();
  }

  @Get(':postId')
  async getPostByPostId(@Param('postId') postId: string) {
    return this.postService.getPostByPostId(postId);
  }

  @UseGuards(JwtGuard)
  @Patch('like-post/:postId')
  async switchLike(@Param('postId') postId: string, @Req() req) {
    const userId = req?.user?.id;
    if (!userId) {
      throw new Error('User is not authenticated');
    }
    return this.postService.switchLike(postId, userId);
  }

  @UseGuards(JwtGuard)
  @Post('add-comment/:postId')
  async addComment(
    @Param('postId') postId: string,
    @Req() req,
    @Body() body: { desc: string },
  ) {
    const userId = req?.user?.id;
    if (!userId) {
      throw new Error('User is not authenticated');
    }
    return this.postService.addComment(postId, userId, body.desc);
  }

  @Get('comments/:postId')
  async getPostComments(@Param('postId') postId: string) {
    return this.postService.getPostComments(postId);
  }
}
