import { Controller, Get, Post, Delete, Param, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(
    @Body('postId') postId: string,
    @Body('authorName') authorName: string,
    @Body('body') body: string,
    @Body('parentId') parentId?: string,
  ) {
    if (!authorName || !body) throw new BadRequestException('Fields cannot be empty');
    return this.commentsService.createComment(
      parseInt(postId, 10),
      authorName,
      body,
      parentId ? parseInt(parentId, 10) : undefined,
    );
  }

  @Get(':postId')
  async getComments(@Param('postId') postId: string) {
    return this.commentsService.getCommentsForPost(parseInt(postId, 10));
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteComment(@Param('id') id: string) {
    return this.commentsService.deleteComment(parseInt(id, 10));
  }
}
