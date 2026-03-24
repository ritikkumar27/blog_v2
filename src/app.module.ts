import { Module } from '@nestjs/common';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { WebModule } from './modules/web/web.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [PostsModule, CommentsModule, WebModule, AuthModule, AdminModule],
})
export class AppModule {}
