import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('latest')
  async getLatest(@Query('limit') limit: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 3;
    return this.postsService.getLatestPosts(parsedLimit);
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.postsService.getPostBySlug(slug);
  }

  @Post(':id/view')
  async incrementView(@Param('id') id: string) {
    await this.postsService.incrementViews(parseInt(id, 10));
    return { success: true };
  }

  @Post(':id/like')
  async incrementLike(@Param('id') id: string) {
    await this.postsService.incrementLikes(parseInt(id, 10));
    return { success: true };
  }
}
