import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { WebModule } from './modules/web/web.module';

@Module({
  imports: [PostsModule, CommentsModule, WebModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
