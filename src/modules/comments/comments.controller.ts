import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(
    @Body('postId') postId: string,
    @Body('authorName') authorName: string,
    @Body('body') body: string,
  ) {
    return this.commentsService.createComment(parseInt(postId, 10), authorName, body);
  }

  @Get(':postId')
  async getApprovedComments(@Param('postId') postId: string) {
    return this.commentsService.getApprovedComments(parseInt(postId, 10));
  }

  @Patch(':id/approve')
  async approveComment(@Param('id') id: string) {
    return this.commentsService.approveComment(parseInt(id, 10));
  }
}
