import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { NotificationModule } from './notification/notification.module';
import { PostModule } from './post/post.module';
import { FollowRequestModule } from './follow-request/follow-request.module';
import { TrumpetModule } from './trumpet/trumpet.module';

@Module({
  imports: [UserModule, AuthModule, DatabaseModule, NotificationModule, PostModule, FollowRequestModule, TrumpetModule],
  providers: [],
})
export class AppModule {}
