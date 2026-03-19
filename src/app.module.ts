import { Module } from '@nestjs/common';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { WebModule } from './modules/web/web.module';

@Module({
  imports: [PostsModule, CommentsModule, WebModule],
})
export class AppModule {}
