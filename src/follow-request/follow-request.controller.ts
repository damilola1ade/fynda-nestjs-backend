import { Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { FollowRequestService } from './follow-request.service';
import { JwtGuard } from 'src/auth/guard';

@Controller('follow-request')
export class FollowRequestController {
  constructor(private followRequestService: FollowRequestService) {}

  @Get(':userId')
  async getFollowRequests(@Param('userId') userId: string) {
    return this.followRequestService.getFollowRequests(userId);
  }

  @UseGuards(JwtGuard)
  @Patch('send-request/:receiverId')
  async switchFollow(@Param('receiverId') receiverId: string, @Req() req) {
    const senderId = req.user.id;
    if (!senderId) {
      throw new Error('User ID not found in request');
    }
    return this.followRequestService.switchFollow(receiverId, senderId);
  }

  @Post('accept-request/:requestId')
  async acceptFollowRequest(@Param('requestId') requestId: string, @Req() req) {
    return this.followRequestService.acceptFollowRequest(requestId);
  }

  @Delete('decline-request/:requestId')
  async declineFollowRequest(@Param('requestId') requestId: string, @Req() req) {
    return this.followRequestService.declineFollowRequest(requestId);
  }
}
